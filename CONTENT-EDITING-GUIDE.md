# How to update your website (a guide for Damien)

Hi Damien! This guide explains how to change anything on damiengranet.com without
touching any code. Keep it somewhere handy.

## The one file that matters

Everything on the site — your bio, jobs, education, skills, links — lives in a single
file called **`profile.json`**, inside the folder **`src/data/`** of the GitHub
repository. Change that file, and the website rebuilds and republishes itself
automatically within a few minutes. That's it. You never edit the website's code.

There are two ways to change it. Use whichever feels easier.

---

## Option A: the friendly editor (recommended)

1. Go to **https://damiengranet.com/edit/** in your browser.
2. You'll see labelled boxes for everything on the site. Change whatever you like.
   Use the **+ Add**, **Remove**, **↑** and **↓** buttons for jobs, education,
   skills, highlights and links.
3. Press **Check & preview**. Fix anything flagged in red.
4. Press **Download profile.json**. A file lands in your Downloads folder.
5. Press **Open this file on GitHub** and sign in to GitHub if asked.
6. On the GitHub page: click inside the file, select everything
   (**Ctrl+A** on Windows, **Cmd+A** on Mac), press **Delete**, then open your
   downloaded `profile.json` (it opens in any text editor), select everything,
   copy it, and paste it into the GitHub page.
7. Press the green **Commit changes…** button, then **Commit changes** again in the
   pop-up.
8. Wait about two to three minutes, then refresh damiengranet.com. Done.

Nothing you type in the editor is sent anywhere — it stays in your browser until you
download the file, so you can experiment freely.

## Option B: edit directly on GitHub

1. Go to the repository on github.com and open **`src/data/profile.json`**
   (click `src`, then `data`, then `profile.json`).
2. Click the **pencil icon** (✏️) at the top right of the file.
3. Make your change. The file is organised in plain sections — for example each job
   looks like:

   ```json
   {
     "role": "Governance and Communications Officer",
     "organisation": "Platypus Research & Development",
     "type": "Part-time",
     "start": "Nov 2023",
     "end": "Present",
     "location": "Canberra, ACT",
     "summary": "One friendly sentence about the job.",
     "details": ["Optional extra point.", "Another optional point."]
   }
   ```

   Keep the quotes and commas exactly as they are — change only the words between
   the quotes.
4. Press **Commit changes…**, then **Commit changes**.

If you make a typo that breaks the file (a missing comma is the usual one), don't
worry — the automatic checks will refuse to publish it and the live site stays
untouched. See "If a deployment fails" below.

---

## Common tasks

### Add a new job
Editor: open **Experience**, press **+ Add a job**, fill in the boxes, then use
**↑ Move up** to put it first (newest jobs go at the top). Follow the publish steps.

### Add a project or highlight
Editor: open **Highlights**, press **+ Add a highlight**. Only the title is required;
add a link and a short description if you have them.

### Hide a whole section
Editor: open **Show or hide sections** and untick the section. It vanishes from the
site and the menu. Tick it again any time to bring it back.

### Replace your photo
1. On GitHub, open the **`public/images`** folder.
2. Click **Add file → Upload files**, choose your photo (a square-ish JPG around
   800×800 works well, ideally under 500 KB), and commit.
3. In the editor (or `profile.json`), set **Profile image path** to
   `/images/your-file-name.jpg` and update the image description.

### Change where contact messages go
The site shows your LinkedIn button, and optionally an email button and a contact
form:

- **LinkedIn** — paste your LinkedIn URL into the LinkedIn box.
- **Email** — only ever use a dedicated address (like `hello@damiengranet.com`),
  never your personal email; it will be visible to the whole internet and to
  spam bots.
- **Contact form** — sign up free at formspree.io, create a form, and paste the
  endpoint URL (it looks like `https://formspree.io/f/abcdwxyz`) into the
  **Contact form endpoint** box. Messages then arrive in whatever inbox you set on
  Formspree — change it there any time. Leave the box blank and no form appears.

### Undo a bad change
1. On GitHub, open `src/data/profile.json` and click **History** (top right).
2. Open the last version that was good, click the **⋯** menu → **View file**.
3. Copy its contents, then edit the current file (pencil icon), paste over
   everything, and commit. The site rolls back automatically.

### If a deployment fails
1. On GitHub, click the **Actions** tab. The failed run has a red ✗.
2. Open it and read the message — nearly always it's the content check telling you
   exactly what's wrong (for example, "experience[2]: 'start' is required").
3. Fix that in `profile.json` and commit again. The live site is never replaced by a
   broken build, so there's no rush.

---

## What not to publish

This is a public website. Please never add:

- your personal phone number;
- your personal email address (use an alias or the form instead);
- your home address (suburb/city is fine);
- your date of birth, or any ID numbers;
- your day-to-day schedule or anything you wouldn't hand to a stranger.

The automatic checks will warn about phone-number-looking things and personal email
addresses, but they're a safety net, not a guarantee.

## Changing the domain one day

That's a code-side change — ask Peter, or follow the "Changing the domain later"
section in `README.md` and `DNS-SETUP.md`.
