# School-domain entry point

Public entry: https://khu-okinawa.pages.dev
Existing backend/test URL: https://khu.ryukyu-okinawa.workers.dev

## Architecture

Pages `khu-okinawa` → service binding `INSTITUTE` → existing Worker `khu` → existing D1 `global-ryukyu-okinawa` and R2 `global-ryukyu-okinawa-media`.

Pages contains only a streaming gateway, no copied application build, credentials, database or media bindings. Normal `pnpm build:vinext` / `pnpm deploy:vinext` updates the shared application for both addresses. Run `pnpm deploy:pages` only when the gateway changes. This script isolates Pages from vinext's generated Worker deployment configuration. The Pages project uses direct uploads; it does not automatically deploy on GitHub pushes.

## Request handling

- All routes (including images, APIs, HTML, RSC) pass through the service binding.
- Unsafe requests require the browser Origin to match the Pages request origin. Only then is Origin adapted for the existing Worker's same-origin check.
- Cookie values remain untouched and host-only; users log in separately on each public hostname.
- Redirects to the backend hostname are rewritten to the requesting Pages/custom hostname. Third-party redirects are unchanged.
- Body streams are forwarded without buffering uploaded files. Upload policies remain enforced by the existing Worker.
- Pages has no persistent content cache. The existing Worker controls static pages and live content.
- Neither Worker public access nor preview URLs are disabled at this stage. School domain has not yet been provided.

## School connection, after exact hostname is assigned

1. Add the school's assigned hostname to this Pages project's Custom domains first.
2. Ask the school DNS administrator to create a CNAME from the assigned hostname to `khu-okinawa.pages.dev` (hostname only, no `https://` or path).
3. Complete any domain verification and wait for HTTPS certificate status to become Active. School CAA records/policies may need administrator review if certificate validation fails.
4. Test public pages, images, Japanese, admin login and upload at the school hostname.
5. Update canonical/Open Graph metadata to the school address, and then plan redirects/restrictions for the test hostnames. The gateway uses a service binding; do not remove the `khu` Worker.

School DNS is not modified by this deployment. No dedicated IP, D1/R2 recreation, paid plan upgrade or scheduled backup is used.

References:
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/pages/functions/advanced-mode/
