## Project Overview

- Dexter is a single app for managing tasks, calendars, and organization
- It works on desktop (via electron)
- Mobile and web are supported as a responsive, progressive web app

## Tech Stack

- **Framework**: React + TypeScript
- **Desktop**: Electron
- **Styling**: Tailwind CSS + daisyUI (utility classes only, no .css files)
- **Backend**: Supabase
- **Data Fetching**: Tanstack Query
- **Routing**: React Router
- **Code Quality**: ESLint + Prettier

## Development Commands

See @README for project overview and @package.json for available npm commands for this project.

```bash
npm run format  # Prettier formatting
npm run lint    # ESLint checking
```

## Styling Guidelines

- Use Tailwind utility classes and daisyUI components
- No custom CSS files - stick to utility-first approach
- Leverage daisyUI's semantic component classes

## Data Management

- Supabase for backend services
- Tanstack Query for server state management
- React Router for client-side routing

## Code Standards

- TypeScript strict mode, do not use "any" types
- Format code with Prettier before commits
- Resolve ESLint warnings/errors
- Follow existing patterns
