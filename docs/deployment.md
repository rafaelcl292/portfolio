# Oracle deployment

The existing Oracle host is reached through the local SSH alias `cinema-oci`.
Cloudflare manages DNS-only A records for `rafaelcl.com` and `www.rafaelcl.com`.
Nginx serves static releases and Let's Encrypt provides HTTPS. HTTP and `www`
redirect to `https://rafaelcl.com`. Bun is not installed on the server.

## Initial setup

1. Point the two A records at Oracle, preserving all other records.
2. Install `packaging/nginx-http.conf` as `/etc/nginx/sites-available/portfolio`,
   symlink into `sites-enabled`, and create `/var/www/letsencrypt`.
3. Validate with `sudo nginx -t`, then reload Nginx.
4. Issue a certificate with the existing Certbot account:
   `sudo certbot certonly --webroot -w /var/www/letsencrypt -d rafaelcl.com -d www.rafaelcl.com --non-interactive`.
5. Install `packaging/nginx.conf`, validate, and reload Nginx.
6. Configure a renewal deploy hook: `nginx -t && systemctl reload nginx`.
7. Run `bun run deploy` from the committed checkout.

Do not modify Cinema's server block, the shared Cloudflare tunnel, firewall, SSH,
or persistent data. Configuration changes require only a graceful Nginx reload.

## Routine releases

Run `bun install --frozen-lockfile`, `bun check`, `bun run lint`, and `bun run build`.
Commit with Conventional Commits, push, then run `bun run deploy`.

The helper requires a clean Git tree, builds locally, uploads static files, verifies
SHA-256 checksums, and atomically switches `/var/www/portfolio/current`. It checks
origin HTTPS and Cinema health, and confirms Cinema, CheSSH, and rqbit retained
their process IDs. A failed origin check restores the previous symlink. It then
compares the public page and both PDFs to local output. Public-only failures are
reported for investigation; they do not discard an otherwise healthy origin.

`PORTFOLIO_SSH_HOST` can select another configured alias. Keep credentials out of
Git. Prior releases remain under `/var/www/portfolio/releases/`; review disk use
occasionally and retain at least the current and previous releases.

## Rollback

Use the previous absolute release path printed by the deploy helper:

```sh
ssh cinema-oci
sudo ln -s /var/www/portfolio/releases/PREVIOUS_RELEASE /var/www/portfolio/rollback
sudo mv -Tf /var/www/portfolio/rollback /var/www/portfolio/current
curl --fail https://rafaelcl.com/
```

No service restart is needed. Keep separate backups for Nginx configuration
changes; the deployment helper never installs configuration files.

## Health and renewal

```sh
ssh cinema-oci 'sudo nginx -t; systemctl is-active nginx local-cinema chessh rqbit; systemctl status certbot.timer --no-pager'
curl --fail https://rafaelcl.com/
curl --fail https://cinema.rafaelcl.com/api/health
```

Renewal uses `/var/www/letsencrypt`, independent of releases. PDF exports are public,
like the portfolio. The original resumes and unpublished contact details are not uploaded.
