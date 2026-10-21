# CampusConnect: Smart Student Services & Campus Management Portal

## Problem Statement
Campus information is scattered across notice boards, WhatsApp groups and different offices. Because of this, students miss important announcements, exam updates and placement deadlines. Events and clubs are hard to discover and register for, study material is spread across many websites, and lost items rarely get back to their owners. Students need one simple place to access campus services and information.

## Proposed Solution
CampusConnect is a responsive web portal that brings campus services together in one place:

- **Announcements:** read college notices with category, priority and date, and search or filter them.
- **Events:** browse upcoming events, register and cancel, with duplicate-registration and seat-availability checks.
- **Clubs:** explore student clubs, view details, and join or leave them.
- **Campus Resources:** find locations, timings and contact details of campus services.
- **Study Resources:** search and bookmark notes, tutorials, documentation and placement material.
- **Lost & Found:** report lost or found items, search them, mark them resolved, and delete your own entries.
- **Dashboard and Profile:** see personalized stats, registered events, joined clubs and saved resources, and edit profile details.
- **Settings:** switch between dark and light themes, manage notification preferences, and reset demo data.
- **Weather Widget:** shows live campus weather using a public API, with a fallback if the service is unavailable.

The application runs entirely in the browser, stores data using localStorage, validates every form with JavaScript, and works on desktop, tablet and mobile.

## Technologies Used
| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Styling, Flexbox, CSS Grid, media queries, animations, dark/light theming |
| **JavaScript (Vanilla, ES6+)** | DOM manipulation, search, filter, sort, form validation, event handling |
| **localStorage** | Saving profile, registrations, clubs, bookmarks, lost & found, theme and settings |
| **Fetch API** | Integration with the Open-Meteo public weather API |
| **Open-Meteo API** | Live campus weather (free, no API key) |
| **VS Code / Git / GitHub** | Development and version control |

No frameworks, libraries or backend were used.
