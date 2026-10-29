# Havena

**Havena** is a full-stack vacation rental booking platform: guests can find and book stays, hosts can list their homes and manage reservations.

> 🚧 **Work in progress.** The project started from a video tutorial (an Airbnb clone), which I built step by step over two months while learning Next.js. I'm now extending it with my own improvements: bug fixes, security hardening, listing editing, reviews & ratings, and a rebrand.

## Features

- Sign up and log in with email & password, GitHub or Google
- Create a listing in a multi-step form: category, location on a map, details, photo upload, price
- Browse listings and filter by category, country, dates and number of guests
- Book a stay with a date-range calendar (already booked dates are blocked)
- Trips, reservations, favorites and "my properties" pages
- Cancel reservations and delete your own listings

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB with Prisma ORM
- **Auth:** NextAuth (credentials + OAuth)
- **Other:** Zustand, React Hook Form, Cloudinary, Leaflet, date-fns

## Getting started

```bash
git clone https://github.com/VladyslavBuilds/havena-booking.git
cd havena-booking
npm install
cp .env.example .env   # then fill in your own values
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- [x] Fix production build and known bugs
- [x] Security: request validation, no sensitive data sent to the client
- [x] Edit listings
- [x] Reviews and ratings
- [x] Rebrand to Havena
- [ ] Deploy to Vercel
