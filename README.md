# Dexter - an opinionated day planner for Mac (and Web)

![Screenshot](https://dexterplanner.com/assets/screenshot-light.png)

## Features

- [x] Prioritization (Eisenhower matrix)
- [x] Markdown notes
- [x] Customizable journal
- [x] Calendars via ics feeds
- [x] Habit tracker
- [x] Goal/milestone tracker
- [x] Customizable themes, templates, and more
- [ ] Focus block tracking (Pomodoro technique)
- [ ] Subtasks
- [ ] Notifications
- [ ] Full-text search for tasks and notes
- [ ] Intentions and celebrations
- [x] Mac app
- [x] Web app
- [x] PWA for mobile devices
- [ ] Menubar app
- [x] Fully deletable user data
- [ ] Fully exportable user data
- [ ] Pro plan via Stripe
- [ ] Integrations

## Getting Started

1. Install and configure the version of Node JS listed in the .nvmrc file
2. Configure `.env` files in the root `/` and `/supabase`
3. Run `npm start` to run the app locally
4. TODO: Local supabase setup

Postgres acts as the API layer with triggers and functions doing some of the heavy lifting for things like repeating tasks and account setup.

*Once local scripts and schemas are in this repo it should be easy enough to self-host Dexter anywhere you can host a Postgres database!*

### Working with Supabase

- Currently there is only a production instance that is used for development with branching
- Log into the supabase CLI with `npm run supabase:login`
- Pull types after db changes with `npm run supabase:types`

## Contributing

Use Github issues to report a bug or request a feature.

Please be kind and patient. Dexter is maintained by a solo dev and features will only be added if they are something I want to maintain and find personal value in.

If you want to speed things along, consider opening a PR - though not required!