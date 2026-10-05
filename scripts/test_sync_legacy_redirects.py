#!/usr/bin/env python3
"""Offline tests for sync-legacy-redirects.py.

Covers the PR44 snapshot regression (6 planned variants, not 708), Cloudflare
source-scheme semantics (bare matches both schemes; scheme-specific matches
only its scheme), async bulk_operations polling on the OFFICIAL endpoint,
and strict after-proof failure paths (wrong target, wrong flags, changed
originals, count drift, duplicates, malformed items). Never touches the API.
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
ACC = sync.ACCOUNT_ID
LIST = sync.LIST_ID
ITEMS_URL = f"/accounts/{ACC}/rules/lists/{LIST}/items"
OP_URL = f"/accounts/{ACC}/rules/lists/bulk_operations"


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
    (both variants), an https-form row, an /industry-insights/ source row,
    and a foreign-host row that must be ignored."""
    rows = []
    for i, s in enumerate(sorted(slugs_covered)):
        rows.append(item(f"b{i}", f"{HOST}/{s}", f"https://{HOST}/industry-insights/{s}/"))
        rows.append(item(f"b{i}s", f"{HOST}/{s}/", f"https://{HOST}/industry-insights/{s}/"))
    rows.append(item("h1", f"https://{HOST}/some-https-form"))
    rows.append(item("i1", f"{HOST}/industry-insights/legacy-post"))
    rows.append(item("f1", f"other.example/{HOST}/bogus"))
    return rows


class FakeTransport:
    """pages: each entry is rows-list (last page) or (rows, next_cursor).
    'result' may be a non-list to test schema failures. Rejects GETs to the
    WRONG operation endpoint (item lookup) so endpoint regressions fail."""

    def __init__(self, pages=None, post_results=None, op_statuses=("completed",),
                 get_fail=False, op_responses=None, op_get_fail=False):
        self.pages = list(pages or [])
        self.post_results = list(post_results or [])
        self.op_statuses = list(op_statuses)
        self.get_fail = get_fail
        self.op_responses = list(op_responses or [])
        self.op_get_fail = op_get_fail
        self.calls = []

    def __call__(self, method, path, payload=None):
        self.calls.append((method, path, payload))
        if method == "GET" and f"/lists/{LIST}/items/" in path:
            raise AssertionError(f"transport rejects item-lookup path used as operation endpoint: {path}")
        if method == "GET" and path.startswith(f"/accounts/{ACC}/rules/lists/bulk_operations/"):
            if self.op_get_fail:
                return {"success": False, "errors": [{"message": "op gone"}]}
            if self.op_responses:
                return self.op_responses.pop(0)
            if not self.op_statuses:
                return {"success": True, "result": {"status": "running"}}
            status = self.op_statuses.pop(0)
            return {"success": True, "result": {"status": status}}
        if method == "GET" and "/items?" in path:
            if self.get_fail:
                return {"success": False, "errors": [{"message": "boom"}]}
            if not self.pages:
                return {"success": True, "result": [], "result_info": {"cursors": {"after": ""}}}
            page = self.pages.pop(0)
            rows, nxt = page if isinstance(page, tuple) else (page, "")
            return {"success": True, "result": rows, "result_info": {"cursors": {"after": nxt}}}
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
        items = real_shaped_snapshot(ALL_351)
        payload, skipped = sync.plan(items, ALL_351 | NEW3)
        self.assertEqual(len(payload), 6)
        self.assertEqual(len({p["source_url"] for p in payload}), 6)
        self.assertEqual(skipped, [])

    def test_all_covered_plans_zero(self):
        items = real_shaped_snapshot(ALL_351 | NEW3)
        payload, skipped = sync.plan(items, ALL_351 | NEW3)
        self.assertEqual((payload, skipped), ([], []))

    def test_missing_single_variant_plans_only_that_variant(self):
        items = [item("x1", f"{HOST}/a", f"https://{HOST}/industry-insights/a/")]
        payload, skipped = sync.plan(items, {"a"})
        self.assertEqual([p["source_url"] for p in payload], [f"{HOST}/a/"])
        self.assertEqual(skipped, [])

    def test_existing_source_with_different_target_is_not_reposted(self):
        items = [item("x1", f"{HOST}/a", f"https://{HOST}/somewhere-else/"),
                 item("x2", f"{HOST}/a/", f"https://{HOST}/somewhere-else/")]
        payload, skipped = sync.plan(items, {"a"})
        self.assertEqual(payload, [])

    def test_bare_form_covers_https_variant(self):
        items = [item("x1", f"{HOST}/a", f"https://{HOST}/industry-insights/a/"),
                 item("x2", f"{HOST}/a/", f"https://{HOST}/industry-insights/a/")]
        payload, _ = sync.plan(items, {"a"})
        self.assertEqual(payload, [])

    def test_https_form_covers_https_variant(self):
        items = [item("x1", f"https://{HOST}/a"),
                 item("x2", f"https://{HOST}/a/")]
        payload, _ = sync.plan(items, {"a"})
        self.assertEqual(payload, [])

    def test_http_only_does_not_cover_https_and_is_skipped_not_overlapped(self):
        """Cloudflare: scheme-specific source matches only that scheme; a new
        bare-form item would also match http and overlap the http-only item.
        The variant must be skipped, never planned."""
        items = [item("x1", f"http://{HOST}/a"), item("x2", f"http://{HOST}/a/")]
        payload, skipped = sync.plan(items, {"a"})
        self.assertEqual(payload, [])
        self.assertEqual(sorted(s["source_url"] for s in skipped),
                         [f"https://{HOST}/a", f"https://{HOST}/a/"])

    def test_writes_are_bare_domain_form(self):
        payload, _ = sync.plan(real_shaped_snapshot(ALL_351), ALL_351 | NEW3)
        for p in payload:
            self.assertTrue(p["source_url"].startswith(f"{HOST}/"), p["source_url"])
            self.assertFalse(p["source_url"].startswith("http"), p["source_url"])


class Validate(unittest.TestCase):
    def test_malformed_items_raise(self):
        for bad in ({"id": "x"}, {"id": "x", "redirect": "nope"},
                    {"id": "x", "redirect": {"source_url": "", "target_url": "https://a/"}},
                    {"id": "x", "redirect": {"source_url": f"{HOST}/a", "target_url": "not-a-url"}},
                    "string", None):
            with self.assertRaises(sync.SyncError):
                sync.validate_item(bad)

    def test_foreign_host_and_subdomain_rows_are_structurally_valid(self):
        """news./reports. subdomain aliases and foreign hosts are legal list
        entries; they just never count toward our zone coverage."""
        sync.validate_item(item("n1", "news.shaffercon.com/", "https://shaffercon.com/"))
        sync.validate_item(item("f1", "other.example/shaffercon.com/bogus", "https://x.example/"))

    def test_good_item_passes(self):
        sync.validate_item(item("ok", f"{HOST}/a"))


class Fetch(unittest.TestCase):
    def test_get_failure_is_hard_error_not_empty_snapshot(self):
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=FakeTransport(get_fail=True))

    def test_non_list_result_is_hard_error(self):
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=FakeTransport(pages=[{"not": "a list"}]))

    def test_malformed_item_in_snapshot_is_hard_error(self):
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=FakeTransport(pages=[{"id": "x", "redirect": "bad"}]))

    def test_pagination_stuck_is_hard_error(self):
        page = real_shaped_snapshot({"a"})
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=FakeTransport(pages=[(page, "same"), (page, "same")]))

    def test_duplicate_id_across_pages_is_hard_error(self):
        page = real_shaped_snapshot({"a"})
        with self.assertRaises(sync.SyncError):
            sync.fetch_all_items(transport=FakeTransport(pages=[(page, "c1"), page]))


class WaitForOperation(unittest.TestCase):
    def test_polls_official_bulk_operations_endpoint(self):
        t = FakeTransport(op_statuses=("pending", "running", "completed"))
        sync.wait_for_operation("op1", transport=t)
        op_calls = [c for c in t.calls if c[0] == "GET" and c[1].startswith(f"/accounts/{ACC}/rules/lists/bulk_operations/")]
        self.assertGreaterEqual(len(op_calls), 3)
        for c in op_calls:
            self.assertTrue(c[1].startswith(OP_URL + "/op1"), c[1])

    def test_wrong_endpoint_is_rejected_by_transport(self):
        """If the code polls the item-lookup path, the transport throws."""
        t = FakeTransport(op_statuses=("completed",))
        called = []
        orig = t.__call__
        def spy(method, path, payload=None):
            called.append(path)
            if "/items/op1" in path:
                raise AssertionError("item-lookup path used for operations")
            return orig(method, path, payload)
        sync.wait_for_operation("op1", transport=spy)
        self.assertTrue(all("/bulk_operations/" in p for p in called))

    def test_failed_status_raises(self):
        with self.assertRaises(sync.SyncError):
            sync.wait_for_operation("op1", transport=FakeTransport(op_statuses=("failed",)))

    def test_timeout_raises(self):
        old = sync.OP_TIMEOUT_S
        sync.OP_TIMEOUT_S = 0
        try:
            with self.assertRaises(sync.SyncError):
                sync.wait_for_operation("op1", transport=FakeTransport(op_statuses=("running",)))
        finally:
            sync.OP_TIMEOUT_S = old

    def test_malformed_status_response_raises(self):
        for res in ({"success": True, "result": {"nope": 1}}, {"success": True, "result": "running"},
                    {"success": True, "result": None}, {"success": True, "result": {"status": 123}}):
            t = FakeTransport(op_responses=[res])
            with self.assertRaises(sync.SyncError):
                sync.wait_for_operation("op1", transport=t)

    def test_operation_get_api_failure_raises(self):
        t = FakeTransport(op_get_fail=True)
        with self.assertRaises(sync.SyncError):
            sync.wait_for_operation("op1", transport=t)


class Append(unittest.TestCase):
    def payload(self):
        return sync.plan(real_shaped_snapshot(ALL_351), ALL_351 | NEW3)[0]

    def base_snap(self):
        return real_shaped_snapshot(ALL_351)

    def test_cap_guard_blocks_before_any_post(self):
        t = FakeTransport()
        with self.assertRaises(sync.SyncError):
            sync.append(self.payload(), self.base_snap(), transport=t, max_list_items=len(self.base_snap()) + 3)
        self.assertFalse([c for c in t.calls if c[0] == "POST"], "cap guard must fire before any POST")

    def test_missing_operation_id_raises(self):
        t = FakeTransport(post_results=[{"success": True, "result": {}}])
        with self.assertRaises(sync.SyncError):
            sync.append(self.payload(), self.base_snap(), transport=t)

    def test_success_full_proof(self):
        after = self.base_snap() + [item(f"n{i}", p["source_url"], p["target_url"])
                                    for i, p in enumerate(self.payload())]
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}],
                          op_statuses=("pending", "running", "completed"))
        self.assertTrue(sync.append(self.payload(), self.base_snap(), transport=t))

    def test_wrong_target_after_write_raises(self):
        p = self.payload()
        after = self.base_snap() + [item(f"n{i}", x["source_url"],
                                         x["target_url"] if i else f"https://{HOST}/WRONG/")
                                    for i, x in enumerate(p)]
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, self.base_snap(), transport=t)

    def test_wrong_flag_after_write_raises(self):
        p = self.payload()
        after = self.base_snap() + [item(f"n{i}", x["source_url"], x["target_url"],
                                         pq=(i != 0))
                                    for i, x in enumerate(p)]
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, self.base_snap(), transport=t)

    def test_changed_original_raises(self):
        p = self.payload()
        snap = self.base_snap()
        snap[0] = dict(snap[0])
        snap[0]["redirect"] = dict(snap[0]["redirect"])
        snap[0]["redirect"]["target_url"] = f"https://{HOST}/changed/"
        after = snap + [item(f"n{i}", x["source_url"], x["target_url"]) for i, x in enumerate(p)]
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, self.base_snap(), transport=t)

    def test_count_drift_raises(self):
        after = self.base_snap() + [item(f"n{i}", x["source_url"], x["target_url"])
                                    for i, x in enumerate(self.payload())]
        after.append(item("surprise", f"{HOST}/unplanned"))
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(self.payload(), self.base_snap(), transport=t)

    def test_duplicate_sources_after_write_raises(self):
        p = self.payload()
        after = self.base_snap() + [item(f"n{i}", x["source_url"], x["target_url"])
                                    for i, x in enumerate(p)]
        after.append(item("dupe", p[0]["source_url"], p[0]["target_url"]))
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, self.base_snap(), transport=t)

    def test_malformed_row_after_write_raises(self):
        p = self.payload()
        after = self.base_snap() + [item(f"n{i}", x["source_url"], x["target_url"])
                                    for i, x in enumerate(p)]
        after.append({"id": "broken", "redirect": "junk"})
        t = FakeTransport(pages=[after],
                          post_results=[{"success": True, "result": {"operation_id": "op1"}}])
        with self.assertRaises(sync.SyncError):
            sync.append(p, self.base_snap(), transport=t)


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
