# Enchanta

Full stack application built with FastAPI and React that lets users fetch Google reviews, generate a conversation, and create a 3D comic strip using the OpenAI API.

## Backend
- FastAPI with JWT authentication and double-hashed passwords stored in MongoDB
- Routes to fetch Google reviews, generate conversations and comic strips

### Running
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Environment variables:
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – secret key for JWT
- `GOOGLE_API_KEY` – Google Maps API key
- `OPENAI_API_KEY` – OpenAI API key


## Frontend
React application with a dark, responsive UI allowing login, review selection and comic display. A navigation bar with
icons provides quick access to Home, My Comics and Logout, and users are automatically logged out after five minutes of inactivity.
Generated comics appear as floating cards on the My Comics page, each offering a download button and tap-to-enlarge preview.

### Running
```
cd frontend
npm install
npm start
```
The React dev server proxies API requests to `http://localhost:8000`.
