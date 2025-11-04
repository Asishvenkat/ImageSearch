# Image Search & Multi-Select

Full-stack app for searching and saving Unsplash images with OAuth authentication.

## Features

- OAuth login (Google, GitHub, Facebook)
- Search Unsplash images with multi-select
- Save images to personal collection
- Search history tracking
- React + Vite frontend, Express backend, MongoDB

### Screenshots

| | |
|---:|:---|
| ![Screenshot 1](https://drive.google.com/uc?export=download&id=1bOVIjCArN8cA1NkSmXQMBC4ER0z97pp3) | ![Screenshot 2](https://drive.google.com/uc?export=download&id=1RDWt8ucHvRRagf_DF2TEPTD17sHC-szu) |
| ![Screenshot 3](https://drive.google.com/uc?export=download&id=10JA8wsmlW2F_d3BuIlBD6DnLPLS0E2CZ) | ![Screenshot 4](https://drive.google.com/uc?export=download&id=1vWK9odYN6lUNkVym2FXTJisqjnJ8ybmT) |
| ![Screenshot 5](https://drive.google.com/uc?export=download&id=13BQiJuxj3zS4cp0K0L5aejFu4mXWLDlc) | ![Screenshot 6](https://drive.google.com/uc?export=download&id=14bvuqprwCBV6Zx8xFwq3UFTr_Idftf3d) |

### Demo Video

🎥 [Watch demo video here](https://drive.google.com/file/d/1w3uBRfzOn94fN0ivLDVLnMzzbwv9gEEh/view?usp=drive_link)


## Setup Instructions

### Prerequisites

- Node.js v16+
- MongoDB Atlas account (or local MongoDB)
- Unsplash API account
- OAuth credentials (Google, GitHub, Facebook)

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

#### Environment Variables (.env)

Edit `server/.env` with your credentials:

```env
PORT=5000
SESSION_SECRET=your-random-secret-key-change-this
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Facebook OAuth (optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

#### How to Get API Keys

**Unsplash API:**
1. Go to https://unsplash.com/developers
2. Create a new application
3. Copy the "Access Key"

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → Create OAuth 2.0 Client ID
5. Set redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Secret

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Secret

**Facebook OAuth:**
1. Go to https://developers.facebook.com/
2. Create a new app
3. Add "Facebook Login" product
4. Set redirect URI: `http://localhost:5000/auth/facebook/callback`
5. Copy App ID and Secret

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for dev)
5. Get connection string from "Connect" → "Connect your application"

#### Start Backend

```bash
npm run dev
```

Server runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_BASE=http://localhost:5000
```

#### Start Frontend

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Screenshots & Demo

You can include screenshots and a short demo video in the repository so they render in this README. Recommended placement:

- images: `client/public/assets/screenshots/` (six files named `screenshot1.png` ... `screenshot6.png`)
- video: `client/public/assets/demo.mp4` (or host the video on YouTube and link it)

Example Markdown to embed screenshots (will render on GitHub when files exist):





## API Endpoints

### Authentication

#### Google OAuth Login
```bash
GET /auth/google
# Redirects to Google OAuth consent screen
```

**cURL Example:**
```bash
curl http://localhost:5000/auth/google
```

#### GitHub OAuth Login
```bash
GET /auth/github
# Redirects to GitHub OAuth consent screen
```

#### Facebook OAuth Login
```bash
GET /auth/facebook
# Redirects to Facebook OAuth consent screen
```

#### Logout
```bash
POST /auth/logout
# Destroys session and logs out user
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Cookie: connect.sid=your-session-cookie"
```

#### Get Current User
```bash
GET /api/user
# Returns authenticated user info
```

**cURL Example:**
```bash
curl http://localhost:5000/api/user \
  -H "Cookie: connect.sid=your-session-cookie"
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "displayName": "John Doe",
    "email": "john@example.com",
    "provider": "google"
  }
}
```

### Search

#### Search Images
```bash
GET /api/search?query=nature&page=1&perPage=20
# Search Unsplash images
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/search?query=nature&page=1&perPage=20" \
  -H "Cookie: connect.sid=your-session-cookie"
```

**Response:**
```json
{
  "results": [
    {
      "id": "abc123",
      "title": "Mountain Landscape",
      "url": "https://images.unsplash.com/...",
      "thumbnail": "https://images.unsplash.com/...?w=400",
      "author": "John Photographer",
      "downloadUrl": "https://unsplash.com/photos/abc123/download"
    }
  ],
  "total": 1000,
  "totalPages": 50
}
```

#### Get Top Searches
```bash
GET /api/top-searches?limit=5
# Get trending search terms
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/top-searches?limit=5"
```

**Response:**
```json
{
  "topSearches": [
    { "term": "nature", "count": 45 },
    { "term": "sunset", "count": 32 }
  ]
}
```

#### Get Search History
```bash
GET /api/search/history?limit=10
# Get user's search history
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/search/history?limit=10" \
  -H "Cookie: connect.sid=your-session-cookie"
```

**Response:**
```json
{
  "history": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "term": "mountains",
      "resultsCount": 150,
      "timestamp": "2025-11-04T10:30:00.000Z"
    }
  ]
}
```

### Saved Images

#### Get All Saved Images
```bash
GET /api/saved-images
# List all saved images for user
```

**cURL Example:**
```bash
curl http://localhost:5000/api/saved-images \
  -H "Cookie: connect.sid=your-session-cookie"
```

**Response:**
```json
{
  "images": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "imageId": "abc123",
      "title": "Mountain View",
      "url": "https://images.unsplash.com/...",
      "thumbnail": "https://images.unsplash.com/...?w=400",
      "author": "John Doe",
      "downloadUrl": "https://unsplash.com/photos/abc123/download",
      "savedAt": "2025-11-04T10:30:00.000Z"
    }
  ]
}
```

#### Save Single Image
```bash
POST /api/saved-images
Content-Type: application/json
# Save an image to collection
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/saved-images \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "imageId": "abc123",
    "title": "Mountain View",
    "url": "https://images.unsplash.com/photo-...",
    "thumbnail": "https://images.unsplash.com/photo-...?w=400",
    "author": "John Doe",
    "downloadUrl": "https://unsplash.com/photos/abc123/download"
  }'
```

**Response:**
```json
{
  "message": "Image saved successfully",
  "image": { ... }
}
```

#### Save Multiple Images (Batch)
```bash
POST /api/saved-images/batch
Content-Type: application/json
# Save multiple images at once
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/saved-images/batch \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "images": [
      {
        "imageId": "abc123",
        "title": "Mountain",
        "url": "https://images.unsplash.com/photo-abc",
        "thumbnail": "https://images.unsplash.com/photo-abc?w=400",
        "author": "John",
        "downloadUrl": "https://unsplash.com/photos/abc123/download"
      }
    ]
  }'
```

#### Delete Saved Image
```bash
DELETE /api/saved-images/:id
# Delete a saved image
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/saved-images/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=your-session-cookie"
```

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

## Postman Collection

You can import this collection into Postman for easy API testing:

```json
{
  "info": {
    "name": "Image Search API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/user"
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/logout"
          }
        }
      ]
    },
    {
      "name": "Search",
      "item": [
        {
          "name": "Search Images",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/search?query=nature&page=1&perPage=20",
              "query": [
                {"key": "query", "value": "nature"},
                {"key": "page", "value": "1"},
                {"key": "perPage", "value": "20"}
              ]
            }
          }
        },
        {
          "name": "Get Top Searches",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/top-searches?limit=5"
          }
        },
        {
          "name": "Get Search History",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/search/history?limit=10"
          }
        }
      ]
    },
    {
      "name": "Saved Images",
      "item": [
        {
          "name": "Get All Saved Images",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/saved-images"
          }
        },
        {
          "name": "Save Single Image",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"imageId\":\"abc123\",\"title\":\"Mountain\",\"url\":\"https://images.unsplash.com/photo-...\",\"thumbnail\":\"https://images.unsplash.com/photo-...?w=400\",\"author\":\"John\",\"downloadUrl\":\"https://unsplash.com/photos/abc123/download\"}"
            },
            "url": "{{baseUrl}}/api/saved-images"
          }
        },
        {
          "name": "Delete Saved Image",
          "request": {
            "method": "DELETE",
            "url": "{{baseUrl}}/api/saved-images/:id"
          }
        }
      ]
    }
  ]
}
```

## Project Structure

```
image-search-multi-select/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Header.jsx          # Navigation with auth status
│   │   │   ├── LoginButtons.jsx    # OAuth login buttons
│   │   │   ├── TopSearches.jsx     # Trending searches widget
│   │   │   └── UserSearchHistory.jsx # Search history preview
│   │   ├── pages/                  # Page-level components
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── LoginPage.jsx       # OAuth login page
│   │   │   ├── SearchPage.jsx      # Main search interface
│   │   │   ├── SavedImagesPage.jsx # Saved images collection
│   │   │   └── SearchHistoryPage.jsx # Full search history
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML entry (Tailwind CDN)
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── .env                        # Frontend environment vars
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   │   ├── database.js         # MongoDB connection
│   │   │   └── passport.js         # OAuth strategies
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── SearchHistory.js    # Search history model
│   │   │   └── SavedImage.js       # Saved images model
│   │   ├── routes/                 # API route handlers
│   │   │   ├── auth.js             # OAuth authentication
│   │   │   └── search.js           # Search & saved images
│   │   └── index.js                # Express server entry
│   ├── package.json                # Backend dependencies
│   ├── .env.example                # Environment template
│   └── .env                        # Backend environment vars
│
├── README.md                        # This file
└── package.json                     # Root package (scripts)
```

### Key Directories Explained

- **client/src/components/** - Reusable React components (Header, Login, Search widgets)
- **client/src/pages/** - Full page components (Home, Search, Saved, History)
- **server/src/config/** - Database and authentication configuration
- **server/src/models/** - MongoDB data models using Mongoose
- **server/src/routes/** - API endpoints and route handlers

## Tech Stack

- React 18, Vite, Tailwind CSS
- Node.js, Express, Passport.js
- MongoDB, Mongoose
- Unsplash API, OAuth 2.0

## License

Educational / Sample Code







Notes & tips:

- If you prefer to keep the repo small, upload the demo to YouTube (or Vimeo) and replace the local `<video>` source with the public URL or an iframe embed.
- On GitHub the `client/public` folder is served as static files when deployed — using that path makes local previews work in many setups. When previewing locally in Vite, copying assets to `public/` is the simplest.
- After adding/modifying files in `client/public/assets/`, commit them and refresh GitHub to see the images render in the README.

If you want, I can create the `client/public/assets/screenshots/` folder and add placeholder images and a placeholder video link for you to replace with real media. Tell me whether you want placeholders created or if you'll add your own files.
