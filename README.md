# Job Portal

## Project Overview
This is a full-stack web application that serves as a job application portal, allowing users to search and apply for various job profiles while showcasing their skillset. The platform caters to two main user roles: Job Applicants and Recruiters.

## Technology Stack
The application is built using the MERN stack:
- React.js: Frontend framework
- Express.js: Backend framework implementing REST APIs
- Node.js: Backend runtime
- MongoDB: Database

## Installation

These instructions will help you set up and run the project on your local machine.

### Prerequisites
Ensure you have the following installed on your local machine:
- Node.js
- React
- MongoDB

### Steps

1. Open the terminal in the backend and frontend folders separately.
2. Run the following command in each folder to install dependencies:
```
npm install
```

## Running the Server

### MongoDB Setup
1. In the backend folder, open the terminal.
2. Start the MongoDB shell:
```
mongosh
```
3. Run the server:
```
nodemon index.js
```
Keep the console open; the server runs as long as the console is open.

## Running the Frontend
1. In the frontend folder, open the terminal.
2. Start the React development server:
```
npm start
```

The web app will be accessible at localhost:3000.

Note: Ensure that the MongoDB service is running before starting the server.

## Usage
The application provides distinct features and workflows for Job Applicants and Recruiters.
  
### Job Applicants
- Registration and Login: Users can register and log in, providing necessary details.
- Profile Section: Users can manage their profiles, including education details, skills, and resume upload.
- Dashboard: View and search job listings with sorting and filtering options.
- Application Process: Apply for jobs, write a Statement of Purpose (SOP), and manage applications.
- My Applications: View a table of applications, including rejected applications.

### Recruiters
- Profile Section: Recruiters can manage their profiles, including contact details and a brief bio.
- Dashboard: Create and manage job listings, including editing and deleting options.
- Applications View: View applications for each job listing, shortlist or reject applicants.
- Employees Dashboard: View and rate accepted employees.

## Bonus Features
- Resume and Profile Image Upload: Applicants can upload their resume and profile image.
- Filter Section: A filter section provides options for job type, salary range, and duration.
