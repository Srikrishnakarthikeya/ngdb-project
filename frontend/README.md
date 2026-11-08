# Department of CA Event Management System – NIT Trichy

A modern, institutional, responsive web application for managing academic, technical, cultural, and departmental events at the **Department of Computer Applications, National Institute of Technology, Tiruchirappalli (NIT Trichy)**.

Built strictly according to the relational database design and Entity-Relationship (ER) model encompassing all **15 relational database entities**.

---

## 🌟 Key Highlights & Design Principles

- **NIT Trichy Institutional Aesthetics:** Deep academic navy (`#0B192C` / `#0F2744`), clean slate backgrounds, crisp serif titles for certificates, gold accents, status badges, and responsive modern layouts.
- **Strict 1:1 ER Model Implementation:** Every single entity, primary key, foreign key, and relational cardinality from the attached ER diagram is implemented and interactively accessible in the application.
- **Student, Administrator, and Coordinator Experiences:**
  - **Student / Participant Portal:** Event discovery, multi-category registration with instant ID generation, registration receipts, hostel accommodation requests, dining passes, verified certificates with printable PDF preview, and multi-criteria feedback.
  - **Admin Console:** Dashboard, event CRUD, venue and department management, participant and registration management, sponsor tracking, publicity, accommodation, hospitality, reports, certificates, and photo archive.
  - **Coordinator Portal:** Staff access for event coordination and assigned operational workflows.
- **Embedded ER Model & Schema Explorer:** Interactive modal and dedicated explorer page displaying the high-res ER diagram alongside schema definitions and relational mapping matrices.
- **9 Comprehensive Analytics Charts:** Events by month, registrations by event, attendee categories, department events, payment distribution, hostel allocations, evaluation ratings, sponsorship funds, and publicity impressions.

---

## 🛠️ Technology Stack

- **Frontend:** React.js 18 + Vite 5
- **Styling:** Tailwind CSS 3 (Custom academic palette) + PostCSS
- **Routing:** React Router DOM 6 (Nested layouts, public/student/admin routes)
- **Icons:** Lucide React
- **Typography:** Inter & Google Fonts (Cinzel / Serif for official certificates)
- **Backend Readiness:** Modular services, relational mock database engine, and localStorage synchronization ready for Spring Boot + PostgreSQL/MySQL API integration.

---

## 🗄️ Database Mapping: 15 ER Diagram Entities

| # | ER Diagram Entity | Primary Key (PK) | Foreign Keys (FK) | Relational Cardinality | Web Application Module & Route |
|---|---|---|---|---|---|
| 1 | **DEPARTMENT** | `Dept_ID` | — | `1 : M` with `EVENT` | `/admin/departments` - Department Management |
| 2 | **EVENT** | `Event_ID` | `Dept_ID`, `Venue_ID` | Core entity | `/admin/events`, `/events`, `/student/events` |
| 3 | **VENUE** | `Venue_ID` | — | `EVENT M : 1 VENUE` | `/admin/venues` - Venue Availability & Bookings |
| 4 | **COORDINATOR** | `Coordinator_ID` | — | `M : N` with `EVENT` | `/admin/coordinators` - Faculty Coordinators |
| 5 | **EVENT_COORDINATOR** | `(Event_ID, Coordinator_ID)` | `Event_ID`, `Coordinator_ID` | Associative Entity | `/admin/event-coordinators` - Role Assignments |
| 6 | **SPONSOR** | `Sponsor_ID` | `Event_ID` | `EVENT M : N SPONSOR` | `/admin/sponsors` - Corporate Partnerships |
| 7 | **PUBLICITY** | `Ad_ID` | `Event_ID` | `EVENT 1 : M PUBLICITY` | `/admin/publicity` - Media & Campaign Reach |
| 8 | **PARTICIPANT** | `Participant_ID` | — | `M : N` with `EVENT` | `/admin/participants`, `/student/profile` |
| 9 | **REGISTRATION** | `Registration_ID` | `Participant_ID`, `Event_ID` | Associative Entity | `/admin/registrations`, `/student/registrations` |
| 10 | **ACCOMMODATION** | `Accommodation_ID` | `Participant_ID` | `PARTICIPANT 1 : M ACCOMMODATION` | `/admin/accommodation`, `/student/accommodation` |
| 11 | **HOSPITALITY** | `Hospitality_ID` | `Participant_ID`, `Event_ID` | `EVENT 1 : M`, `PARTICIPANT 1 : M` | `/admin/hospitality`, `/student/hospitality` |
| 12 | **EVALUATION** | `Evaluation_ID` | `Participant_ID`, `Event_ID`, `Evaluator_ID` | `PARTICIPANT M : N EVENT` | `/admin/evaluations`, `/student/feedback` |
| 13 | **CERTIFICATE** | `Certificate_ID` | `Participant_ID`, `Event_ID` | `Awarded M : N` | `/admin/certificates`, `/student/certificates` |
| 14 | **COMPLETION_REPORT** | `Report_ID` | `Event_ID`, `Prepared_By` | `EVENT 1 : 1 COMPLETION_REPORT` | `/admin/reports` - Formal Audit & Outcomes |
| 15 | **PHOTOGRAPH** | `Photo_ID` | `Report_ID` | `COMPLETION_REPORT 1 : M PHOTOGRAPH` | `/admin/gallery`, `/gallery`, `/student/gallery` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure **Node.js (v18+)** and **npm** are installed on your machine.

### 2. Start the Development Server
Run the following command from the project root:

```bash
npm run dev
```

The application will start immediately at:
```
http://localhost:3000
```

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 👥 Demo Logins for Viva Evaluation

Project demo credentials:

### 1. Student / Participant
- **URL:** `/student-login`
- **Email:** `abc@gmail.com` or `xyz@gmail.com`
- **Name:** abc (MCA 2nd Year)
- **Password:** `password123`

### 2. Administrator (Full Control)
- **URL:** `/admin-login`
- **Email:** `admin@gmail.com`
- **Name:** Admin
- **Password:** `adminPass123`

### 3. Faculty Coordinator
- **URL:** `/admin-login`
- **Email:** `coordinator@example.com`
- **Name:** Coordinator
- **Password:** `demoPass123`

---

## 🗺️ Application Routes

### Public Pages
- `/` — Institutional Landing Page (Hero, Stats, Upcoming Events, Categories, Why Use)
- `/events` — Search & Filter Event Discovery
- `/events/:id` — Event Details, Venue, Faculty Coordinators, and Registration
- `/gallery` — Event Photo Gallery linked to Completion Reports
- `/about` — Department History, Vision, Mission, and Academic Strengths
- `/contact` — Campus Secretariat Contacts & Inquiries
- `/student-login` — Student / Participant Sign-In
- `/admin-login` — Administrator / Coordinator Sign-In

### Student Portal (`/student/*`)
- `/student/dashboard` — Personal KPI Cards, Registered Events, Notifications
- `/student/events` — Event Discovery & Enrollment
- `/student/registrations` — Participation Records, Status Badges, Printable Receipt
- `/student/profile` — Participant Profile (`PARTICIPANT` entity)
- `/student/accommodation` — Hostel Room Requests & Status (`ACCOMMODATION` entity)
- `/student/hospitality` — Meal Passes & Campus Transit (`HOSPITALITY` entity)
- `/student/certificates` — Verifiable Digital Certificate Viewer with PDF Print (`CERTIFICATE` entity)
- `/student/feedback` — Multi-Star Criteria Ratings & Comments (`EVALUATION` entity)
- `/student/gallery` — Archived Event Media

### Admin & Staff Console (`/admin/*`)
- `/admin/dashboard` — 8 Primary Institutional KPIs & Recent Registration Queue
- `/admin/analytics` — 9 Analytical Visualizations & Date Filtering
- `/admin/events` — All Events Management & Creation Form (`EVENT` entity)
- `/admin/departments` — Department Management (`DEPARTMENT` entity)
- `/admin/venues` — Campus Venue Management & Availability (`VENUE` entity)
- `/admin/coordinators` — Faculty Coordinators (`COORDINATOR` entity)
- `/admin/event-coordinators` — Coordinator Assignments (`EVENT_COORDINATOR` entity)
- `/admin/participants` — Participant Roster & Filtering (`PARTICIPANT` entity)
- `/admin/registrations` — Fee Verification & Approval Actions (`REGISTRATION` entity)
- `/admin/sponsors` — Corporate Sponsorships & Contributions (`SPONSOR` entity)
- `/admin/publicity` — Campaigns & Impression Tracking (`PUBLICITY` entity)
- `/admin/accommodation` — Room Allocation & Hostel Check-In (`ACCOMMODATION` entity)
- `/admin/hospitality` — Catering & Transit Logistics (`HOSPITALITY` entity)
- `/admin/evaluations` — Rating Distributions & Feedback Audit (`EVALUATION` entity)
- `/admin/certificates` — Digital Certificate Issuance & Verification (`CERTIFICATE` entity)
- `/admin/reports` — Completion Outcome Reports (`COMPLETION_REPORT` entity)
- `/admin/gallery` — Photograph Archive Management (`PHOTOGRAPH` entity)

---

## 🏛️ Academic Institutional Integrity

Developed for the **Department of Computer Applications, National Institute of Technology, Tiruchirappalli (NIT Trichy)**.
Designed strictly to meet university project submission, demonstration, and viva requirements.
