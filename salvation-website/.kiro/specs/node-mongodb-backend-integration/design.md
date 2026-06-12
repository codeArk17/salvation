# Design Document — node-mongodb-backend-integration

## Overview

This design migrates the Salvation Ministry website from an all-client-side, `localStorage`-backed architecture to a full-stack system. A new **Node.js + Express** REST API (`salvation-backend`) backed by **MongoDB Atlas** via **Mongoose** replaces every `localStorage` read/write in the React 19 + Vite frontend. The frontend's `AppContext.jsx` is refactored to call the REST API on mount and after every mutation, while a centralized `apiClient` utility handles base URL configuration and JWT injection automatically.

The nine data domains—Books, Content, Gallery (Photos + Videos), Sermons, Prayer Requests, Donations, Projects, Events, and Stream State—each become a Mongoose model with a matching Express router. Admin authentication changes from a hardcoded password stored in `localStorage` to a stateless JWT issued by the backend and validated on every protected request.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│  Browser (React 19 + Vite — salvation-website)             │
│                                                            │
│  AppContext.jsx                                            │
│    ├── apiClient (src/utils/apiClient.js)                  │
│    │     • prefixes VITE_API_BASE_URL                      │
│    │     • injects Bearer token from localStorage          │
│    └── per-domain loading / error state                    │
└──────────────────────┬─────────────────────────────────────┘
                       │  HTTPS / REST  (JSON)
                       │  CORS: FRONTEND_ORIGIN + localhost:5173
                       ▼
┌────────────────────────────────────────────────────────────┐
│  Node.js 20 + Express 5 (salvation-backend)                │
│                                                            │
│  index.js  ──► app.js                                      │
│  middleware/                                               │
│    ├── authMiddleware.js  (JWT validation)                 │
│    ├── errorHandler.js    (global 500 handler)             │
│    └── notFound.js        (404 handler)                    │
│  routes/   (one router per domain)                         │
│  controllers/ (business logic, one file per domain)        │
│  models/   (10 Mongoose schemas)                           │
│  seed.js   (standalone seeder)                             │
└──────────────────────┬─────────────────────────────────────┘
                       │  mongoose / TCP
                       ▼
┌────────────────────────────────────────────────────────────┐
│  MongoDB Atlas (cloud cluster)                             │
│  Collections: books, contentitems, galleryphotos,          │
│  galleryvideos, sermons, prayers, donations, projects,     │
│  events, streamstates, donationconfigs                     │
└────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**Stateless JWT auth** — the backend issues an 8-hour JWT; no server-side session store is needed. Each protected request carries the token in `Authorization: Bearer <token>`.

**Singleton documents** — `StreamState` and a `DonationConfig` (for the fundraising goal) are each a single MongoDB document. Controllers use `findOneAndUpdate` with `upsert: true` to guarantee exactly one document exists.

**Re-fetch after mutation** — after every successful POST / PUT / PATCH / DELETE from the frontend, `AppContext` re-fetches the affected domain. This is simpler than partial optimistic updates and ensures the UI always reflects the authoritative database state, at the cost of one extra round-trip per mutation.

**Environment-gated seeder** — `seed.js` connects directly to MongoDB via `MONGO_URI`, checks each collection's document count, and skips non-empty collections. It is run once after the first deploy.

---

## Components and Interfaces

### Backend Project Structure

```
salvation-backend/
├── index.js                  # Entry point: env validation, DB connect, server listen
├── app.js                    # Express app factory: middleware, routes, error handlers
├── .env                      # (gitignored) environment variables
├── seed.js                   # Standalone data seeder
├── package.json
├── models/
│   ├── Book.js
│   ├── ContentItem.js
│   ├── GalleryPhoto.js
│   ├── GalleryVideo.js
│   ├── Sermon.js
│   ├── PrayerRequest.js
│   ├── Donation.js
│   ├── Project.js
│   ├── Event.js
│   ├── StreamState.js
│   └── DonationConfig.js
├── routes/
│   ├── auth.js
│   ├── books.js
│   ├── content.js
│   ├── gallery.js
│   ├── sermons.js
│   ├── prayers.js
│   ├── donations.js
│   ├── projects.js
│   ├── events.js
│   └── stream.js
├── controllers/
│   ├── authController.js
│   ├── booksController.js
│   ├── contentController.js
│   ├── galleryController.js
│   ├── sermonsController.js
│   ├── prayersController.js
│   ├── donationsController.js
│   ├── projectsController.js
│   ├── eventsController.js
│   └── streamController.js
└── middleware/
    ├── authMiddleware.js
    ├── errorHandler.js
    └── notFound.js
```

### Frontend Changes

```
salvation-website/src/
├── utils/
│   └── apiClient.js          # NEW — centralized fetch wrapper
└── context/
    └── AppContext.jsx         # UPDATED — API calls replace localStorage
```

### REST API Endpoint Table

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | GET | `/health` | Public | Health check |
| 2 | POST | `/api/auth/login` | Public | Issue JWT |
| 3 | GET | `/api/auth/verify` | Public | Validate existing token |
| 4 | GET | `/api/books` | Public | List all books (desc) |
| 5 | POST | `/api/books` | Protected | Create book |
| 6 | PUT | `/api/books/:id` | Protected | Update book |
| 7 | DELETE | `/api/books/:id` | Protected | Delete book |
| 8 | GET | `/api/content` | Public | List content (optional `?type=`) |
| 9 | POST | `/api/content` | Protected | Create content item |
| 10 | PUT | `/api/content/:id` | Protected | Update content item |
| 11 | DELETE | `/api/content/:id` | Protected | Delete content item |
| 12 | GET | `/api/gallery/photos` | Public | List gallery photos |
| 13 | GET | `/api/gallery/videos` | Public | List gallery videos |
| 14 | POST | `/api/gallery/photos` | Protected | Add gallery photo |
| 15 | POST | `/api/gallery/videos` | Protected | Add gallery video |
| 16 | DELETE | `/api/gallery/photos/:id` | Protected | Delete gallery photo |
| 17 | DELETE | `/api/gallery/videos/:id` | Protected | Delete gallery video |
| 18 | GET | `/api/sermons` | Public | List sermons (desc) |
| 19 | POST | `/api/sermons` | Protected | Create sermon |
| 20 | PUT | `/api/sermons/:id` | Protected | Update sermon |
| 21 | DELETE | `/api/sermons/:id` | Protected | Delete sermon |
| 22 | GET | `/api/prayers` | Public | List approved/praise prayers |
| 23 | GET | `/api/prayers/all` | Protected | List all prayers (incl. pending) |
| 24 | POST | `/api/prayers` | Public | Submit prayer request |
| 25 | PATCH | `/api/prayers/:id/pray` | Public | Increment pray count |
| 26 | PATCH | `/api/prayers/:id/status` | Protected | Update prayer status/answer |
| 27 | DELETE | `/api/prayers/:id` | Protected | Delete prayer request |
| 28 | GET | `/api/donations/summary` | Public | totalRaised, goal, count |
| 29 | GET | `/api/donations` | Protected | Full donation ledger |
| 30 | POST | `/api/donations` | Public | Record a donation |
| 31 | GET | `/api/donations/goal` | Protected | Get fundraising goal |
| 32 | PUT | `/api/donations/goal` | Protected | Update fundraising goal |
| 33 | GET | `/api/projects` | Public | List all projects |
| 34 | POST | `/api/projects` | Protected | Create project |
| 35 | PUT | `/api/projects/:id` | Protected | Update project |
| 36 | DELETE | `/api/projects/:id` | Protected | Delete project |
| 37 | GET | `/api/events` | Public | List events (date asc) |
| 38 | POST | `/api/events` | Protected | Create event |
| 39 | PUT | `/api/events/:id` | Protected | Update event |
| 40 | DELETE | `/api/events/:id` | Protected | Delete event |
| 41 | GET | `/api/stream` | Public | Get stream state singleton |
| 42 | PUT | `/api/stream` | Protected | Update stream state |

### Auth Middleware (`middleware/authMiddleware.js`)

```
Request
  └─► Extract header: Authorization: Bearer <token>
        ├── missing → 401 { "message": "No token provided" }
        └── present → jwt.verify(token, JWT_SECRET)
              ├── invalid / expired → 403 { "message": "Invalid or expired token" }
              └── valid → attach decoded payload to req.user → next()
```

```js
// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}
```

### Admin Authentication Flow

1. `POST /api/auth/login` receives `{ username, password }`.
2. Controller reads `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` from `process.env`.
3. Username is compared directly (case-sensitive string equality).
4. Password is compared using `bcrypt.compare(password, ADMIN_PASSWORD_HASH)`.
5. On match: `jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' })` is returned as `{ token, username }`.
6. On mismatch: HTTP 401 `{ "message": "Invalid credentials" }`.

`ADMIN_PASSWORD_HASH` is generated once with `bcrypt.hash('yourPassword', 12)` and stored in `.env`. No passwords are ever in source code.

`GET /api/auth/verify` simply runs `authMiddleware` and returns `{ valid: true, username: req.user.username }` on success.

### CORS Configuration

```js
// in app.js
import cors from 'cors';

const allowedOrigins = [process.env.FRONTEND_ORIGIN];
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Global Error Handler and 404 Handler

```js
// middleware/notFound.js
export default function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  // CORS errors surface here — respond with 403
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy violation' });
  }
  res.status(500).json({ message: 'Internal server error' });
}
```

Routes are registered first, then `notFound`, then `errorHandler` (Express convention for error handlers: 4-argument signature).

### Frontend `apiClient` Utility

```js
// src/utils/apiClient.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const token = localStorage.getItem('ms_admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};
```

### AppContext Refactor Strategy

**State shape** — same domain state variables as before (`books`, `content`, etc.) plus two new objects:

```js
const [loading, setLoading] = useState({
  books: false, content: false, gallery: false, sermons: false,
  prayers: false, donations: false, projects: false, events: false, stream: false,
});
const [errors, setErrors] = useState({
  books: null, content: null, gallery: null, sermons: null,
  prayers: null, donations: null, projects: null, events: null, stream: null,
});
```

**Mount fetches** — a single `useEffect([], [])` fires all domain fetches in parallel using `Promise.allSettled`, so one failing domain does not block others:

```js
useEffect(() => {
  // set all loading keys to true
  // fetch all domains in parallel
  // on each result: set domain state + clear loading + set error if rejected
}, []);
```

**Mutation pattern** — every CRUD action calls `apiClient`, then on success calls the domain's `fetch` function again to sync state. On failure it sets the relevant `errors` key and rethrows so callers can surface UI feedback.

**Auth changes**:
- `loginAdmin(username, password)` → calls `POST /api/auth/login`, stores returned token in `localStorage` under `ms_admin_token`, sets `isAdminLoggedIn = true`.
- `logoutAdmin()` → removes `ms_admin_token`, sets `isAdminLoggedIn = false`.
- On mount: if `ms_admin_token` exists, call `GET /api/auth/verify`; if it fails, clear the token.

---

## Data Models

### Book

```js
const bookSchema = new Schema({
  title:           { type: String, required: true },
  description:     { type: String, required: true },
  price:           { type: Number, required: true, default: 0 },
  downloadUrl:     { type: String, default: '' },
  coverUrl:        { type: String, default: '' },
  previewChapters: { type: [String], default: [] },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 })
```

### ContentItem

```js
const contentItemSchema = new Schema({
  type:    { type: String, required: true, enum: ['Blog', 'Testimony', 'Devotional'] },
  title:   { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  date:    { type: String, required: true },   // human-readable, e.g. "June 10, 2026"
  image:   { type: String, default: '' },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 }) — optional ?type= filter
```

### GalleryPhoto

```js
const galleryPhotoSchema = new Schema({
  url:      { type: String, required: true },
  title:    { type: String, default: '' },
  category: { type: String, default: '' },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 })
```

### GalleryVideo

```js
const galleryVideoSchema = new Schema({
  url:      { type: String, required: true },
  title:    { type: String, default: '' },
  category: { type: String, default: '' },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 })
```

### Sermon

```js
const sermonSchema = new Schema({
  title:    { type: String, required: true },
  type:     { type: String, required: true, enum: ['Audio', 'Video'] },
  url:      { type: String, required: true },
  date:     { type: String, required: true },
  duration: { type: String, default: '' },
  notes:    { type: String, default: '' },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 })
```

### PrayerRequest

```js
const prayerRequestSchema = new Schema({
  name:   { type: String, default: 'Anonymous' },
  text:   { type: String, required: true },
  date:   { type: String, required: true },
  count:  { type: Number, default: 0 },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Praise Report'], default: 'Pending' },
  answer: { type: String, default: '' },
}, { timestamps: true });
// public GET: .find({ status: { $in: ['Approved', 'Praise Report'] } }).sort({ createdAt: -1 })
// admin GET:  .find().sort({ createdAt: -1 })
```

### Donation

```js
const donationSchema = new Schema({
  name:     { type: String, default: 'Anonymous' },
  amount:   { type: Number, required: true, min: 0 },
  campaign: { type: String, default: 'General Support' },
  date:     { type: String, required: true },
}, { timestamps: true });
// sorted GET: .find().sort({ createdAt: -1 })
```

### DonationConfig (singleton)

```js
// Stores the fundraising goal separately from individual Donation documents.
const donationConfigSchema = new Schema({
  goal:      { type: Number, required: true, default: 30000 },
  singleton: { type: String, default: 'config', unique: true }, // enforces one doc
}, { timestamps: true });
```

The `GET /api/donations/summary` controller aggregates `totalRaised` with `Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }])`, then reads `goal` from `DonationConfig`.

### Project

```js
const projectSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  status:      { type: String, required: true, enum: ['Current', 'Completed', 'Future'] },
  progress:    { type: Number, required: true, min: 0, max: 100, default: 0 },
}, { timestamps: true });
```

### Event

```js
const eventSchema = new Schema({
  title:       { type: String, required: true },
  date:        { type: String, required: true },
  location:    { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });
// sorted GET: .find().sort({ date: 1 }) — ascending so soonest events appear first
```

### StreamState (singleton)

```js
const streamStateSchema = new Schema({
  isLive:      { type: Boolean, required: true, default: false },
  streamUrl:   { type: String, default: '' },
  streamTitle: { type: String, default: '' },
  singleton:   { type: String, default: 'stream', unique: true }, // enforces one doc
}, { timestamps: true });
// GET: findOne() or return default; PUT: findOneAndUpdate({singleton:'stream'}, body, {upsert:true, new:true})
```

### Startup Environment Validation (`index.js`)

```js
import 'dotenv/config';

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];
for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid credentials always yield a verifiable token

*For any* valid `username` / `password` combination that matches the configured `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH`, calling `POST /api/auth/login` and then immediately calling `GET /api/auth/verify` with the returned token SHALL return `{ valid: true }`.

**Validates: Requirements 3.1, 3.2, 3.8, 3.11**

---

### Property 2: Invalid credentials never yield a token

*For any* `username` or `password` that does not match the configured admin credentials, calling `POST /api/auth/login` SHALL respond with HTTP 401 and SHALL NOT include a token in the response body.

**Validates: Requirements 3.3**

---

### Property 3: Protected routes reject requests without a valid token

*For any* protected endpoint and *any* request that omits the `Authorization` header or supplies a malformed / expired token, the API SHALL respond with HTTP 401 or HTTP 403 respectively, and SHALL NOT return resource data.

**Validates: Requirements 3.5, 3.6, 3.7**

---

### Property 4: CRUD round-trip identity for collection resources

*For any* valid resource body submitted to a `POST` endpoint (Books, ContentItems, GalleryPhotos, GalleryVideos, Sermons, Projects, Events), immediately fetching the collection via the corresponding `GET` endpoint SHALL include a document whose fields match the submitted body.

**Validates: Requirements 4.1–4.2, 5.1–5.3, 6.1–6.4, 7.1–7.2, 10.1–10.2, 11.1–11.2**

---

### Property 5: DELETE removes the resource and makes it unfetchable

*For any* existing resource `id`, after a successful `DELETE` call, any subsequent `GET` of the collection or individual item SHALL NOT include a document with that `id`.

**Validates: Requirements 4.4, 5.5, 6.5–6.6, 7.4, 8.6, 10.4, 11.4**

---

### Property 6: Prayer count increment is monotonically increasing

*For any* Prayer_Request document with an initial `count` value `n`, after `k` consecutive calls to `PATCH /api/prayers/:id/pray`, the document's `count` field SHALL equal `n + k`.

**Validates: Requirements 8.4**

---

### Property 7: Stream state singleton — PUT is idempotent with respect to document count

*For any* sequence of `PUT /api/stream` calls with arbitrary valid bodies, the database SHALL always contain exactly one `StreamState` document, and `GET /api/stream` SHALL return the body from the most recent `PUT`.

**Validates: Requirements 12.1–12.3**

---

### Property 8: Donation summary totalRaised equals the sum of all donation amounts

*For any* set of Donation records in the database, the `totalRaised` value returned by `GET /api/donations/summary` SHALL equal the arithmetic sum of the `amount` field across all Donation documents.

**Validates: Requirements 9.1, 9.3**

---

### Property 9: Public prayer endpoint never exposes pending requests

*For any* database state, the array returned by the public `GET /api/prayers` endpoint SHALL contain only documents whose `status` field is `"Approved"` or `"Praise Report"` — never `"Pending"`.

**Validates: Requirements 8.1**

---

### Property 10: Content type filter returns only matching documents

*For any* database containing Content_Item documents of mixed types (Blog, Testimony, Devotional), calling `GET /api/content?type=X` SHALL return only documents whose `type` field equals `X`, and calling `GET /api/content` without a type parameter SHALL return all documents regardless of type.

**Validates: Requirements 5.2**

---

### Property 11: Donation goal round-trip

*For any* positive numeric value submitted to `PUT /api/donations/goal`, an immediate call to `GET /api/donations/goal` SHALL return exactly that value.

**Validates: Requirements 9.5, 9.6**

---

## Error Handling

### Backend Error Hierarchy

```
┌─ Route-level validation errors (400)
│    • missing required fields
│    • invalid enum values (Mongoose ValidationError)
│
├─ Auth errors (401 / 403)
│    • missing token → 401
│    • invalid / expired token → 403
│    • wrong credentials → 401
│
├─ Not-found errors (404)
│    • resource by :id not found → 404 with domain-specific message
│    • unknown route → 404 "Route not found"
│
├─ CORS violation (403)
│    • surfaced through errorHandler.js
│
└─ Unhandled errors (500)
     • log full stack trace
     • respond { "message": "Internal server error" }
```

**Mongoose validation errors** are caught in each controller's try/catch and returned as HTTP 400 with `{ message: err.message }` before reaching the global error handler.

**Not-found pattern** — every PUT/DELETE controller does:

```js
const doc = await Model.findByIdAndUpdate(id, body, { new: true });
if (!doc) return res.status(404).json({ message: '<Resource> not found' });
```

### Frontend Error Handling

- `apiClient.request` throws an `Error` whose message is the server's `body.message` or `"HTTP <status>"` for non-JSON responses.
- Each AppContext action wraps the `apiClient` call in try/catch, updates `errors.<domain>`, and rethrows.
- UI components read `loading.<domain>` and `errors.<domain>` from context to show spinners or toast messages.
- Auth verify failure on mount: silent clear of `ms_admin_token`, no error surfaced to the visitor UI.

---

## Testing Strategy

### Unit Tests (Jest + Supertest)

Unit tests cover specific examples, edge cases, and error conditions at the controller level, using an in-memory MongoDB instance (`mongodb-memory-server`) to avoid real database calls.

- **Auth controller**: correct credential → 200 + token; wrong credential → 401; missing field → 400.
- **Books controller**: list returns array; create returns 201 + body; PUT non-existent id → 404; DELETE non-existent id → 404.
- **Prayer status controller**: status transition Pending→Approved; Pending→Praise Report with answer.
- **Donation summary**: aggregate total matches inserted documents.
- **Stream singleton**: two consecutive PUTs leave exactly one document.
- **authMiddleware**: missing header → 401; invalid token → 403; valid token → calls `next()`.
- **notFound handler**: unmatched route → 404 `{ message: "Route not found" }`.
- **errorHandler**: error thrown in route → 500 `{ message: "Internal server error" }`.

### Property-Based Tests (fast-check)

The property-based tests are written with [fast-check](https://github.com/dubzzz/fast-check), run via Jest, with a minimum of **100 iterations per property**. Each test is tagged with the corresponding design property.

```
// Tag format: Feature: node-mongodb-backend-integration, Property N: <text>
```

**Property 1** — Generate random valid `(username, password)` matching env credentials, call login then verify, assert `valid: true`.

**Property 2** — Generate random strings for `username` and `password` that are filtered to never match env credentials, call login, assert HTTP 401, assert no `token` key in response.

**Property 3** — Generate random bearer strings (empty, malformed, expired), call each protected endpoint, assert response status is 401 or 403.

**Property 4** — Generate random valid resource bodies for each domain, POST then GET, assert the created document appears in the collection response.

**Property 5** — For each domain, insert a random document, DELETE it, GET the collection, assert the deleted id is absent.

**Property 6** — Generate a random initial `count` n ≥ 0, create a prayer with that count, send k (1–50) PATCH /pray requests, assert final count = n + k.

**Property 7** — Generate a random sequence (1–10) of valid stream state bodies, PUT each sequentially, assert final document count = 1 and GET returns the last PUT body.

**Property 8** — Generate a random list of positive donation amounts, insert them, call GET /api/donations/summary, assert `totalRaised` equals the sum of all inserted amounts.

**Property 9** — Generate a mix of Pending, Approved, and Praise Report prayer documents, call the public GET /api/prayers endpoint, assert no document in the response has `status === "Pending"`.

**Test Configuration** (`jest.config.js`):

```js
export default {
  testEnvironment: 'node',
  transform: {},           // ESM — no transpilation needed with Node 20
  setupFilesAfterFramework: ['./tests/setup.js'],
};
```

`tests/setup.js` starts `MongoMemoryServer` before all tests and stops it after.

### Integration Tests

Run against a real (staging) MongoDB Atlas cluster to verify:
- `seed.js` inserts the correct number of documents per collection.
- `seed.js` skips non-empty collections on a second run.
- `GET /health` returns 200 after server start.

### Frontend Tests (Vitest + Testing Library)

- `apiClient`: mock `fetch`, verify Bearer token injection when `ms_admin_token` is set vs. absent.
- `AppContext` mount: mock `apiClient`, verify all domain loading keys go `true → false`, verify state is populated.
- `AppContext` mutation: mock `apiClient`, verify re-fetch is called after a successful POST.

---

## Environment Variables

### Backend (`.env` in `salvation-backend/`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Cryptographically random string (≥ 32 chars) for signing JWTs |
| `PORT` | No (default 3001) | HTTP port for the Express server |
| `FRONTEND_ORIGIN` | Yes | Full origin URL of the deployed React frontend, e.g. `https://salvationministries.org` |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of the admin password (generate with `node -e "const b=require('bcrypt');b.hash('pw',12).then(console.log)"`) |
| `NODE_ENV` | No (default `development`) | Set to `production` to disable `localhost:5173` in CORS |

### Frontend (`.env` in `salvation-website/`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Full base URL of the backend API, e.g. `https://api.salvationministries.org` |

---

## Seed Script Design (`seed.js`)

```
seed.js execution flow:
1. Load dotenv, validate MONGO_URI present
2. Connect to MongoDB Atlas via mongoose.connect
3. For each seeded collection:
   a. Count documents in collection
   b. If count > 0 → log "[Collection] not empty — skipping" → continue
   c. If count = 0 → insertMany(seedData) → log "[Collection] seeded (N documents)"
4. Insert DonationConfig with goal = 30000 if none exists (upsert)
5. Insert StreamState singleton if none exists (upsert)
6. Disconnect and exit

Seed data source: verbatim initial arrays from the original AppContext.jsx
  (initialBooks, initialContent, initialGallery, initialSermons,
   initialPrayers, initialProjects, initialEvents)
  Donation ledger from initialDonations.ledger
```

The seeder is safe to re-run: all non-empty collections are skipped, and the two singleton upserts are idempotent.
