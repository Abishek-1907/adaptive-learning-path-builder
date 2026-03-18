# Adaptive Learning Path Builder

A full-stack web application that allows curriculum designers to create adaptive learning paths by arranging content nodes on a canvas and defining conditional progression logic between them.

---

## Screenshots

> See `/screenshots` folder for test execution evidence and app screenshots.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17, TypeScript, SCSS |
| Backend | Java 21, Spring Boot 3.2 |
| Database | H2 (in-memory) |
| Build Tools | Maven, Angular CLI |
| Testing | Karma, Jasmine (Frontend) · Spring Boot Test, MockMvc (Backend) |

---

## Project Structure
```
adaptive-learning-path-builder/
|── adaptive-learning-ui/
│   ├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── toolbar/          # Top navigation bar
│   │   │   ├── left-panel/       # Draggable component list
│   │   │   ├── canvas/           # Main builder canvas
│   │   │   └── properties-panel/ # Node/edge property editor
│   │   ├── models/               # TypeScript interfaces
│   │   └── services/             # API service layer
│   ├── styles.scss               # Global styles
│   └── main.ts
├── learningbuilder/                      # Spring Boot Backend
│   ├── src/main/java/com/adaptive/learningpath/
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business logic + seeding
│   │   ├── model/                # JPA entities
│   │   ├── repository/           # Spring Data repositories
│   │   ├── dto/                  # Data transfer objects
│   │   └── config/               # CORS configuration
│   └── pom.xml
├── screenshots/                  # Test evidence & app screenshots
└── README.md
```

---

## Running Locally

### Prerequisites

- Java 21+
- Maven 3.8+
- Node.js 18+
- Angular CLI 17+
- Chrome browser (for frontend tests)

---

### Backend Setup
```bash
# Navigate to backend folder
cd backend

# Run the Spring Boot application
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

H2 Database Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:learningpathdb`
- Username: `sa`
- Password: *(leave blank)*

> **Note:** The backend automatically seeds 12 sample components on first startup.

---

### Frontend Setup
```bash
# Navigate to frontend folder (or project root if no subfolder)
cd adaptive-learning-ui

# Install dependencies
npm install

# Start the development server
ng serve
```

Frontend runs at: `http://localhost:4200`

> Make sure the backend is running before starting the frontend.

---

## API Endpoints

| Method | Endpoint | Description | Schema |
|--------|----------|-------------|--------|
| `GET` | `/api/components` | Get all available components for left panel | `available-content.schema.json` |
| `POST` | `/api/learning-paths` | Save a learning path | `learning-path.schema.json` |
| `GET` | `/api/learning-paths` | List all saved learning paths | - |
| `GET` | `/api/learning-paths/{id}` | Load a specific learning path | `learning-path.schema.json` |
| `DELETE` | `/api/learning-paths/{id}` | Delete a learning path | - |

---

## Features

### Left Panel
- Loads 12 seeded components from the backend API
- Displays title, description, type badge, and duration
- Search by title or description
- Filter by type: All / Units / Assessments
- Drag components onto the canvas

### Canvas Builder
- Drag and drop components from the left panel
- Reposition nodes by dragging
- Start and End nodes pre-placed by default
- Zoom in/out and pan the canvas
- Dot-grid background for visual alignment

### Flow Connections
- Draw directed connections between nodes using the `+` button
- Supports linear and branching flows
- Visual arrows with color coding:
  - 🔵 Blue — selected edge
  - 🟢 Green — default path
  - 🟣 Purple — edge with rules
  - ⚫ Gray — plain connection

### Conditional Logic
- Click any connection to open condition editor
- **Assessment conditions**: completion, passed, score, score_range
- **Unit conditions**: completion, time_spent_minutes, percentage_completion
- Operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `between`
- AND / OR condition grouping
- Multiple rules per connection

### Properties Panel
- Click a node → edit label, description, duration, assessment config
- Click an edge → edit conditions, label, priority, default path toggle
- Delete nodes and edges

### Save & Reload
- Save as Draft or Publish
- Load previously saved paths from the folder icon
- All node positions, labels, and rules are persisted

---

## Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

Expected output:
```
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Frontend Tests
```bash
ng test
```

A Chrome window opens and runs all specs. Expected output:
```
Executed 16 specs, 0 failures
```

> See `/screenshots` folder for test execution evidence.

---

## Seed Data

The backend seeds the following 12 components automatically on startup:

| ID | Title | Type | Duration |
|----|-------|------|----------|
| cmp-assess-math-1 | Math Module 1 Assessment | assessment | 35 min |
| cmp-unit-math-2-easy | Math Module 2 - Easy | unit | 35 min |
| cmp-unit-math-2-adv | Math Module 2 - Advanced | unit | 40 min |
| cmp-assess-math-end | Math Completion Assessment | assessment | 45 min |
| cmp-unit-rc-1 | Reading & Comp Module 1 | unit | 32 min |
| cmp-assess-rc-1 | Reading Module 1 Assessment | assessment | 30 min |
| cmp-unit-rc-2-easy | R&C Module 2 - Easy | unit | 32 min |
| cmp-unit-rc-2-adv | R&C Module 2 - Advanced | unit | 32 min |
| cmp-unit-writing-1 | Writing Fundamentals | unit | 45 min |
| cmp-assess-writing-1 | Writing Assessment | assessment | 50 min |
| cmp-unit-science-1 | Science Module 1 | unit | 40 min |
| cmp-assess-final | Final Comprehensive Assessment | assessment | 60 min |

---

## Libraries Used

### Frontend
| Library | Purpose |
|---------|---------|
| `uuid` | Generating unique node and edge IDs |
| Angular CDK | Layout utilities |

### Backend
| Library | Purpose |
|---------|---------|
| Spring Boot Web | REST API |
| Spring Data JPA | Data persistence |
| H2 Database | Embedded in-memory database |
| Lombok | Reducing boilerplate code |
| Jackson | JSON serialization/deserialization |

---

## Submission Checklist

| # | Item | Details |
|---|------|---------|
| 1 | **Repository link** | https://github.com/YOUR_USERNAME/adaptive-learning-path-builder |
| 2 | **Time spent** | ~8 hours |
| 3 | **Assumptions & Tradeoffs** | See below |
| 4 | **Setup instructions** | See Running Locally section above |
| 5 | **Test execution evidence** | See /screenshots folder |

---

## Assumptions & Tradeoffs

- **H2 in-memory database** — Used for simplicity and zero configuration. Data persists during the session but resets on restart. Can be swapped for PostgreSQL or MySQL by changing `application.properties`.
- **JSON payload storage** — The full learning path (nodes + edges) is stored as a single JSON column for flexibility, avoiding complex relational joins for graph data.
- **Native DOM drag events** — Used native `addEventListener` in `ngAfterViewInit` instead of Angular template bindings for reliable cross-browser drag-and-drop support.
- **Standalone Angular components** — Used Angular 17 standalone component architecture throughout, avoiding NgModule boilerplate.
- **No authentication** — Authentication was not in scope for this assessment.
- **Canvas rendering** — Built with pure CSS/SVG instead of a graph library (e.g. D3, React Flow) to demonstrate custom implementation capability.