#!/usr/bin/env python3
"""Offline tests for sync-legacy-redirects.py.

Reproduces the PR44 snapshot bug (listed_slugs searched /industry-insights/
sources and planned 708 appends instead of 6) plus partial-variant, hostile
input, pagination and async-operation failure paths. Never touches the API.
"""

import importlib.util
import json
import os
import unittest

SPEC = importlib.util.spec_from_file_location(
    "sync", os.path.join(os.path.dirname(os.path.abspath(__file__)), "sync-legacy-redirects.py"))
sync = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sync)

HOST = sync.ZONE_HOST


def item(iid, source, target=None, pq=True):
    return {"id": f"id-{iid}", "redirect": {
        "source_url": source,
        "target_url": target or f"https://{HOST}/industry-insights/x/",
        "status_code": 301,
        "preserve_query_string": pq,
        "subpath_matching": False,
        "include_subdomains": False,
        "preserve_path_suffix": False,
    }}


def real_shaped_snapshot(slugs_covered):
    """Mirror the REAL list: bare-domain top-level sources for covered slugs
    (both variants), a couple of https-form and /industry-insights/ entries,
    plus a foreign-host row that must be ignored."""
    rows = []
    for i, s in enumerate(sorted(slugs_covered)):
        rows.append(item(f"b{i}", f"{HOST}/{s}", f"https://{HOST}/industry-insights/{s}/"))
        rows.append(item(f"b{i}s", f"{HOST}/{s}/", f"https://{HOST}/industry-insights/{s}/"))
    rows.append(item("h1", f"https://{HOST}/some-https-form"))
    rows.append(item("i1", f"{HOST}/industry-insights/legacy-post"))
    rows.append(item("f1", f"other.example/{HOST}/bogus"))
    return rows


class FakeTransport:
    """pages: list of page descriptors; each is either a rows-list (last page,
    terminates) or a tuple (rows, next_cursor). 'result' may be a non-list to
    test schema failures. get_fail makes every items-GET fail."""

    def __init__(self, pages=None, post_results=None, op_status="completed", get_fail=False):
        self.pages = list(pages or [])
        self.post_results = list(post_results or [])
        self.op_status = op_status
        self.get_fail = get_fail
        self.calls = []

    def __call__(self, method, path, payload=None):
        self.calls.append((method, path, payload))
        if method == "GET" and "/items?" in path:
            if self.get_fail:
                return {"success": False, "errors": [{"message": "boom"}]}
            if not self.pages:
                return {"success": True, "result": [], "result_info": {"cursors": {"after": ""}}}
            page = self.pages.pop(0)
            rows, nxt = page if isinstance(page, tuple) else (page, "")
            return {"success": True, "result": rows, "result_info": {"cursors": {"after": nxt}}}
        if method == "GET" and "/items/" in path:  # operation status
            return {"success": True, "result": {"status": self.op_status}}
        if method == "POST":
            if not self.post_results:
                return {"success": False, "errors": [{"message": "quota"}]}
            return self.post_results.pop(0)
        raise AssertionError(f"unexpected call {method} {path}")


ALL_351 = {f"slug-{i:03d}" for i in range(351)}
NEW3 = {f"brand-new-post-{i}" for i in range(3)}


class CanonicalKey(unittest.TestCase):
    def test_accepted_forms(self):
        for form in (f"{HOST}/a", f"http://{HOST}/a", f"https://{HOST}/a"):
            self.assertEqual(sync.canonical_key(form), f"{HOST}/a")

    def test_rejected(self):
        for bad in ("", None, "other.example/a", f"{HOST}other/a", "ftp://x/a",
                    f"https://evil.{HOST}/a", f"{HOST}//a"):
            self.assertIsNone(sync.canonical_key(bad), bad)


class Planning(unittest.TestCase):
    def test_regression_real_snapshot_plans_six_not_708(self):
        """PR44 bug: coverage must come from top-level sources; 3 new posts
        over a 351-covered snapshot plan exactly 6 variants."""
        items = real_shaped_snapshot(ALL_351)
        payload = sync.plan(items, ALL_351 | NEW3)
        self.assertEqual(len(payload), 6)
        self.assertEqual(len({p["source_url"] for p in payload}), 6)

    def test_all_covered_plans_zero(self):
        items = real_shaped_snapshot(ALL_351 | NEW3)
        self.assertEqual(sync.plan(items, ALL_351 | NEW3), [])

    def test_missing_single_variant_plans_only_that_variant(self):
        items = [item("x1", f"{HOST}/a", f"https://{HOST}/industry-insights/a/")]
        payload = sync.plan(items, {"a"})
        self.assertEqual([p["source_url"] for p in payload], [f"https://{HOST}/a/"])

    def test_existing_source_with_different_target_is_not_reposted(self):
        items = [item("x1", f"{HOST}/a", f"https://{HOST}/somewhere-else/"),
                 item("x2", f"{HOST}/a/", f"https://{HOST}/somewhere-else/")]
        self.assertEqual(sync.plan(items, {"a"}), [])

    def test_http_form_counts_as_covered(self):
        items = [item("x1", f"http://{HOST}/a", f"https://{HOST}/industry-insights/a/"),
                 item("x2", f"https://{HOST}/a/", f"https://{HOST}/industry-insights/a/")]
        self.assertEqual(sync.plan(items, {"a"}), [])


class Fetch(unittest.TestCase):
    def test_get_failure_is_hard_error_not_empty_snapshot(self):
        t = FakeTransport(get_fail=True)
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=t)

    def test_non_list_result_is_hard_error(self):
        t = FakeTransport(pages=[{"not": "a list"}])
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=t)

    def test_pagination_stuck_is_hard_error(self):
        page = real_shaped_snapshot({"a"})
        t = FakeTransport(pages=[(page, "same"), (page, "same")])
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=t)

    def test_duplicate_id_across_pages_is_hard_error(self):
        page = real_shaped_snapshot({"a"})
        t = FakeTransport(pages=[(page, "c1"), page])
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=t)


class Append(unittest.TestCase):
    def payload(self):
        return sync.plan(real_shaped_snapshot(ALL_351), ALL_351 | NEW3)

    def test_append_success_pending_then_completed_with_after_proof(self):
        p = self.payload()
        after = real_shaped_snapshot(ALL_351 | NEW3)
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}],
                          op_status="completed")
        self.assertTrue(sync.append(p, transport=t))

    def test_append_async_failure_raises(self):
        p = self.payload()
        t = FakeTransport(post_results=[{"success": True, "result": {"operation_id": "op1"}}],
                          op_status="failed")
        with self.assertRaises(sync.SyncError):
            sync.append(p, transport=t)

    def test_append_batch_post_failure_raises_before_after_proof(self):
        p = self.payload()
        t = FakeTransport(post_results=[{"success": False, "errors": [{"message": "rate limited"}]}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, transport=t)

    def test_append_after_proof_missing_raises(self):
        p = self.payload()
        after = real_shaped_snapshot(ALL_351)  # new slugs absent
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}],
                          op_status="completed")
        with self.assertRaises(sync.SyncError):
            sync.append(p, transport=t)


class PostSlugs(unittest.TestCase):
    def test_reads_slug_field_not_filename(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, "2026-01-01T00:00:00-file-name.json"), "w") as fh:
                json.dump({"slug": "file-name", "title": "t"}, fh)
            with open(os.path.join(d, "not-json.txt"), "w") as fh:
                fh.write("x")
            self.assertEqual(sync.post_slugs(d), {"file-name"})


if __name__ == "__main__":
    unittest.main(verbosity=2)
