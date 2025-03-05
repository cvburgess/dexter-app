# Dexter

An opinionated day planner

## Getting Started

1. Install and configure the latest version of [Deno](https://deno.com/)
2. Configure `.env` files in the root `/` and `/supabase`
3. Run `deno task tauri dev` to run the app locally
4. TODO: Local supabase setup

## Working with Supabase

- Currently there is only a production instance that is used for development
- Log into the supabase CLI with `deno task supabase:login`
- Pull types after db changes with `deno task supabase:types`

## Quirks

- npm and package.json are used as [JSR and Vite do not play well together](https://github.com/denoland/deno/issues/23929) and supabase wouldn't pull types
