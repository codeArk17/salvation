# Requirements Document

## Introduction

This feature replaces the existing `localStorage`-based data layer in the Salvation Ministry React/Vite frontend with a persistent, server-backed architecture. A new Node.js + Express REST API will be built from scratch at `salvation-backend`, connected to a MongoDB Atlas cloud database. The React frontend's `AppContext.jsx` will be updated to call the REST API instead of reading/writing `localStorage`.

The nine data domains currently managed in `AppContext.jsx` — Books, Content (Blog/Testimony/Devotional), Gallery (Photos & Videos), Sermons, Prayer Requests, Donations, Projects, Events, and Stream State — will each be represented by a MongoDB model and a corresponding set of REST endpoints. Admin authentication will be replaced with a secure JWT-based system, eliminating the hardcoded password check.

---

## Glossary

- **API_Server**: The Node.js + Express application running at `salvation-backend`
- **Frontend**: The React 19 + Vite application running at `salvation-website`
- **AppContext**: The React context provider in `src/context/AppContext.jsx` that supplies data and actions to all components
- **Admin**: An authenticated ministry administrator who manages all content through the admin dashboard
- **Visitor**: An unauthenticated user browsing the public-facing pages of the website
- **JWT**: JSON Web Token — a signed, stateless token used to authenticate Admin requests
- **MongoDB_Atlas**: The cloud-hosted MongoDB cluster used as the application database
- **Protected_Route**: An API endpoint that requires a valid JWT in the `Authorization` header to respond
- **Public_Route**: An API endpoint that responds to unauthenticated requests
- **Book**: A ministry publication with title, description, price, cover image URL, download URL, and preview chapters
- **Content_Item**: A piece of editorial content of type Blog, Testimony, or Devotional, with title, excerpt, full content, date, and image URL
- **Gallery_Photo**: A photo record with URL, title, and category
- **Gallery_Video**: A video embed record with URL, title, and category
- **Sermon**: An audio or video message with title, type, URL, date, duration, and notes
- **Prayer_Request**: A visitor-submitted prayer need with name, text, date, pray count, status, and optional answer
- **Donation**: A record of a financial contribution with donor name, amount, campaign, and date
- **Project**: A ministry project with title, description, status (Current / Completed / Future), and progress percentage
- **Event**: An upcoming ministry event with title, date, location, and description
- **Stream_State**: The singleton document that controls whether the Live TV page shows a live stream and which URL/title it uses
- **CORS**: Cross-Origin Resource Sharing — the HTTP mechanism that allows the Frontend origin to call the API_Server
- **dotenv**: The npm package used to load environment variables from a `.env` file into `process.env`

---

## Requirements

### Requirement 1: Project Scaffolding and Environment Configuration

**User Story:** As a developer, I want a well-structured Node.js project with environment-based configuration, so that secrets are never hardcoded and the server is easy to run locally and in production.

#### Acceptance Criteria

1. THE API_Server SHALL be structured with separate directories for routes, controllers, models, and middleware.
2. THE API_Server SHALL load all sensitive configuration — MongoDB connection string, JWT secret, server port, and allowed frontend origin — from a `.env` file via `dotenv`.
3. IF the `MONGO_URI` environment variable is absent at startup, THEN THE API_Server SHALL terminate the process immediately without attempting a database connection or a graceful startup.
4. IF the `JWT_SECRET` environment variable is absent at startup, THEN THE API_Server SHALL log a descriptive error message and terminate the process.
5. THE API_Server SHALL expose a `GET /health` Public_Route that returns HTTP 200 and a JSON body `{ "status": "ok" }` to confirm the server is running.

---

### Requirement 2: MongoDB Atlas Connection

**User Story:** As a developer, I want the API server to connect to MongoDB Atlas on startup, so that all data is persisted in the cloud database.

#### Acceptance Criteria

1. WHEN the API_Server starts, THE API_Server SHALL establish a connection to MongoDB_Atlas using the `MONGO_URI` environment variable.
2. WHEN the MongoDB_Atlas connection is established successfully, THE API_Server SHALL log the message `"MongoDB connected"`.
3. IF the MongoDB_Atlas connection fails, THEN THE API_Server SHALL log the error details and terminate the process.
4. THE API_Server SHALL define Mongoose schemas for the following models: `Book`, `ContentItem`, `GalleryPhoto`, `GalleryVideo`, `Sermon`, `PrayerRequest`, `Donation`, `Project`, `Event`, `StreamState`.

---

### Requirement 3: Admin Authentication

**User Story:** As an Admin, I want to log in with a username and password and receive a JWT, so that my session is secure and stateless without relying on a hardcoded password check.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `POST /api/auth/login` Public_Route that accepts a JSON body with `username` and `password` fields.
2. WHEN valid Admin credentials are submitted to `POST /api/auth/login`, THE API_Server SHALL respond with HTTP 200 and a JSON body containing a signed JWT and the admin username.
3. IF invalid credentials are submitted to `POST /api/auth/login`, THEN THE API_Server SHALL respond with HTTP 401 and a JSON error body `{ "message": "Invalid credentials" }`.
4. THE API_Server SHALL seed a single Admin account from the `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` environment variables, so that no credentials are hardcoded in source code.
5. THE API_Server SHALL include an `authMiddleware` that validates the `Authorization: Bearer <token>` header on every Protected_Route request.
6. IF a request to a Protected_Route is missing the `Authorization` header, THEN THE API_Server SHALL respond with HTTP 401 and `{ "message": "No token provided" }`.
7. IF a request to a Protected_Route contains an expired or invalid JWT, THEN THE API_Server SHALL respond with HTTP 403 and `{ "message": "Invalid or expired token" }`.
8. THE JWT issued by `POST /api/auth/login` SHALL expire after 8 hours.
9. THE AppContext SHALL store the JWT in `localStorage` under the key `ms_admin_token` upon successful login.
10. THE AppContext SHALL remove the JWT from `localStorage` and clear the admin session on logout.
11. WHEN the Frontend is loaded, THE AppContext SHALL check `localStorage` for an existing `ms_admin_token` and, if present, validate it against `GET /api/auth/verify`; IF validation fails, THE AppContext SHALL block session restoration, clear the stored token, and treat the Admin as logged out.

---

### Requirement 4: Books API

**User Story:** As an Admin, I want to manage ministry books through the API, so that Visitors can browse and download the latest publications.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/books` Public_Route that returns an array of all Book documents sorted by creation date descending.
2. THE API_Server SHALL expose a `POST /api/books` Protected_Route that creates a new Book document from the request body and returns the created document with HTTP 201.
3. THE API_Server SHALL expose a `PUT /api/books/:id` Protected_Route that updates the Book with the given `id` and returns the updated document.
4. THE API_Server SHALL expose a `DELETE /api/books/:id` Protected_Route that deletes the Book with the given `id` and returns HTTP 204.
5. IF a `PUT` or `DELETE` request targets a Book `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Book not found" }`.
6. WHEN the Frontend mounts, THE AppContext SHALL fetch all Books from `GET /api/books` and store the result in the `books` state.

---

### Requirement 5: Content API (Blog, Testimony, Devotional)

**User Story:** As an Admin, I want to create and manage editorial content items, so that the Updates page always reflects the latest blogs, testimonies, and devotionals.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/content` Public_Route that returns an array of all Content_Item documents sorted by date descending.
2. WHERE a `type` query parameter is provided, THE API_Server SHALL filter Content_Item documents to those matching the specified type (`Blog`, `Testimony`, or `Devotional`).
3. THE API_Server SHALL expose a `POST /api/content` Protected_Route that creates a new Content_Item and returns the created document with HTTP 201.
4. THE API_Server SHALL expose a `PUT /api/content/:id` Protected_Route that updates the Content_Item with the given `id` and returns the updated document.
5. THE API_Server SHALL expose a `DELETE /api/content/:id` Protected_Route that deletes the Content_Item with the given `id` and returns HTTP 204.
6. IF a `PUT` or `DELETE` request targets a Content_Item `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Content item not found" }`.
7. WHEN the Frontend mounts, THE AppContext SHALL fetch all Content_Items from `GET /api/content` and store the result in the `content` state.

---

### Requirement 6: Gallery API (Photos and Videos)

**User Story:** As an Admin, I want to manage gallery photos and videos through the API, so that the Gallery page always shows the current media collection.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/gallery/photos` Public_Route that returns an array of all Gallery_Photo documents sorted by creation date descending.
2. THE API_Server SHALL expose a `GET /api/gallery/videos` Public_Route that returns an array of all Gallery_Video documents sorted by creation date descending.
3. THE API_Server SHALL expose a `POST /api/gallery/photos` Protected_Route that creates a new Gallery_Photo and returns the created document with HTTP 201.
4. THE API_Server SHALL expose a `POST /api/gallery/videos` Protected_Route that creates a new Gallery_Video and returns the created document with HTTP 201.
5. THE API_Server SHALL expose a `DELETE /api/gallery/photos/:id` Protected_Route that deletes the Gallery_Photo with the given `id` and returns HTTP 204.
6. THE API_Server SHALL expose a `DELETE /api/gallery/videos/:id` Protected_Route that deletes the Gallery_Video with the given `id` and returns HTTP 204.
7. IF a `DELETE` request targets a Gallery_Photo or Gallery_Video `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Media item not found" }`.
8. WHEN the Frontend mounts, THE AppContext SHALL fetch all Gallery_Photos and Gallery_Videos in parallel and store the combined result in the `gallery` state as `{ photos: [...], videos: [...] }`.

---

### Requirement 7: Sermons API

**User Story:** As an Admin, I want to manage sermon recordings through the API, so that Visitors can access the full archive of audio and video messages.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/sermons` Public_Route that returns an array of all Sermon documents sorted by date descending.
2. THE API_Server SHALL expose a `POST /api/sermons` Protected_Route that creates a new Sermon and returns the created document with HTTP 201.
3. THE API_Server SHALL expose a `PUT /api/sermons/:id` Protected_Route that updates the Sermon with the given `id` and returns the updated document.
4. THE API_Server SHALL expose a `DELETE /api/sermons/:id` Protected_Route that deletes the Sermon with the given `id` and returns HTTP 204.
5. IF a `PUT` or `DELETE` request targets a Sermon `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Sermon not found" }`.
6. WHEN the Frontend mounts, THE AppContext SHALL fetch all Sermons from `GET /api/sermons` and store the result in the `sermons` state.

---

### Requirement 8: Prayer Requests API

**User Story:** As a Visitor, I want to submit a prayer request, and as an Admin, I want to manage prayer request visibility and status, so that the community can pray together in an orderly and moderated way.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/prayers` Public_Route that returns only Prayer_Request documents with status `"Approved"` or `"Praise Report"`, sorted by date descending.
2. THE API_Server SHALL expose a `GET /api/prayers/all` Protected_Route that returns all Prayer_Request documents including those with status `"Pending"` only when a valid Admin request is received, sorted by date descending.
3. THE API_Server SHALL expose a `POST /api/prayers` Public_Route that creates a new Prayer_Request with status `"Pending"` and returns the created document with HTTP 201.
4. THE API_Server SHALL expose a `PATCH /api/prayers/:id/pray` Public_Route that increments the `count` field of the Prayer_Request with the given `id` by 1 unconditionally on each call, and returns the updated document.
5. THE API_Server SHALL expose a `PATCH /api/prayers/:id/status` Protected_Route that updates the `status` and optional `answer` fields of the Prayer_Request with the given `id`.
6. THE API_Server SHALL expose a `DELETE /api/prayers/:id` Protected_Route that deletes the Prayer_Request with the given `id` and returns HTTP 204.
7. IF any request targets a Prayer_Request `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Prayer request not found" }`.
8. WHEN the Frontend mounts, THE AppContext SHALL fetch approved Prayer_Requests from `GET /api/prayers` and store the result in the `prayers` state.

---

### Requirement 9: Donations API

**User Story:** As a Visitor, I want to record a donation, and as an Admin, I want to view the full donation ledger and track fundraising progress, so that financial stewardship is transparent and traceable.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/donations/summary` Public_Route that returns the aggregate `totalRaised`, the configured `goal`, and the count of donations.
2. THE API_Server SHALL expose a `GET /api/donations` Protected_Route that returns all Donation documents sorted by date descending.
3. THE API_Server SHALL expose a `POST /api/donations` Public_Route that creates a new Donation record and returns the created document with HTTP 201.
4. WHEN a new Donation is created, THE API_Server SHALL accept `donorName`, `amount`, `campaign`, and `date` fields in the request body.
5. THE API_Server SHALL expose a `GET /api/donations/goal` Protected_Route that returns the current fundraising `goal` value.
6. THE API_Server SHALL expose a `PUT /api/donations/goal` Protected_Route that updates the fundraising `goal` value and returns the updated value.
7. WHEN the Frontend mounts, THE AppContext SHALL fetch the donations summary from `GET /api/donations/summary` and the full ledger from `GET /api/donations` in parallel; IF both calls succeed, THE AppContext SHALL update the `donations` state as `{ totalRaised, goal, ledger: [...] }`; IF one call fails, THE AppContext SHALL update the `donations` state with only the data from the successful call.

---

### Requirement 10: Projects API

**User Story:** As an Admin, I want to manage ministry projects through the API, so that Visitors can see the current, completed, and planned initiatives.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/projects` Public_Route that returns an array of all Project documents.
2. THE API_Server SHALL expose a `POST /api/projects` Protected_Route that creates a new Project and returns the created document with HTTP 201.
3. THE API_Server SHALL expose a `PUT /api/projects/:id` Protected_Route that updates the Project with the given `id` and returns the updated document.
4. THE API_Server SHALL expose a `DELETE /api/projects/:id` Protected_Route that deletes the Project with the given `id` and returns HTTP 204.
5. IF a `PUT` or `DELETE` request targets a Project `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Project not found" }`.
6. WHEN the Frontend mounts, THE AppContext SHALL fetch all Projects from `GET /api/projects` and store the result in the `projects` state.

---

### Requirement 11: Events API

**User Story:** As an Admin, I want to manage upcoming events through the API, so that Visitors are always informed about the latest ministry activities.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/events` Public_Route that returns an array of all Event documents sorted by date ascending.
2. THE API_Server SHALL expose a `POST /api/events` Protected_Route that creates a new Event and returns the created document with HTTP 201.
3. THE API_Server SHALL expose a `PUT /api/events/:id` Protected_Route that updates the Event with the given `id` and returns the updated document.
4. THE API_Server SHALL expose a `DELETE /api/events/:id` Protected_Route that deletes the Event with the given `id` and returns HTTP 204.
5. IF a `PUT` or `DELETE` request targets an Event `id` that does not exist, THEN THE API_Server SHALL respond with HTTP 404 and `{ "message": "Event not found" }`.
6. WHEN the Frontend mounts, THE AppContext SHALL fetch all Events from `GET /api/events` and store the result in the `events` state.

---

### Requirement 12: Stream State API

**User Story:** As an Admin, I want to control the live stream state through the API, so that the Live TV page accurately reflects whether a service is currently streaming.

#### Acceptance Criteria

1. THE API_Server SHALL expose a `GET /api/stream` Public_Route that returns the singleton Stream_State document containing `isLive`, `streamUrl`, and `streamTitle`.
2. THE API_Server SHALL expose a `PUT /api/stream` Protected_Route that updates the singleton Stream_State document and returns the updated document.
3. WHEN no Stream_State document exists in the database, THE API_Server SHALL return a default document with `isLive: false`, `streamUrl: ""`, and `streamTitle: ""` for `GET /api/stream`.
4. WHEN the Frontend mounts, THE AppContext SHALL fetch the Stream_State from `GET /api/stream` and store the result in the `streamState` state.

---

### Requirement 13: CORS Configuration

**User Story:** As a developer, I want the API server to allow requests from the React frontend origin, so that the browser does not block cross-origin API calls.

#### Acceptance Criteria

1. THE API_Server SHALL configure CORS to allow requests from the origin specified in the `FRONTEND_ORIGIN` environment variable so that the browser is not blocked from making cross-origin API calls.
2. THE API_Server SHALL allow the HTTP methods `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` in the CORS policy.
3. THE API_Server SHALL allow the `Content-Type` and `Authorization` headers in the CORS policy.
4. IF a request arrives from an origin not listed in the CORS policy, THEN THE API_Server SHALL respond with HTTP 403.
5. WHERE the application is run in development mode, THE API_Server SHALL also allow `http://localhost:5173` as a permitted origin.

---

### Requirement 14: Global Error Handling

**User Story:** As a developer, I want the API server to handle unexpected errors gracefully, so that the application never crashes and always returns a meaningful response.

#### Acceptance Criteria

1. THE API_Server SHALL include a global Express error-handling middleware registered after all routes.
2. WHEN an unhandled error reaches the global error handler, THE API_Server SHALL respond with HTTP 500 and `{ "message": "Internal server error" }`.
3. WHEN an unhandled error reaches the global error handler, THE API_Server SHALL log the full error stack trace to the server console.
4. IF a request is made to a route that does not exist, THEN THE API_Server SHALL always respond with HTTP 404 and `{ "message": "Route not found" }`, even if routing logic produces an error while handling the unmatched path.

---

### Requirement 15: Frontend API Client and Loading States

**User Story:** As a developer, I want a centralized API client in the Frontend and loading/error state tracking per domain, so that every page can show appropriate feedback while data loads or when requests fail.

#### Acceptance Criteria

1. THE Frontend SHALL include a centralized `apiClient` utility module that prefixes all requests with the `VITE_API_BASE_URL` environment variable.
2. THE apiClient SHALL automatically attach the `Authorization: Bearer <token>` header to all requests when a JWT is present in `localStorage`.
3. THE AppContext SHALL expose a `loading` state object with a boolean key per data domain (e.g., `loading.books`, `loading.sermons`) that is `true` while the initial fetch for that domain is in progress.
4. THE AppContext SHALL expose an `error` state object with a string-or-null key per data domain that captures any error message from a failed API call.
5. WHEN any mutating API call (POST, PUT, PATCH, DELETE) fails, THE AppContext SHALL update the corresponding `error` key with the server's error message.
6. WHEN any mutating API call succeeds, THE AppContext SHALL re-fetch the affected domain's data to keep local state in sync with the database.

---

### Requirement 16: Data Seeding

**User Story:** As a developer, I want a seed script that populates the database with the existing initial data from `AppContext.jsx`, so that the application is immediately usable after the first deployment without manual data entry.

#### Acceptance Criteria

1. THE API_Server SHALL include a standalone `seed.js` script that can be run with `node seed.js`.
2. WHEN `seed.js` is run against an empty database, THE API_Server SHALL insert the initial Books, Content Items, Gallery Photos, Gallery Videos, Sermons, Prayer Requests, Projects, and Events defined in the original `AppContext.jsx`.
3. WHEN `seed.js` is run against a database that already contains data, THE API_Server SHALL skip insertion for any collection that is non-empty, to prevent duplicate seeding.
4. WHEN `seed.js` completes, THE API_Server SHALL log a summary of which collections were seeded and which were skipped.
