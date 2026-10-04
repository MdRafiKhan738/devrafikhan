# DevRafiKhan Portfolio

Premium dynamic portfolio for **Mohammad Rafi Khan**.

## Architecture

- Public frontend: static HTML/CSS/JS + GSAP
- Backend: Express + Mongoose
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- CMS: projects, project details, blogs, contact inbox, guestbook, site settings
- Deployment: frontend on Vercel, backend on Render, database on MongoDB Atlas

## Repository structure

```
/
  index.html
  about.html
  projects.html
  project.html
  blog.html
  post.html
  contact.html
  guestbook.html
  login.html
  admin.html
  style.css
  fix.css
  *.js
  assets/
  server/
```

## Local frontend

From the repository root:

```bash
python -m http.server 5173
```

Open `http://localhost:5173`.

The frontend uses `/api` by default. When the API is deployed separately, set the `api-base` meta tag in the public pages to the deployed backend URL.

## Local backend

```bash
cd server
npm install
npm start
```

Required environment variables:

```env
PORT=5050
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=2d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-me
PUBLIC_EMAIL=your-real-public-email
PUBLIC_PHONE=your-real-public-phone
```

Do not commit the real MongoDB URI, JWT secret, admin password, or mail credentials.

## Admin

Open `login.html` and authenticate with the seeded admin account.

The admin dashboard manages:

- projects and project details
- project images
- blog posts
- contact messages and status
- guestbook moderation
- social links
- public contact details
- technology stack
- hero/site content
- portrait and signature image settings

## Hero portrait

The hero uses the supplied Rafi Khan portrait.

The initial portrait is grayscale. On desktop hover, an SVG gooey mask reveals the color source image. The blob is a mask region, not an opaque layer, so it does not cover the portrait.

The source portrait currently lives as a base64 WebP asset so it can be decoded client-side without exposing a binary upload workflow in Git history.

## Security

The backend includes:

- Helmet
- restricted CORS
- request size limits
- rate limiting on auth/contact/guestbook
- bcrypt password hashing
- JWT authentication
- role authorization
- sanitized blog HTML
- production-safe error responses

## API

Public:

- `GET /api/health`
- `GET /api/site`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `POST /api/contact`
- `GET /api/guestbook`
- `POST /api/guestbook`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Admin:

- `GET /api/admin/data`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `POST /api/admin/blogs`
- `PUT /api/admin/blogs/:id`
- `DELETE /api/admin/blogs/:id`
- `PUT /api/admin/site`
- `PUT /api/admin/messages/:id`
- `PUT /api/admin/guestbook/:id`

## Production

1. Create a MongoDB Atlas database.
2. Deploy `server/` to Render.
3. Add backend environment variables in Render.
4. Add the production frontend origin to `CLIENT_URL`.
5. Deploy the static frontend to Vercel.
6. Point the frontend `api-base` to the Render API URL.
7. Seed the first admin through `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
8. Rotate the bootstrap admin password after first login.

Never place secrets in browser-accessible code.
