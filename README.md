# BookNook

**BookNook is a small online library. Add a book, borrow a book, return a book.**

**Live site:** https://book-nook-5bc5.vercel.app
**Server API:** https://booknook-server-indol.vercel.app

BookNook lets readers share the books they own, browse everything on the shelf, borrow a book for a few days and return it when they are done. This repository is the **client** (Next.js). The Express + MongoDB server lives in its own repository.

## Features

- **Add, browse and manage books.** Add a book with a cover image (uploaded to imgbb), browse every book in a 3-per-row grid, and edit or delete the books you added from **My Books** (with a confirm modal, no browser alerts).
- **Borrow and return in one click.** Open a book, confirm the borrow in a modal and track it in the **My Borrows** table. Press **Return Book** and the copy goes back on the shelf.
- **Smart copy counting.** Every book has a Total Copies field. Borrowing takes one copy, returning gives it back, and when no copy is left the button turns into **Not Available**.
- **No double borrowing.** The same reader cannot borrow the same book twice at the same time. A toast explains why.
- **Secure login.** Email and password or Google sign-in with BetterAuth and the MongoDB adapter. Passwords need an uppercase letter, a lowercase letter and at least 6 characters. Private pages send logged-out visitors to Login and bring them back afterwards.
- **Protected API.** Every private server route checks a JWT issued by BetterAuth, and only the owner of a book can edit or delete it.
- **Polished experience.** Swiper.js banner showing the newest books, New Arrivals section, search and category filter, loading spinners, a custom 404 page, per-page titles, toasts for every success and error, and a fully responsive layout.
- **Dark / light theme and animation.** A theme button in the navbar remembers your choice, and sections fade in with Framer Motion.

## Pages

| Route | Access | What it does |
| --- | --- | --- |
| `/` | Public | Banner slider, New Arrivals, How Borrowing Works, Top Categories |
| `/books` | Public | All books with search and category filter |
| `/books/:id` | Private | Book details and the Borrow modal |
| `/add-book` | Private | Add a new book |
| `/my-books` | Private | Edit and delete your own books |
| `/my-borrows` | Private | Books you borrowed, with Return Book |
| `/profile` | Private | Your account details |
| `/login`, `/register` | Public | Email and Google authentication |

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- BetterAuth with the MongoDB adapter and the JWT plugin
- Swiper.js, Framer Motion, react-hot-toast
- imgbb for book images
- Express and MongoDB on the server side

## Run it on your computer

1. Install the packages

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
   MONGODB_URL=your_mongodb_connection_string
   BETTER_AUTH_SECRET=a_long_random_secret
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   - `BETTER_AUTH_URL` must be a full URL, with `https://` on the live site and no slash at the end.
   - Use the **same** `BETTER_AUTH_SECRET` everywhere that shares the same database.
   - The Google keys are only needed for Google sign-in. The Google redirect URI is `<BETTER_AUTH_URL>/api/auth/callback/google`.

3. Start the server from the server repository (`node index.js`), then start the client:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Deployment

The client is deployed on **Vercel** and the server on its own Vercel project. Add the same environment variables in the Vercel project settings and redeploy after changing any of them. On the server, `AUTH_URL` must equal the client's `BETTER_AUTH_URL`, and `CLIENT_ORIGINS` must contain the client's URL.
