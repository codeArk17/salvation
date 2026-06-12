# Implementation Plan: node-mongodb-backend-integration

## Overview

Migrate the Salvation Ministry website from a localStorage-based architecture to a full-stack Node.js + Express + MongoDB Atlas system. The backend is built from scratch in a new `salvation-backend` directory, 11 Mongoose models and 42 REST endpoints are implemented, JWT authentication replaces the hardcoded password, and the React frontend's `AppContext.jsx` is refactored to call the REST API via a centralized `apiClient` utility.

---

## Tasks

- [ ] 1. Scaffold the `salvation-backend` project and configure the environment
  - [ ] 1.1 Initialize the Node.js project and install dependencies
    - Create `salvation-backend/` directory with `package.json` (ESM, `"type": "module"`)
    - Install runtime dependencies: `express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcrypt`, `cors`
    - Install dev dependencies: `jest`, `supertest`, `mongodb-memory-server`, `fast-check`
    - Create `.env` template with `MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `NODE_ENV`
    - Create `.gitignore` that excludes `.env` and `node_modules`
    - _Requirements: 1.1, 1.2_

  - [ ] 1.2 Create the Express app factory (`app.js`) and entry point (`index.js`)
    - Write `index.js`: load `dotenv`, validate `MONGO_URI` and `JWT_SECRET` are present (exit 1 if missing), connect to MongoDB Atlas, start Express server on `PORT` (default 3001)
    - Write `app.js`: create Express app, wire JSON body parser, CORS middleware, routes, `notFound`, and `errorHandler`
    - Implement `GET /health` route returning `{ status: "ok" }` with HTTP 200
    - Log `"MongoDB connected"` on successful connection; log error and exit on failure
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ] 2. Implement middleware layer
  - [ ] 2.1 Write `middleware/authMiddleware.js`
    - Extract `Authorization: Bearer <token>` header; return 401 if missing
    - Call `jwt.verify(token, JWT_SECRET)`; return 403 on failure; attach `req.user` on success; call `next()`
    - _Requirements: 3.5, 3.6, 3.7_

  - [ ] 2.2 Write `middleware/notFound.js` and `middleware/errorHandler.js`
    - `notFound`: respond 404 `{ message: "Route not found" }`
    - `errorHandler`: log `err.stack`; handle CORS error → 403; default → 500 `{ message: "Internal server error" }`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ] 2.3 Configure CORS in `app.js`
    - Allow `FRONTEND_ORIGIN` always; allow `http://localhost:5173` when `NODE_ENV !== 'production'`
    - Permitted methods: GET, POST, PUT, PATCH, DELETE
    - Permitted headers: `Content-Type`, `Authorization`
    - Surface CORS violations through `errorHandler` with HTTP 403
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 3. Define all Mongoose models
  - [ ] 3.1 Create models for `Book`, `ContentItem`, `GalleryPhoto`, `GalleryVideo`
    - `Book`: title (req), description (req), price (req, default 0), downloadUrl, coverUrl, previewChapters (array)
    - `ContentItem`: type (enum: Blog/Testimony/Devotional, req), title (req), excerpt, content, date (req), image
    - `GalleryPhoto`: url (req), title, category
    - `GalleryVideo`: url (req), title, category
    - All schemas use `{ timestamps: true }`
    - _Requirements: 2.4, 4.1, 5.1, 6.1, 6.2_

  - [ ] 3.2 Create models for `Sermon`, `PrayerRequest`, `Donation`, `DonationConfig`
    - `Sermon`: title (req), type (enum: Audio/Video, req), url (req), date (req), duration, notes
    - `PrayerRequest`: name (default "Anonymous"), text (req), date (req), count (default 0), status (enum, default "Pending"), answer
    - `Donation`: name (default "Anonymous"), amount (req, min 0), campaign (default "General Support"), date (req)
    - `DonationConfig`: goal (req, default 30000), singleton field (unique, default "config")
    - _Requirements: 2.4, 7.1, 8.1, 9.1, 9.5_

  - [ ] 3.3 Create models for `Project`, `Event`, `StreamState`
    - `Project`: title (req), description, status (enum: Current/Completed/Future, req), progress (min 0, max 100, default 0)
    - `Event`: title (req), date (req), location, description
    - `StreamState`: isLive (req, default false), streamUrl, streamTitle, singleton field (unique, default "stream")
    - _Requirements: 2.4, 10.1, 11.1, 12.1_

- [ ] 4. Implement the Auth controller and route
  - [ ] 4.1 Write `controllers/authController.js` and `routes/auth.js`
    - `loginAdmin`: compare `username` to `ADMIN_USERNAME`; compare `password` to `ADMIN_PASSWORD_HASH` via `bcrypt.compare`; on match sign 8-hour JWT `{ username }` and return `{ token, username }`; on mismatch return 401 `{ message: "Invalid credentials" }`
    - `verifyAdmin`: apply `authMiddleware`; return `{ valid: true, username: req.user.username }`
    - Register routes: `POST /api/auth/login`, `GET /api/auth/verify`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8_

  - [ ]* 4.2 Write unit tests for the auth controller
    - Correct credentials → 200 + token present in response
    - Wrong password → 401; wrong username → 401; missing field → 400
    - `GET /api/auth/verify` with valid token → `{ valid: true }`; with no token → 401; with bad token → 403
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7_

- [ ] 5. Implement the Books controller and route
  - [ ] 5.1 Write `controllers/booksController.js` and `routes/books.js`
    - `getBooks`: `Book.find().sort({ createdAt: -1 })`; return array
    - `createBook`: `new Book(req.body).save()`; return 201 + document
    - `updateBook`: `findByIdAndUpdate(id, body, { new: true, runValidators: true })`; 404 if null
    - `deleteBook`: `findByIdAndDelete(id)`; 204 if found; 404 if null
    - Register routes: `GET /api/books` (public), `POST`, `PUT /:id`, `DELETE /:id` (protected)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.2 Write property test for Books CRUD round-trip (Property 4)
    - **Property 4: CRUD round-trip identity for collection resources**
    - **Validates: Requirements 4.1, 4.2**

  - [ ]* 5.3 Write property test for Books DELETE removes resource (Property 5)
    - **Property 5: DELETE removes the resource and makes it unfetchable**
    - **Validates: Requirements 4.4**

  - [ ]* 5.4 Write unit tests for the Books controller
    - `GET /api/books` returns an array
    - `POST /api/books` returns 201 and the created document
    - `PUT /api/books/:id` with non-existent id → 404 `{ message: "Book not found" }`
    - `DELETE /api/books/:id` with non-existent id → 404
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. Implement the Content controller and route
  - [ ] 6.1 Write `controllers/contentController.js` and `routes/content.js`
    - `getContent`: `ContentItem.find(filter).sort({ createdAt: -1 })` where `filter = req.query.type ? { type } : {}`
    - `createContent`: return 201 + document
    - `updateContent`: 404 if not found
    - `deleteContent`: 204 if found; 404 if null
    - Register routes: `GET /api/content` (public), `POST`, `PUT /:id`, `DELETE /:id` (protected)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 6.2 Write property test for Content type filter (Property 10)
    - **Property 10: Content type filter returns only matching documents**
    - **Validates: Requirements 5.2**

  - [ ]* 6.3 Write property test for Content CRUD round-trip (Property 4)
    - **Property 4: CRUD round-trip identity for collection resources**
    - **Validates: Requirements 5.1, 5.3**

- [ ] 7. Implement the Gallery controller and route
  - [ ] 7.1 Write `controllers/galleryController.js` and `routes/gallery.js`
    - `getPhotos` / `getVideos`: `find().sort({ createdAt: -1 })`
    - `addPhoto` / `addVideo`: return 201 + document
    - `deletePhoto` / `deleteVideo`: 204 if found; 404 `{ message: "Media item not found" }` if null
    - Register routes: `GET /api/gallery/photos`, `GET /api/gallery/videos` (public); `POST` and `DELETE /:id` for both (protected)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 7.2 Write property test for Gallery CRUD round-trip (Property 4)
    - **Property 4: CRUD round-trip identity for collection resources**
    - **Validates: Requirements 6.1, 6.3_

  - [ ]* 7.3 Write property test for Gallery DELETE (Property 5)
    - **Property 5: DELETE removes the resource and makes it unfetchable**
    - **Validates: Requirements 6.5, 6.6**

- [ ] 8. Implement the Sermons controller and route
  - [ ] 8.1 Write `controllers/sermonsController.js` and `routes/sermons.js`
    - `getSermons`: `Sermon.find().sort({ createdAt: -1 })`
    - `createSermon`: return 201 + document
    - `updateSermon`: 404 if not found
    - `deleteSermon`: 204 if found; 404 if null
    - Register routes: `GET /api/sermons` (public); `POST`, `PUT /:id`, `DELETE /:id` (protected)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 8.2 Write property test for Sermons CRUD round-trip (Property 4)
    - **Property 4: CRUD round-trip identity for collection resources**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 9. Implement the Prayer Requests controller and route
  - [ ] 9.1 Write `controllers/prayersController.js` and `routes/prayers.js`
    - `getPublicPrayers`: `PrayerRequest.find({ status: { $in: ["Approved", "Praise Report"] } }).sort({ createdAt: -1 })`
    - `getAllPrayers` (protected): `find().sort({ createdAt: -1 })`
    - `createPrayer`: set `status: "Pending"` on creation; return 201
    - `incrementPray`: `findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true })`; 404 if null
    - `updatePrayerStatus` (protected): update `status` and `answer`; 404 if null
    - `deletePrayer` (protected): 204 if found; 404 if null
    - Register all prayer routes
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 9.2 Write property test for prayer count monotonic increment (Property 6)
    - **Property 6: Prayer count increment is monotonically increasing**
    - **Validates: Requirements 8.4**

  - [ ]* 9.3 Write property test for public prayer endpoint never exposes pending (Property 9)
    - **Property 9: Public prayer endpoint never exposes pending requests**
    - **Validates: Requirements 8.1**

  - [ ]* 9.4 Write unit tests for the Prayers controller
    - Status transition Pending → Approved
    - Status transition Pending → Praise Report with answer field
    - `PATCH /pray` increments count by 1
    - `GET /api/prayers` (public) does not include Pending requests
    - _Requirements: 8.1, 8.4, 8.5_

- [ ] 10. Implement the Donations controller and route
  - [ ] 10.1 Write `controllers/donationsController.js` and `routes/donations.js`
    - `getSummary`: aggregate `totalRaised` and `count` via `$group`; read `goal` from `DonationConfig`; return combined object
    - `getAllDonations` (protected): `Donation.find().sort({ createdAt: -1 })`
    - `createDonation`: accept `donorName`, `amount`, `campaign`, `date`; return 201
    - `getGoal` (protected): return current goal from `DonationConfig`
    - `updateGoal` (protected): `DonationConfig.findOneAndUpdate({}, { goal }, { upsert: true, new: true })`
    - Register routes: `GET /api/donations/summary` (public), `GET /api/donations`, `POST /api/donations` (public), `GET /api/donations/goal`, `PUT /api/donations/goal` (protected)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 10.2 Write property test for donation summary totalRaised (Property 8)
    - **Property 8: Donation summary totalRaised equals the sum of all donation amounts**
    - **Validates: Requirements 9.1, 9.3**

  - [ ]* 10.3 Write property test for donation goal round-trip (Property 11)
    - **Property 11: Donation goal round-trip**
    - **Validates: Requirements 9.5, 9.6**

  - [ ]* 10.4 Write unit tests for the Donations controller
    - `GET /api/donations/summary` aggregate total matches inserted documents
    - `POST /api/donations` returns 201 and persisted document
    - _Requirements: 9.1, 9.3_

- [ ] 11. Implement the Projects and Events controllers and routes
  - [ ] 11.1 Write `controllers/projectsController.js` and `routes/projects.js`
    - `getProjects`: `Project.find()`
    - `createProject`: return 201
    - `updateProject`: 404 if not found
    - `deleteProject`: 204 if found; 404 if null
    - Register routes: `GET /api/projects` (public); `POST`, `PUT /:id`, `DELETE /:id` (protected)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 11.2 Write `controllers/eventsController.js` and `routes/events.js`
    - `getEvents`: `Event.find().sort({ date: 1 })` (ascending)
    - `createEvent`: return 201
    - `updateEvent`: 404 if not found
    - `deleteEvent`: 204 if found; 404 if null
    - Register routes: `GET /api/events` (public); `POST`, `PUT /:id`, `DELETE /:id` (protected)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 11.3 Write property tests for Projects and Events CRUD round-trips (Property 4, Property 5)
    - **Property 4: CRUD round-trip identity for collection resources**
    - **Property 5: DELETE removes the resource and makes it unfetchable**
    - **Validates: Requirements 10.1, 10.2, 10.4, 11.1, 11.2, 11.4**

- [ ] 12. Implement the Stream State controller and route
  - [ ] 12.1 Write `controllers/streamController.js` and `routes/stream.js`
    - `getStream`: `StreamState.findOne({ singleton: "stream" })` or return default `{ isLive: false, streamUrl: "", streamTitle: "" }` if null
    - `updateStream`: `StreamState.findOneAndUpdate({ singleton: "stream" }, body, { upsert: true, new: true, runValidators: true })`
    - Register routes: `GET /api/stream` (public); `PUT /api/stream` (protected)
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 12.2 Write property test for stream state singleton (Property 7)
    - **Property 7: Stream state singleton — PUT is idempotent with respect to document count**
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [ ]* 12.3 Write unit tests for the Stream controller
    - Two consecutive PUTs leave exactly one document in the collection
    - `GET /api/stream` when no document exists returns the default state
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 13. Checkpoint — Backend API complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Write the data seeder (`seed.js`)
  - [ ] 14.1 Implement `seed.js` with skip-if-non-empty logic
    - Load `dotenv`, validate `MONGO_URI`, connect to MongoDB via `mongoose.connect`
    - For each seeded collection: count documents; skip with log if count > 0; `insertMany(seedData)` and log count if empty
    - Seed data: extract the initial Books, ContentItems, GalleryPhotos, GalleryVideos, Sermons, PrayerRequests, Projects, and Events from the original `AppContext.jsx`
    - Insert `DonationConfig` with default goal if not present
    - Disconnect and exit after seeding summary is logged
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 15. Implement the frontend `apiClient` utility
  - [ ] 15.1 Create `src/utils/apiClient.js`
    - Read `VITE_API_BASE_URL` (fall back to `http://localhost:3001`)
    - `request(path, options)`: read `ms_admin_token` from `localStorage`; build headers with `Content-Type: application/json` and conditional `Authorization: Bearer <token>`; `fetch(BASE_URL + path, ...)`; throw on non-ok (`body.message` or `HTTP <status>`); return `null` for 204; return `res.json()` otherwise
    - Export `apiClient.get`, `apiClient.post`, `apiClient.put`, `apiClient.patch`, `apiClient.delete`
    - _Requirements: 15.1, 15.2_

  - [ ]* 15.2 Write frontend unit tests for `apiClient`
    - Mock `fetch`; verify Bearer token is injected when `ms_admin_token` is set
    - Verify no Authorization header when `ms_admin_token` is absent
    - Verify 204 response returns null
    - Verify error is thrown with server `body.message` on non-ok response
    - _Requirements: 15.1, 15.2_

- [ ] 16. Refactor `AppContext.jsx` to use the REST API
  - [ ] 16.1 Add `loading` and `errors` state objects; implement mount fetch with `Promise.allSettled`
    - Replace all `localStorage` reads with `apiClient.get` calls for each domain
    - Add `loading` state (`books`, `content`, `gallery`, `sermons`, `prayers`, `donations`, `projects`, `events`, `stream`) initialized to `false`
    - Add `errors` state per domain initialized to `null`
    - Single `useEffect([], [])`: set all loading keys to `true`, fire all domain fetches in parallel via `Promise.allSettled`, update domain state, clear loading, set errors on rejection
    - _Requirements: 15.3, 15.4, 4.6, 5.7, 6.8, 7.6, 8.8, 9.7, 10.6, 11.6, 12.4_

  - [ ] 16.2 Replace auth logic with JWT-based login/logout and token verification
    - `loginAdmin(username, password)`: call `POST /api/auth/login`; store `ms_admin_token` in localStorage; set `isAdminLoggedIn = true`
    - `logoutAdmin()`: remove `ms_admin_token`; set `isAdminLoggedIn = false`
    - On mount: if `ms_admin_token` exists, call `GET /api/auth/verify`; if it fails (network or 4xx) clear the token and treat as logged out
    - _Requirements: 3.9, 3.10, 3.11_

  - [ ] 16.3 Replace all CRUD mutation actions with `apiClient` calls and re-fetch on success
    - Replace all `localStorage.setItem` / update-array patterns with `apiClient.post/put/patch/delete` calls
    - After each successful mutation call the domain's fetch function to sync state
    - On failure: update `errors.<domain>` with error message and rethrow
    - Cover all domains: books, content, gallery photos, gallery videos, sermons, prayer requests, donations, projects, events, stream
    - _Requirements: 4.2, 4.3, 4.4, 5.3, 5.4, 5.5, 6.3, 6.4, 6.5, 6.6, 7.2, 7.3, 7.4, 8.3, 8.4, 8.5, 8.6, 9.3, 9.6, 10.2, 10.3, 10.4, 11.2, 11.3, 11.4, 12.2, 15.5, 15.6_

  - [ ]* 16.4 Write frontend tests for `AppContext`
    - Mock `apiClient`; verify all domain loading keys go `true → false` on mount
    - Verify domain state is populated after mount fetch resolves
    - Verify re-fetch is called after a successful POST mutation
    - Verify `errors.<domain>` is set when a mutation fails
    - _Requirements: 15.3, 15.4, 15.5, 15.6_

- [ ] 17. Write property-based tests for auth properties (Properties 1, 2, 3)
  - [ ]* 17.1 Write property test for valid credentials always yield a verifiable token (Property 1)
    - **Property 1: Valid credentials always yield a verifiable token**
    - **Validates: Requirements 3.1, 3.2, 3.8, 3.11**

  - [ ]* 17.2 Write property test for invalid credentials never yield a token (Property 2)
    - **Property 2: Invalid credentials never yield a token**
    - **Validates: Requirements 3.3**

  - [ ]* 17.3 Write property test for protected routes rejecting invalid tokens (Property 3)
    - **Property 3: Protected routes reject requests without a valid token**
    - **Validates: Requirements 3.5, 3.6, 3.7**

- [ ] 18. Write unit tests for middleware
  - [ ]* 18.1 Write unit tests for `authMiddleware`
    - Missing `Authorization` header → 401
    - Malformed / expired token → 403
    - Valid token → calls `next()` and sets `req.user`
    - _Requirements: 3.5, 3.6, 3.7_

  - [ ]* 18.2 Write unit tests for `notFound` and `errorHandler`
    - Unmatched route → 404 `{ message: "Route not found" }`
    - Error thrown in route → 500 `{ message: "Internal server error" }`
    - CORS error thrown → 403
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 19. Final checkpoint — Full stack integration complete
  - Ensure all backend and frontend tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements and design sections for traceability
- The backend must be started before running frontend integration tests
- Environment variables must be populated in `.env` before running the backend; use `node -e "const b=require('bcrypt');b.hash('yourPassword',12).then(console.log)"` to generate `ADMIN_PASSWORD_HASH`
- `seed.js` should only be run once against a fresh database; subsequent runs will skip non-empty collections automatically
- All 11 properties from the design's Correctness Properties section are covered by PBT tasks

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "3.1", "3.2", "3.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "5.1", "6.1", "7.1", "8.1", "9.1", "10.1", "11.1", "11.2", "12.1"] },
    { "id": 4, "tasks": ["4.2", "5.2", "5.3", "5.4", "6.2", "6.3", "7.2", "7.3", "8.2", "9.2", "9.3", "9.4", "10.2", "10.3", "10.4", "11.3", "12.2", "12.3", "14.1"] },
    { "id": 5, "tasks": ["15.1", "17.1", "17.2", "17.3", "18.1", "18.2"] },
    { "id": 6, "tasks": ["15.2", "16.1"] },
    { "id": 7, "tasks": ["16.2", "16.3"] },
    { "id": 8, "tasks": ["16.4"] }
  ]
}
```
