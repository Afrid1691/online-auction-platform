# Online Auction Platform

An online auction website where users can list items for auction and place
bids on products. Built with **Node.js, Express, and MongoDB** following an
**MVC architecture**, with session-based authentication, custom middleware for
access control, and flash-message notifications so bidders get instant
feedback on their bids and item status.

## Features

- Browse and search live auctions, filter by category
- Register / log in with session-based authentication (`express-session`,
  passwords hashed with bcrypt)
- List an item with a starting price and auction duration
- Place bids — bids must beat the current price; sellers cannot bid on their
  own listings
- Bid history on every item, with the current highest bidder highlighted
- Instant bid and auction notifications using `connect-flash`
- Owners can delete their own listings; custom middleware blocks everyone else
- Responsive front end (HTML/CSS/JavaScript) with live countdown timers

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose ODM
- **Views:** EJS (server-rendered), vanilla CSS/JavaScript
- **Auth:** express-session + custom middleware, bcryptjs password hashing
- **Notifications:** connect-flash

## Architecture

The code follows MVC (Model–View–Controller):

```
server.js            App entry point: middleware, session, routes
config/db.js         MongoDB connection (Mongoose)
models/              Data layer — User, Item, Bid schemas
controllers/         Request logic — auth, items, bids
routes/              Route definitions, wired to controllers + middleware
middleware/auth.js   requireAuth, requireItemOwner, current-user/flash locals
views/               EJS templates (partials, item pages, auth pages)
public/              Static CSS and the countdown-timer JavaScript
scripts/seed.js      Demo data seeder
```

Request flow for placing a bid:
`POST /items/:id/bids` → `requireAuth` middleware → `bidController.placeBid`
validates the auction is live and the amount beats the current price, stores a
`Bid`, updates the `Item`'s current price and highest bidder, sets a flash
notification, and redirects back to the item page.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### Setup

```bash
npm install
cp .env.example .env   # edit MONGODB_URI and SESSION_SECRET if needed
npm run seed           # optional: demo seller + sample listings
npm run dev            # or: npm start
```

Open http://localhost:3000 — you will be redirected to the listings page.

Demo account created by the seed script: `seller@example.com` / `password123`.

## Environment Variables

| Variable         | Description                          | Default                                        |
| ---------------- | ------------------------------------ | ---------------------------------------------- |
| `PORT`           | Port the server listens on           | `3000`                                         |
| `MONGODB_URI`    | MongoDB connection string            | `mongodb://127.0.0.1:27017/online-auction`     |
| `SESSION_SECRET` | Secret used to sign session cookies  | `dev-only-secret` (set a real one in `.env`)   |

## Project Notes

- Auction end times are stored on the item (`endsAt`); expired auctions reject
  new bids and show an "auction has ended" state in the UI.
- Prices are stored as numbers in USD and validated on both listing creation
  and bid placement.
