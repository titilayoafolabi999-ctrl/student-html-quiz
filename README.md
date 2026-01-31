# 📝 HTML Mastery Quiz — Teacher's Portal

A professional, real-time student assessment system built for the 14‑Week HTML Curriculum. When students finish a level, their scores are sent securely to a Netlify backend Function and saved instantly to a Google Sheet. Teachers can view results in a hidden in-app "Teacher's Portal" without opening the spreadsheet.

---

## Project Structure (required)

Netlify will only detect the frontend and serverless function if the files are at the repository root and follow this exact layout:

root/
├── index.html                # The main quiz (student-facing)
├── README.md                 # This documentation
└── netlify/
    └── functions/
        └── submit-score.js   # Netlify Function that posts to Google Sheets

Important: Do NOT wrap these files inside another top-level folder. The structure must be at the repo root.

---

## Netlify: Environment Variables

To keep your Google Sheet and admin codes private, set the following environment variables in Netlify:
Site Settings → Build & deploy → Environment → Environment variables

- `GOOGLE_SCRIPT_URL`  
  The Web App URL created when you deploy your Google Apps Script (see "Database Setup").

- `RESET_CODE`  
  The teacher/admin passcode used to open the Teacher's Portal and clear class data (e.g., `Admin2026`).

---

## Netlify: Function Directory Setting

If Netlify reports "No functions deployed", verify the function directory:
Site Settings → Build & deploy → Continuous Deployment → Functions directory  
Set the value to:
```
netlify/functions
```

---

## Database (Google Sheets) — Setup & Deployment

1. Create a Google Sheet (e.g., `HTML Quiz Results`).
2. Open **Extensions → Apps Script**.
3. In the script editor, remove any placeholder code and paste the Google Apps Script provided in this project.
4. Deploy the script:
   - Click **Deploy → New Deployment**
   - Choose **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Authorize and follow prompts (use Advanced → Go to Project if prompted)
5. Copy the generated Web App URL and paste it into Netlify's `GOOGLE_SCRIPT_URL` environment variable.

Security note: setting access to "Anyone" is required for the function to post results from the deployed Netlify function, but keep the URL secret (store in Netlify env vars). Rotate the URL or script token if you suspect exposure.

---

## Teacher's Portal — Access & Features

The Teacher's Portal is a hidden admin view inside the quiz app.

How to open the portal:
1. Open the live quiz site (deployed URL).
2. In the "Enter Your Name" field, type the `RESET_CODE` value you set in Netlify.
3. The app will switch from the Student Quiz view to the Teacher Dashboard.

Portal features:
- Live Feed: recent submissions with Name, Score, and Level.
- Class Reset: clear local browser data for shared machines.
- Export View: generate a clean summary (e.g., which students unlocked the "Advanced" level).
- Quick glance of student progress without opening Google Sheets.

---

## Behavior & Features

- 3 learning tiers: Beginner → Intermediate → Advanced.
- Smart Lock: the next level unlocks only after the student scores ≥ 80%.
- Real-time sync: scores post immediately to the Google Sheet via Netlify Function.
- Persistent progress: student names and unlocked levels are stored locally in the browser.

---

## Environment Variables & Secrets — Best Practices

- If you re-import the site in Netlify, environment variables are not automatically copied — re-enter them in the new site settings.
- Do NOT commit secrets (like the Google Web App URL or reset code) to source control.
- Use a secrets manager or a password manager for backup.
- Rotate secrets if they are shared insecurely.

---

## Local Development

To test locally with Netlify functions and environment variables:

1. Install Netlify CLI (if not installed):
```bash
npm install -g netlify-cli
```

2. Run the dev server:
```bash
netlify dev
```

This loads Netlify Functions locally and uses your environment variable values (set in Netlify or in a local .env file loaded by netlify dev).

---

## Troubleshooting

- "No functions deployed": confirm `netlify/functions` is set as the Functions directory in Netlify settings.
- Builds fail referencing missing env vars: confirm `GOOGLE_SCRIPT_URL` and `RESET_CODE` are set in the site environment variables for the correct deploy context (production/branch).
- Teacher Portal not opening: ensure the `RESET_CODE` value in Netlify matches the value entered in the name field.
- Redeploy issues on Netlify: clear build cache and redeploy, or re-import the repo and re-enter env vars if needed.

---

## Final Notes

- Keep your repo structure exact and at the root level.
- Keep the Google Apps Script Web App URL and `RESET_CODE` private.
- If you need help copying environment variables between Netlify sites or re-linking a renamed GitHub repo, follow the Netlify UI steps in this README or contact your site admin.

---

Part of the 14‑Week HTML Curriculum Project — built for secure, real‑time classroom assessment.
