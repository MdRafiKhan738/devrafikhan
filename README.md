# DevRafiKhan Frontend

Premium portfolio frontend for **Mohammad Rafi Khan**.

## Architecture

This repository intentionally contains **frontend only**.

- Repository: `MdRafiKhan738/devrafikhan`
- Frontend hosting: Vercel
- Backend repository: `MdRafiKhan738/devrafikhanbackend`
- Backend hosting: Render
- Database: MongoDB Atlas

The frontend calls the production API at:

`https://devrafikhanbackend.onrender.com/api`

## Frontend

Static HTML/CSS/JS + GSAP portfolio with:

- hero portrait reveal
- dark/light theme
- dynamic projects
- project detail pages
- dynamic blog
- login/signup
- admin UI
- contact form
- guestbook
- dynamic site settings
- responsive layouts

## Deployment

Deploy this repository root to Vercel.

Do not deploy the old `server/` directory from this repository — the backend has been moved to the separate `devrafikhanbackend` repository.

## Local development

Serve the repository with any static server, for example:

```bash
python -m http.server 5173
```

The public pages are already configured to call the Render API.

## Backend

Backend source and production setup live separately:

https://github.com/MdRafiKhan738/devrafikhanbackend
