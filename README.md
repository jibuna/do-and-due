# Do & Due: installable app

A complete, self-contained web app. There is no build step.

## Publishing updates (GitHub Pages)

1. Open your repository on github.com and choose Add file, then Upload files.
2. Drag in everything from this folder (the files inside it, not the folder itself) and commit.
   Files with the same name are replaced.
3. Wait a minute or two for Pages to publish.
4. On your phone, open the app. A bar saying "A new version is ready" appears: tap Refresh.
   (If it does not appear, close the app completely and open it again.)

Settings, then Sync, shows the app version, so you can check which one a device is running.

## Installing on a phone

Open your GitHub Pages address in the phone's browser, then:
- **iPhone (Safari):** Share button, then Add to Home Screen.
- **Android (Chrome):** menu (three dots), then Install app or Add to Home screen.

## Sync between devices

Tasks, modules, timetable and settings sync through your own Supabase project.
Open Settings, then Sync, and sign in with the same email and password on each device.
Changes sync a moment after you make them and whenever the app is opened.
The app still works offline and catches up when you reconnect.

Before the first sync a device keeps a copy of what it held. If two devices both already have tasks, sign in on the one with the most first.

## Setting up Supabase (once)

1. In your Supabase project, open SQL Editor, paste the whole of supabase-setup.sql and press Run.
2. Open Authentication, then Sign In / Providers, then Email, and switch off "Confirm email". Save.
3. Create your account in the app (Settings, Sync, Create account), then sign in on your other devices.
4. Optional but sensible: once your account exists, switch off "Allow new users to sign up" in the same place, so nobody else can create one.

The key in the app is a public key. It is safe in a public repository because each account can only read and write its own rows.

## Backups

Settings, then Backup and restore, downloads a copy of everything. Keep one now and then.
