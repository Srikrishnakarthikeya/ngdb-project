# NIT Trichy Event Management System – Complete Project Overview

This project is a React + Vite web application. It is not connected to a real backend database or a production API. Instead, it uses React state + localStorage for persistence and a temporary in-memory mock API for wallet top-up flows.

## 1) What technology is used?

- Frontend framework: React
- Build tool: Vite
- Routing: react-router-dom
- UI styling: custom CSS + Tailwind classes
- State management: React Context API
- Persistence: browser localStorage
- Temporary API relay: custom Vite dev-server middleware (defined in `vite.config.js`)

Key evidence:
- `package.json` contains `react`, `react-dom`, `react-router-dom`, and `vite`
- `src/main.jsx` wraps the app in `BrowserRouter`
- `src/context/DataContext.jsx` loads and saves project data to `localStorage`

---

## 2) High-level website flow

The application is organized into three major user areas:

1. Public portal
   - Home page
   - Event listing and event detail pages
   - About, Contact, signup/login pages
   - Event payment flow

2. Student portal
   - Dashboard
   - Wallet
   - My registrations
   - Accommodation requests
   - Hospitality info
   - Certificates
   - Feedback
   - Gallery

3. Admin / coordinator portal
   - Dashboard with metrics and status cards
   - Event management
   - Department / venue / coordinator management
   - Registration management
   - Sponsorship/publicity management
   - Accommodation and hospitality management
   - Evaluations and certificates
   - Analytics and final reports

### Application route structure

From `src/App.jsx` the site is structured like this:

#### Public routes
- `/` → Home page
- `/events` → Public events list
- `/events/:id` → Event detail page
- `/events/:id/payment` → Event payment page
- `/gallery` → Public gallery
- `/about` → About page
- `/contact` → Contact page
- `/student-login` → Student login page
- `/wallet/confirm` → Wallet top-up confirmation page
- `/admin-login` → Admin/login page

#### Student portal routes
- `/student` → redirected to `/student/dashboard`
- `/student/dashboard` → student dashboard
- `/student/wallet` → wallet page
- `/student/events` → event list
- `/student/events/:id` → event detail
- `/student/events/:id/payment` → payment flow
- `/student/registrations` → my registrations
- `/student/profile` → student profile
- `/student/accommodation` → accommodation
- `/student/hospitality` → hospitality
- `/student/certificates` → certificates
- `/student/feedback` → feedback form
- `/student/gallery` → gallery

#### Admin routes
- `/admin` → redirected to `/admin/dashboard`
- `/admin/dashboard` → dashboard
- `/admin/analytics` → analytics
- `/admin/events` → manage events
- `/admin/events/new` → create event
- `/admin/departments` → departments
- `/admin/venues` → venues
- `/admin/coordinators` → coordinators
- `/admin/event-coordinators` → event-coordinator assignments
- `/admin/participants` → participants
- `/admin/registrations` → registrations
- `/admin/accommodation` → accommodation management
- `/admin/hospitality` → hospitality management
- `/admin/sponsors` → sponsor management
- `/admin/publicity` → publicity management
- `/admin/evaluations` → evaluations
- `/admin/certificates` → certificate management
- `/admin/reports` → completion reports
- `/admin/gallery` → photo gallery management

### Layout design

- `PublicLayout.jsx` → Navbar + Footer + main outlet
- `StudentLayout.jsx` → Sidebar + student portal header + outlet
- `AdminLayout.jsx` → Sidebar + admin/coordinator header + outlet

This shows that the website is designed as a segmented portal system, not a single page app with scattered components only.

---

## 3) Main models / ER-style entities in the project

The project includes a mock ER model that mirrors a relational database design. It is defined in `src/data/erModelInfo.js` and the corresponding sample data is loaded from `src/data/mockData.js`.

The model includes these 15 entities:

| Entity | Purpose |
|---|---|
| DEPARTMENT | Academic department and HOD metadata |
| EVENT | Core event record (type, date, venue, department, status) |
| VENUE | Auditorium/lab/seminar hall metadata |
| COORDINATOR | Faculty or staff members coordinating events |
| EVENT_COORDINATOR | Many-to-many mapping between events and coordinators |
| SPONSOR | Corporate funding records |
| PUBLICITY | Digital/physical publicity campaigns |
| PARTICIPANT | Student or delegate details |
| REGISTRATION | Event enrollments and payment status |
| ACCOMMODATION | Room allocation and stay details |
| HOSPITALITY | Meals and transport arrangements |
| EVALUATION | Feedback and ratings for events |
| CERTIFICATE | Certificates issued to participants |
| COMPLETION_REPORT | End-of-event summary and financial details |
| PHOTOGRAPH | Event photos linked to reports |

### Example model relationships

- Department organizes many events
- Event is held at one venue
- Event can have multiple coordinators
- Event can have many registrations and participants
- Participant can request accommodation and hospitality
- Event can generate certificates and completion reports
- Completion report can have multiple photographs

This is a strong sign the project was intentionally designed to mimic a real event-management database structure.

---

## 4) What data is stored in the website?

### A. Mock database-like data in `src/data/mockData.js`

This file contains the initial records for:

- departments
- venues
- coordinators
- events
- event coordinators
- sponsors
- publicity records
- participants
- registrations
- accommodations
- hospitality
- evaluations
- certificates
- completion reports
- photographs
- notifications

### B. Data context in `src/context/DataContext.jsx`

The `DataProvider` is the central source of data for the app. It:

- loads data from `localStorage`
- falls back to `INITIAL_*` values from `mockData.js`
- stores all major app data in React state
- exposes actions like `addEvent`, `registerForEvent`, `requestAccommodation`, `submitEvaluation`, `generateCertificate`, `saveCompletionReport`, etc.

### C. localStorage storage pattern

The app saves data under keys like:

- `nitt_ca_ems_departments`
- `nitt_ca_ems_events`
- `nitt_ca_ems_registrations`
- `nitt_ca_ems_accommodations`
- `nitt_ca_ems_walletBalances`
- etc.

This means the website behaves like a front-end prototype with persistent browser storage, not a backend database.

### D. Auth persistence

`src/context/AuthContext.jsx` stores:

- current logged-in user
- registered students
- admin/coordinator demo credentials

It saves them to localStorage with keys such as:

- `nitt_ca_auth_user`
- `nitt_ca_registered_students`

### E. Wallet flow special case

`src/pages/student/StudentWalletPage.jsx` creates a temporary wallet top-up request using a custom Vite middleware in `vite.config.js`.

This flow:

1. user enters amount
2. app calls `/api/wallet-top-ups`
3. server creates a pending request in an in-memory `Map`
4. QR is generated for confirmation
5. mobile confirmation triggers `confirm` endpoint
6. wallet balance is updated in app state

This is not a real payment gateway. It is a demo/mock payment flow.

---

## 5) The website’s main features

### Public features
- Home page with event discovery and campus highlights
- Event listing page
- Event detail with venue, date, description, status, sponsors, etc.
- About and Contact pages
- Student login and admin login
- Event payment flow
- QR-based wallet confirmation for demo payments

### Student features
- Student dashboard with wallet, registrations, certificates, and pending tasks
- Event registration and payment tracking
- Wallet balance management
- My registrations page
- Profile page
- Accommodation request and status tracking
- Hospitality request and meal details
- Certificates page
- Feedback submission
- Event gallery browsing

### Admin / coordinator features
- Dashboard with counts and metrics
- Create/update/delete events
- Add and manage department, venue, coordinator records
- Assign coordinators to events
- Manage participants and registrations
- Sponsor and publicity tracking
- Accommodation processing and hospitality management
- Evaluate events and store feedback
- Issue certificates
- Save completion reports and upload photos
- Analytics display

---

## 6) How the website is currently designed

The design is a classic multi-role portal prototype with these characteristics:

### Design style
- role-based navigation
- route gating by pages
- separate layouts for public, student, admin
- reusable common components such as Navbar, Sidebar, cards, modals, badges

### Architectural pattern
- `App.jsx` = route map
- `Layout` components = shell for each portal
- `Context` providers = state/data access
- `pages/*` = feature pages
- `data/mockData.js` = dataset
- `localStorage` = persistence layer

The app is effectively a front-end event management simulator rather than a production system backed by a database or auth server.

---

## 7) Important extra notes

### Real backend status
This project does not currently use:
- Express backend
- SQL database
- MongoDB or Firebase
- proper JWT auth server
- payment processor

### Demo data note
Large parts of the site are based on fictional but realistic NIT Trichy institutional data. The app intentionally demonstrates detailed event-management flows, not real campus data.

### Auth note
The app uses demo credentials such as:
- Student login example: `prasad45@gmail.com` / password `demoPass123`
- Admin login example: `admin@gmail.com` / password `adminPass123`
- Coordinator login example: `coordinator@example.com` / password `demoPass123`

These are stored and validated in the front-end context logic.

### Wallet and API note
The wallet top-up system is temporary and in-memory. It exists only during the Vite dev server runtime and is not persistent after server restart.

---

## 8) Final conclusion

This website is a React-based event-management portal prototype designed around a mock ER model and seeded data. It contains a complete event ecosystem: public lifecycle, student operations, and admin/coordinator management. The project is currently structured as a full frontend simulation with local state and localStorage persistence, not a complete production backend implementation.

It is definitely using React.

---

## 9) File references used

- `src/App.jsx`
- `src/main.jsx`
- `src/context/AuthContext.jsx`
- `src/context/DataContext.jsx`
- `src/context/ToastContext.jsx`
- `src/data/mockData.js`
- `src/data/erModelInfo.js`
- `src/data/accommodationPricing.js`
- `vite.config.js`
- `package.json`

If you want, I can also convert this into a more developer-focused architecture document with:
- component diagram,
- state flow diagram,
- role-based access map,
- database schema mapping,
- or a feature-by-feature page breakdown.
