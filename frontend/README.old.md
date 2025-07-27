HMIS Frontend
Hospital Management Information System frontend built with ReactJS and Redux Toolkit.
Setup

Clone the repository:git clone https://github.com/<your-username>/hmis-frontend.git
cd hmis-frontend

Install dependencies:npm install

Configure environment:
Create .env:REACT_APP_API_URL=https://<your-heroku-app>.herokuapp.com/api

Run the app:npm start

Testing

Run Jest: npm test

Deployment

Deployed on Heroku: <your-heroku-app>-frontend.herokuapp.com.
Push to main to trigger GitHub Actions deployment.

Features

User login/register with role-based access.
Patient management (add, view, update, search).
Appointment scheduling and doctor availability.
Medical records and billing.