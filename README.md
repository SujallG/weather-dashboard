Multi-User Weather Dashboard - Full-Stack Engineering Assessment
📹 Application Walkthrough
https://drive.google.com/file/d/1XP_t6LGjwx9ZdUKjXunmv1IBI6lc3nTb/view?usp=sharing

📂 GitHub Repository
https://github.com/SujallG/weather-dashboard

📋 Project Overview
A production-ready weather dashboard where users can register, add multiple cities, and view current weather with 5-day forecasts. Built with security, scalability, and clean architecture.

Core Features Implemented
✅ User authentication (JWT-based login/register)

✅ Multi-city dashboard (add/remove cities)

✅ Current weather display with icons

✅ 5-day weather forecasts

✅ Complete data isolation between users

✅ Responsive design for all devices

✅ Production-grade error handling

✅ Rate limiting and security headers

🛠 Tech Stack & Justification
Chosen Stack
Layer	Technology	Why
Frontend	React (CRA) + CSS3	Simpler than Next.js for dashboards; faster development
Backend	Node.js + Express	Lightweight, scalable, proven in production
Database	MongoDB + Mongoose	Flexible schema, easy to scale
Authentication	JWT + Bcrypt	Stateless, secure, production-tested
Weather API	Open-Meteo	Truly free, no API key required, accurate
Deployment	Render.com	Simple deployment, auto HTTPS
Why Not Next.js/Tailwind?
Next.js overkill for a dashboard - CSR is sufficient

Tailwind adds complexity - vanilla CSS is easier to debug

Trade-off: Lost SSR (not needed) but gained simpler development

Key Design Decisions
JWT Authentication: Stateless, scalable across servers

Repository Pattern: Clean separation of data access

Middleware-based Security: Centralized auth, rate limiting

Data Isolation: Every query includes userId filter

🔐 Authentication & Authorization
JWT Access Tokens: 15-minute expiry

Refresh Tokens: 7-day expiry (HTTP-only cookies)

Password Hashing: bcrypt with 12 rounds

Security: Helmet, CORS, rate limiting, input validation

💾 Database Schema
User Collection
javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  preferences: { temperatureUnit, theme }
}
City Collection
javascript
{
  userId: ObjectId (ref: User),
  name: String,
  country: String,
  latitude: Number,
  longitude: Number,
  displayOrder: Number
}
Indexes
email: Unique on users

userId + name: Unique on cities

userId + displayOrder: For sorting

🚀 Deployment (Render.com)
Environment Variables
Backend

bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key
CLIENT_URL=https://your-frontend.onrender.com
WEATHER_API_URL=https://api.open-meteo.com/v1
Frontend

bash
REACT_APP_API_URL=https://your-api.onrender.com/api
📦 Local Setup
Prerequisites
Node.js v18+

MongoDB (local or Atlas)

Backend
bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard/backend
npm install
cp .env.example .env
npm run dev  # Runs on http://localhost:3000
Frontend
bash
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
npm start  # Runs on http://localhost:3001
🧪 Testing the App
Register a new account

Login with credentials

Search for cities (London, New York, Tokyo)

Add cities to dashboard

View current weather and 5-day forecast

Remove cities

Logout and login again (data persists)

🔒 Security Checklist
✅ Password hashing (bcrypt, 12 rounds)

✅ JWT tokens with short expiry

✅ HTTP-only refresh tokens

✅ Input validation on all endpoints

✅ Rate limiting (100 requests/15 min)

✅ CORS with whitelisted origins

✅ Helmet.js security headers

✅ Environment variables for secrets

✅ MongoDB injection prevention

✅ Complete data isolation between users

📈 Performance Optimizations
Frontend
React Query for caching (5-min stale time)

Debounced city search (500ms)

Memoized components

Lazy loading where applicable

Backend
Database indexes on frequent queries

Connection pooling

Rate limiting per IP

Gzip compression

🎯 What We Built vs Requirements
Requirement	Status
User Authentication	✅ Complete
Multi-city Dashboard	✅ Complete
Current Weather	✅ Complete
5-Day Forecast	✅ Complete
Data Persistence	✅ Complete
API Failure Handling	✅ Complete
Security Best Practices	✅ Complete
Responsive UI	✅ Complete
Production-ready Code	✅ Complete
Favorites Functionality	❌ Not implemented
AI Integration	❌ Not implemented
Creative Custom Feature	❌ Not implemented
📊 API Endpoints
Auth
POST /api/auth/register - Create account

POST /api/auth/login - Login

POST /api/auth/refresh-token - Refresh JWT

POST /api/auth/logout - Logout

Users
GET /api/users/profile - Get profile

PUT /api/users/preferences - Update preferences

Weather
GET /api/weather/my-weather - Get user's cities weather

POST /api/weather/cities - Add city

DELETE /api/weather/cities/:cityId - Remove city

GET /api/weather/search?query=city - Search cities

🔮 Future Improvements
Favorites - Mark and filter favorite cities

AI Integration - Weather insights and recommendations

Weather Alerts - Notify of significant changes

Real-time Updates - WebSocket connections

Mobile Apps - React Native versions

🧠 Design Decisions & Trade-offs
Decision	Why	Trade-off
React (not Next.js)	Simpler for dashboard	No SSR
CSS (not Tailwind)	Easier debugging	More manual work
Open-Meteo API	No API key needed	Less documentation
JWT (not sessions)	Stateless scaling	Can't invalidate easily
Repository Pattern	Clean code	More boilerplate
📄 License
MIT © SUJAL GARG

🙏 Acknowledgments
Open-Meteo for free weather API

MongoDB Atlas for database hosting

Render.com for easy deployment