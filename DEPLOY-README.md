# Ishha Farha Quraishy Website — Client Deployment Guide

This repository contains the complete project. One Netlify deployment publishes:

- Main website: `/`
- Website Content Studio: `/content-admin.html`
- Booking dashboard: `/admin.html`
- Serverless API functions: `/netlify/functions/`

The client does **not** need separate deployments for the website and control panel.

## Recommended deployment: GitHub to Netlify

### 1. Get access to the repository

The repository owner can either invite the client as a GitHub collaborator or transfer the repository to the client's GitHub account.

Repository: `https://github.com/rishigauthaman/ishaa`

### 2. Import the repository into Netlify

1. Sign in at `https://app.netlify.com/`.
2. Select **Add new project** → **Import an existing project**.
3. Choose **GitHub** and authorize Netlify.
4. Select the `ishaa` repository.
5. Use these deployment settings:
   - Branch to deploy: `main`
   - Build command: leave empty
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
6. Select **Deploy site**.

Netlify reads the included `netlify.toml`, so the default settings should already be correct.

### 3. Add the required control-panel password

In Netlify, open **Site configuration** → **Environment variables** → **Add a variable** and add:

```text
ADMIN_PASS=choose-a-strong-private-password
```

Do not put the password inside GitHub. After adding or changing an environment variable, trigger a new deployment.

### 4. Optional environment variables

```text
RESEND_API_KEY=...   # Booking confirmation and notification emails
NOTIFY_EMAIL=...     # Email address that receives booking alerts
OPENAI_API_KEY=...   # Full AI chatbot; the fallback chatbot works without it
```

### 5. Verify the deployment

Replace `your-site.netlify.app` with the Netlify address:

- Website: `https://your-site.netlify.app/`
- Content Studio: `https://your-site.netlify.app/content-admin.html`
- Booking dashboard: `https://your-site.netlify.app/admin.html`

Log in using the value configured as `ADMIN_PASS`.

## Editing website content

1. Open `/content-admin.html`.
2. Enter the admin password.
3. Select **Visual Editor**.
4. Click text, an image, a button, or a link in the preview.
5. Edit its value in the inspector.
6. Select **Publish Changes**.
7. Refresh the public website.

Content Studio also has dedicated forms for Contact, YouTube, Instagram, and Blogs. Published content is stored in Netlify Blobs and loaded by the main website automatically.

## Local preview

From the project directory, run:

```text
python -m http.server 8000
```

Then open:

- Website: `http://localhost:8000/`
- Content Studio: `http://localhost:8000/content-admin.html`
- Local Content Studio password: `admin`

Local edits are stored only in that browser. Production edits use Netlify Blobs and the private `ADMIN_PASS` value.

## Automatic updates

After GitHub is connected to Netlify, every push to `main` triggers a new deployment automatically. Routine text, image, and link changes can be made through Content Studio without editing GitHub.

## Custom domain

In Netlify, open **Domain management** → **Add a domain**, enter the client's domain, and follow the DNS instructions. Netlify provisions HTTPS automatically after DNS verification.

## Security and handover checklist

- Use a strong production `ADMIN_PASS`; do not use `admin` online.
- Give the client access to both GitHub and Netlify.
- Confirm the client can open the website, Content Studio, and booking dashboard.
- Confirm a Content Studio change appears on the public website.
- Keep API keys only in Netlify environment variables.
