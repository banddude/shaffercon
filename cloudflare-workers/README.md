# Contact form delivery

The live website posts to `shaffercon-contact-form.mikejshaffer.workers.dev`.
Deploy the default Worker in this directory, not the legacy `cloudflare-worker/contact-form-worker` starter.

Delivery uses the native Cloudflare Email Sending binding:
- Fixed recipient: `hello@shaffercon.com`.
- Fixed verified sender: `contactform@form.shaffercon.com`.
- Reply-To: the validated submitter address.
- Intake and attribution fields are retained in a plain-text email.
- There is no GitHub dispatch, public lead branch, or public issue output.
- The UI receives success only after the provider returns a message ID. Inbox receipt remains an end-to-end acceptance check.

Before deployment, verify the destination and onboard the sending domain. Preserve existing Google Workspace MX and existing SPF/DMARC records; any additional sending-domain DNS configuration requires owner approval. The binding is restricted to the exact recipient and sender in `wrangler.toml`. No API token belongs in the source. Remove the now-unused GitHub binding at cutover.

Run `node --test cloudflare-workers/contact-form.test.mjs` from the repository root. Tests use only synthetic data and a mocked email binding; they send no mail.

After deployment, make one synthetic submission through the live form, verify the matching private inbox receipt and Reply-To, and verify no repository dispatch or public issue was created. Do not mark delivery complete based only on HTTP 200. Never put customer payloads or verification-email links in commits, issues, or logs.

The in-memory request throttle is best-effort per isolate, not a global rate limit. Origin checks prevent cross-site browser submissions but do not authenticate arbitrary HTTP clients. Keyword-based silent rejection was removed because ordinary customer wording can match vendor-pitch terms.
