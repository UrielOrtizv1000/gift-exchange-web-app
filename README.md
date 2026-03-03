# Gift Exchange Web App 🎁

## Overview
Gift Exchange Web App is a front-end web application designed to manage and automate a gift exchange event.  
The system allows users to register participants, define exclusions, configure event details, and perform a random draw while respecting all restrictions.

This project was developed strictly using front-end technologies as part of an academic assignment.

---

## 👥 Team Members
- Uriel Ezequiel Ortiz Rosales
- Oscar Iván Gómez Ruíz

---

## 🛠 Technologies Used
- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap and/or Tailwind CSS
- HTML5 Drag and Drop API
- LocalStorage API

---

## 🚀 Features

### Event Configuration
- Register the organizer (with option to participate or not)
- Add unlimited participants
- Define exclusions between participants
- Select event type or create a custom celebration name
- Choose event date
- Define gift budget (preset options or custom amount)

### Data Persistence
- All event information is stored in LocalStorage
- Event data is retrieved directly from LocalStorage (not from memory variables)
- Stored data includes:
  - Organizer information
  - Participants list
  - Exclusions
  - Event name and type
  - Date
  - Budget
  - Draw results

### Drag and Drop Implementation
- Drag and Drop functionality implemented with a clear purpose inside the system
- Used to dynamically manage participants and/or exclusions
- Built using the HTML5 Drag and Drop API

### Draw System
- Random gift assignment algorithm
- Prevents self-assignment
- Respects all defined exclusions
- Displays final results clearly (who gives a gift to whom)

### Responsive Design
- Fully responsive layout
- Implemented using Bootstrap or Tailwind Grid system
- Supports at least two breakpoints (mobile and desktop)

---

## 📂 Project Structure
gift-exchange-web-app/
│
├── index.html
├── assets/
│ ├── css/
│ ├── js/
│ └── img/
├── docs/
│ ├── Project_Report.pdf
│ └── Rubric.xlsx
└── README.md

---

## 📌 Academic Notes
- This project does NOT use any back-end technologies.
- All logic and persistence are handled on the client side.
- The application was developed for educational purposes only.

---

## 📄 License
This project was created for academic purposes.
