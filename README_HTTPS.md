HTTPS development setup (Windows) — mkcert

This project can run the React dev server over HTTPS locally so `getUserMedia` and other secure-context features work as expected.

Recommended approach: use mkcert to create trusted local certificates.

Steps:

1. Install mkcert

- With Chocolatey (run PowerShell as Administrator):

  choco install mkcert -y

  If you don't have Chocolatey, download mkcert from https://github.com/FiloSottile/mkcert/releases and add to your PATH.

2. Install local CA (one-time):

  mkcert -install

3. Create a folder for certs inside the frontend folder:

  cd frontend
  mkdir certs

4. Generate cert and key for localhost (both IPv4/IPv6):

  mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1

5. Ensure `.env.development.local` exists (already added). It must contain:

  HTTPS=true
  HOST=localhost
  SSL_CRT_FILE=certs/localhost.pem
  SSL_KEY_FILE=certs/localhost-key.pem

6. Start the frontend dev server:

  cd frontend
  npm install   # if needed
  npm start

7. Open https://localhost:3000 in your browser. mkcert certificates are trusted system-wide, so you should see a secure lock without manual acceptance. If you still see an untrusted warning, restart your browser.

Notes & troubleshooting:
- If your browser blocks camera access despite the site being secure, check site permissions (click lock icon → Camera).
- Some browsers still allow camera on `http://localhost`, but using HTTPS avoids cross-browser inconsistencies.
- If you prefer not to install mkcert, you can use the default CRA HTTPS by setting `HTTPS=true` in .env — browsers will show a self-signed cert which you must accept manually.
