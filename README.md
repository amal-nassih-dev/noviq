# Noviq

**Noviq** is a modern project and task management application built with **Angular 19**. It provides a collaborative workspace where users can organize projects, manage team members, and track tasks through a Kanban-style workflow.

The application was designed with a focus on **clean architecture, reusable components, reactive state management, and a responsive user experience**.

## ✨ Features

* 🔐 **Authentication**

  * User registration and login
  * JWT-based authentication
  * Protected routes
  * Guest and authentication guards

* 🏢 **Organization Management**

  * Create and manage organizations
  * Manage organization members
  * Assign member roles
  * Organization-based access control

* 📁 **Project Management**

  * Create and manage projects
  * View projects within an organization
  * Project-specific task management

* ✅ **Task Management**

  * Create, update, and delete tasks
  * Task status and priority
  * Due dates
  * Kanban-style task workflow
  * Task positioning/order

* 🎨 **Modern UI**

  * Angular Material components
  * Responsive layout
  * Reusable UI components
  * Consistent design system
  * Form validation and error handling

* ⚡ **Reactive Architecture**

  * Angular Signals for application state
  * RxJS for asynchronous operations
  * Reactive forms
  * Service-based data management

## 🛠️ Tech Stack

| Technology           | Purpose                  |
| -------------------- | ------------------------ |
| **Angular 19**       | Frontend framework       |
| **TypeScript**       | Application development  |
| **Angular Material** | UI components            |
| **RxJS**             | Reactive programming     |
| **Angular Signals**  | State management         |
| **HTML / SCSS**      | UI structure and styling |
| **Jasmine / Karma**  | Unit testing             |

## 🏗️ Architecture

Noviq follows a feature-oriented Angular architecture designed to keep the application modular and maintainable.

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   └── ...
│   │
│   ├── feature/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── organizations/
│   │   ├── projects/
│   │   └── tasks/
│   │
│   └── app.routes.ts
│
├── assets/
└── styles.scss
```

### Core

Contains application-wide functionality such as authentication, guards, and shared services.

### Shared

Contains reusable UI components and utilities used across multiple features.

### Features

Application functionality is organized by domain, keeping authentication, organizations, projects, and tasks isolated and easier to maintain.

## 🔐 Authentication & Authorization

Noviq communicates with a backend REST API secured using **JWT authentication**.

The frontend handles:

1. User authentication
2. JWT token management
3. Protected routes
4. Guest-only routes
5. Organization-level access
6. API communication through Angular services

Example application flow:

```text
Register
   ↓
Login
   ↓
JWT Authentication
   ↓
Dashboard
   ↓
Organization
   ↓
Project
   ↓
Tasks
   ↓
Kanban Workflow
```

## 📊 Application Workflow

```text
User
 │
 ├── Register / Login
 │
 ▼
Organization
 │
 ├── Manage Members
 │
 ├── Create Projects
 │
 ▼
Project
 │
 └── Manage Tasks
       │
       ├── TODO
       ├── IN PROGRESS
       └── DONE ...
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Angular CLI

Check your versions:

```bash
node --version
npm --version
ng version
```

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd noviq
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Configure the backend API URL in the appropriate Angular environment configuration.

For example:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8081/api'
};
```

Make sure the backend API is running before starting the frontend.

### Start the Development Server

```bash
ng serve
```

Then open:

```text
http://localhost:4200
```

The application automatically reloads when source files are modified.

## 🏭 Production Build

Create a production build with:

```bash
ng build
```

The compiled application will be generated in:

```text
dist/
```

## 🧪 Testing

Run unit tests with:

```bash
ng test
```

For end-to-end testing:

```bash
ng e2e
```

> Angular CLI does not provide an E2E framework by default. An E2E testing framework can be added depending on the project's requirements.

## 🔗 Backend

Noviq is designed to work with a Spring Boot REST API providing:

* Authentication
* User management
* Organizations
* Organization members
* Projects
* Tasks

**Backend repository:** [`<backend-repository-url>`](https://github.com/amal-nassih-dev/noviq-backend)

## 🎯 Project Goals

The project was built to demonstrate practical experience developing a modern full-stack application, including:

* Component-based frontend architecture
* REST API integration
* Authentication and authorization
* Reactive state management
* Reusable UI components
* Form handling and validation
* Route protection
* Responsive UI development
* Separation of concerns

## 👩‍💻 Author

**Amal Nassih**

