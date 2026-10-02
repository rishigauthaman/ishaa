# Deploying ishafarhaquraishy — Netlify

## Deploy (choose one)
A) Connect this folder/repository to Netlify (recommended for client handoff)
B) CLI:
     npm install
     npx netlify login
     npx netlify deploy --prod --dir .

## Required after first deploy
    ADMIN_PASS = <strong-password>     -> her dashboard at /admin.html

## Client handoff
    /admin.html          -> booking dashboard
    /content-admin.html  -> website Content Studio

Both dashboards use the same ADMIN_PASS. Content Studio changes are stored
persistently in Netlify Blobs and appear on the public website automatically.

Editable in Content Studio:
    - Contact heading, description, email, Instagram and LinkedIn links
    - YouTube channel and the three featured videos
    - Instagram profile and the four featured posts/reels
    - Blog titles, categories, excerpts, thumbnails and LinkedIn destinations

After publishing an edit, refresh the public website to see it. The original
content remains a fallback if the content service is temporarily unavailable.

## Optional
    RESEND_API_KEY + NOTIFY_EMAIL      -> email alerts + booker confirmations
    OPENAI_API_KEY                     -> full AI chat (fallback engine otherwise)
