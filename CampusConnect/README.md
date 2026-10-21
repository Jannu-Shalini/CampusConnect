# CampusConnect: Smart Student Services & Campus Management Portal

A frontend-only student portal built with **HTML5, CSS3 and vanilla JavaScript**. It runs entirely in the browser and stores data in `localStorage`.

## Overview
CampusConnect gives students one place for announcements, events, clubs, campus services, study resources, lost & found, feedback and their profile, with a dashboard that updates from stored data.

## Problem statement
Campus information is scattered across notice boards, chat groups and offices. Students miss deadlines and events, and lost items rarely find their owners.

## Objectives
- Centralise campus information in one responsive, accessible interface
- Demonstrate DOM manipulation, validation, search/filter/sort, localStorage, fetch() and responsive design
- Work with no backend and no frameworks

## Features
- Landing page with hero, features, stats, previews and call-to-action
- Dashboard with live stats, weather, registered events, favorite clubs, saved resources
- Announcements: search, category and priority filters, sorting, details modal
- Events: search, category/date/registration filters, sorting, register and cancel, duplicate and seat checks
- Clubs: join and leave, search and filters
- Campus resources directory and study resources with bookmarks
- Lost & Found: add, search, filter, details, resolve, delete own items
- Profile editing with photo upload, feedback form, settings (dark mode, notification preferences, clear/reset data)
- Toast notifications, modals, loading/empty/error states, keyboard focus styles, ARIA labels

## Technologies
HTML5, CSS3 (Grid, Flexbox, custom properties, media queries), vanilla JavaScript (ES2018+), localStorage, Fetch API.

## Folder structure
```
CampusConnect/
├── index.html, dashboard.html, announcements.html, events.html, clubs.html,
│   resources.html, study-resources.html, lost-found.html, profile.html,
│   feedback.html, settings.html
├── css/   style.css · components.css · responsive.css
├── js/    utils.js · storage.js · data.js · api.js · app.js
├── assets/icons/logo.svg, assets/images/
└── README.md
```

## How to run (VS Code, step by step)

### Requirements
- Visual Studio Code
- A modern browser (Chrome, Edge, Firefox or Safari)
- Internet connection (only for the weather widget; everything else works offline)

### Steps
1. **Unzip** `CampusConnect.zip` to a folder, for example `Documents/CampusConnect`.
2. Open **VS Code** and choose **File → Open Folder…**, then select the `CampusConnect` folder. You should see `index.html`, `css`, `js` and `assets` in the Explorer panel.
3. Open the **Extensions** panel (`Ctrl+Shift+X`), search for **Live Server** (by Ritwick Dey) and click **Install**.
4. In the Explorer, **right-click `index.html`** and choose **Open with Live Server**. (Or click **Go Live** in the bottom-right status bar.)
5. Your browser opens at `http://127.0.0.1:5500/index.html`. The landing page appears with demo data already loaded.
6. Edit any file and save. The page reloads automatically.

**Without Live Server:** double-click `index.html` in File Explorer, or right-click it in VS Code and choose **Reveal in File Explorer**, then open it in your browser.

### How to test it
1. Press **F12** and open the **Console** tab. It should show no red errors.
2. Click **Explore Campus**, then use the top navigation to visit every page.
3. **Events:** search, filter, register, try registering again (you get a duplicate message), then cancel.
4. **Clubs / Study:** join a club and bookmark a resource, then check the Dashboard counts.
5. **Lost & Found:** click **Report item**, submit empty (see validation errors), then submit valid data.
6. **Profile / Feedback:** save invalid values (errors appear), then valid ones.
7. **Settings:** switch to dark mode and refresh (it stays). Try **Clear saved data** and **Reset demo data**.
8. **Responsive:** press `Ctrl+Shift+M` in the browser DevTools to test mobile and tablet sizes.
9. **API failure:** in DevTools go to Network → set **Offline**, clear weather data by pressing Retry, and confirm the app still works.

### Troubleshooting
- **Blank page or old data:** press `Ctrl+Shift+R`, or reset data from Settings.
- **Weather not loading:** check your internet connection and press **Retry**.
- **Start from scratch:** in DevTools go to Application → Local Storage and clear the site's data.

## LocalStorage implementation
`js/storage.js` exposes `Store.getData`, `saveData`, `updateData`, `removeData` and `clearData` (keys prefixed `cc_`). Every read is wrapped in try/catch, so invalid JSON or blocked storage falls back to defaults. Persisted: profile, registrations, joined clubs, saved resources, lost & found, theme, feedback, settings, and the demo datasets. Demo data is seeded on first launch and can be restored from Settings.

## API integration
**Open-Meteo** (no key required) provides current campus weather via `fetch()`. It has a loading skeleton, a 7-second timeout, error handling, a Retry button, a 10-minute cache to minimise requests, and a last-known-reading fallback. The app works fully without it.

## Responsive design
CSS Grid auto-fit layouts, Flexbox toolbars, fluid typography with `clamp()`, a hamburger menu below 1180px, and stacked forms on mobile, with no horizontal scrolling.

## Screenshots
Add screenshots to `assets/images/` and link them here:
`![Dashboard](assets/images/dashboard.png)`

## Future enhancements
Real authentication and backend sync, push notifications, calendar export, multi-language support, admin panel for announcements.

## Author
Your Name · Web Development Internship Capstone
