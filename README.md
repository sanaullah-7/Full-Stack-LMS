<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=30&duration=3000&pause=1000&color=2563EB&center=true&vCenter=true&width=800&height=70&lines=Saylani+Bootcamp+Management+LMS;Centralized+Administration+System;Streamlined+Operations+%26+Logistics;Robust+MERN+Stack+Architecture" alt="Animated Typing Header" />
  </a>
  
  <br/>

  <a href="https://github.com/SMIT-Bootcamp/Saylani-Bootcamp-LMS0">
    <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github" alt="Build Status"/>
  </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  </a>
</div>

---

## 📌 Executive Overview

The **Saylani Bootcamp Management LMS** is a robust, single-role enterprise administration system engineered to consolidate the complex logistics of managing a large-scale bootcamp. 

By eliminating the overhead of multi-tier user hierarchies and focusing exclusively on administrative control, this system provides a highly performant, centralized command center. It empowers administrators to efficiently orchestrate student enrollment, track granular attendance data, allocate project teams, and monitor task progression in real-time.

---

## ⚙️ System Architecture

The application operates on a modern, decoupled **MERN** architecture, ensuring high scalability and maintainability.

<div align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="React" width="60" height="60" style="margin: 0 15px;" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node" width="60" height="60" style="margin: 0 15px;" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="Express" width="60" height="60" style="background: white; border-radius: 5px; padding: 5px; margin: 0 15px;" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB" width="60" height="60" style="margin: 0 15px;" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original-wordmark.svg" alt="Tailwind" width="60" height="60" style="margin: 0 15px;" />
</div>

<br/>

### 📂 Directory Structure

The codebase strictly adheres to the Controller-Service-Route (CSR) pattern for the backend API, and a modular component-based architecture for the client interface.

```text
Saylani-Bootcamp-LMS0/
├── Client/                      # Frontend Monolith (React.js + Vite)
│   ├── src/components/          # Modular, reusable UI rendering components
│   ├── src/pages/               # High-level route views (Dashboard, Attendance, Task, Team)
│   ├── src/styles/              # Tailwind CSS configuration and global styling
│   └── src/App.jsx              # React Router dom configuration
│
└── Server/                      # Backend API Services (Node.js + Express)
    ├── config/                  # Environment and database connection protocols
    ├── models/                  # Mongoose ODM schemas (Data layer)
    ├── controllers/             # HTTP request parsing and response formatting
    ├── services/                # Core business logic and database transactions
    └── routes/                  # RESTful API endpoint definitions
```

---

## 🛠️ Core Administrative Modules

### 1. Unified Authentication & Access Control
- **Secure Authentication:** Strict email and password validation ensuring unauthorized personnel cannot access bootcamp data.
- **Admin Dashboard:** Real-time summary analytics displaying total active students, daily attendance metrics, active teams, and pending operational tasks.

### 2. Comprehensive Student Records Management
- **Unique Identification:** Automated enforcement of 6-digit unique Roll Numbers for secure record keeping.
- **Lifecycle Operations:** Full CRUD capabilities for managing student metadata (Course, Batch, Team Allocation).
- **Consolidated Profiles:** A master view aggregating a student’s entire history—attendance records, completed tasks, and project team integration.

### 3. Precision Attendance Tracking
- **Rapid Entry System:** Fast-action attendance marking optimized for daily use via Roll Number lookup.
- **Granular Statuses:** Tracks exact availability (Present, Absent, Leave).
- **Historical Reporting:** Dynamic filtering capabilities allowing administrators to audit attendance data on a daily, weekly, or monthly cadence.

### 4. Operational Task Orchestration
- **Task Lifecycle:** Assign, monitor, and transition tasks through explicit statuses (`Pending` ➡️ `In Progress` ➡️ `Completed`).
- **Student Workloads:** Track the individual velocity and task completion rates of students.

### 5. Team & Project Allocation
- **Squad Organization:** Group students into functional teams and assign comprehensive real-world projects.
- **Project Logistics:** Track deadlines, project descriptions, and milestone statuses across multiple teams simultaneously.

---

## 👥 The Engineering Team (Team A)

This enterprise application was built by **Team A** at SMIT Bootcamp under the expert guidance of our instructor.

| Name | Role | GitHub Profile |
| :--- | :--- | :--- |
| **Ibrahim Khan** | 👨‍🏫 Instructor / Teacher | [@Ibrahimkhan432](https://github.com/Ibrahimkhan432) |
| **Sana Ullah** | ⚙️ Team Lead & Backend Developer | [@sanaullah-7](https://github.com/sanaullah-7) |
| **Muhammad Junaid** | 💻 Full Stack Developer | [@DoctorJunaid](https://github.com/DoctorJunaid) |
| **Bahadar Ali** | 🎨 Frontend Developer | [@syedBahadarKhan](https://github.com/syedBahadarKhan) |
| **Shayan Ahmad** | 🎨 Frontend Developer | [@shayan368](https://github.com/shayan368) |
| **Idrees Ud Din** | 🎨 Frontend Developer | [@idreestech1](https://github.com/idreestech1) |
| **Faiz Ur Rehman** | 🎨 Frontend Developer | [@faizurrehman39804](https://github.com/faizurrehman39804) |

---

## 🔐 Out of Scope (By Design)

To ensure maximum operational stability and prevent scope creep, the following modules are intentionally excluded:
- ❌ End-user/Student login portals.
- ❌ Integrated chat or messaging channels.
- ❌ Gamification engines and public leaderboards.
- ❌ Third-party payment gateways.

## 💻 Development & Contribution Standards

- **Separation of Concerns:** Business logic MUST reside in the `services/` layer, keeping `controllers/` strictly for HTTP transport handling.
- **RESTful Compliance:** Ensure all routes utilize correct HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- **Validation Constraints:** All inputs must be sanitized and validated at both the client layer (React) and the database layer (Mongoose validations).

<br/>
<div align="center">
  <i>Engineered for Operational Excellence by Team A.</i>
</div>
