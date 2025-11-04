# Image Search & Multi-Select Application

A full-stack web application for searching, selecting, and managing images from Unsplash with OAuth authentication, search history tracking, and personalized collections.

## 🚀 Features

- **OAuth Authentication** - Login via Google, GitHub, and Facebook
- **Image Search** - Search millions of high-quality images from Unsplash
- **Multi-Select** - Select multiple images and save them to your collection
- **Search History** - Track all your searches with timestamps and result counts
- **Saved Images** - Manage your saved image collection
- **Top Searches** - View trending search terms
- **Responsive Design** - Professional UI with Tailwind CSS and Lucide icons

## 📁 Project Structure

```
image-search-multi-select/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Header.jsx      # Navigation header with auth status
│   │   │   ├── LoginButtons.jsx # OAuth login buttons
│   │   │   ├── TopSearches.jsx  # Trending searches widget
│   │   │   └── UserSearchHistory.jsx # Search history preview
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.jsx    # Landing page
│   │   │   ├── LoginPage.jsx   # OAuth login page
│   │   │   ├── SearchPage.jsx  # Main search interface
│   │   │   ├── SavedImagesPage.jsx # Saved images collection
│   │   │   └── SearchHistoryPage.jsx # Full search history
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML entry (with Tailwind CDN)
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── server/                      # Node.js/Express Backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js     # MongoDB connection
│   │   │   └── passport.js     # Passport.js OAuth strategies
│   │   ├── models/             # Mongoose models
│   │   │   ├── SearchHistory.js # Search history schema
│   │   │   └── SavedImage.js    # Saved images schema
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js         # OAuth authentication routes
│   │   │   ├── search.js       # Image search & history routes
│   │   │   └── savedImages.js  # Saved images CRUD routes
│   │   └── index.js            # Express server entry point
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variables template
│
└── README.md                    # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Unsplash API account
- OAuth credentials (Google, GitHub, Facebook)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd image-search-multi-select
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Server Configuration
PORT=5000
SESSION_SECRET=your-random-session-secret-key-here
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

#### How to Get API Keys

**Unsplash API:**
1. Go to [https://unsplash.com/developers](https://unsplash.com/developers)
2. Create a new application
3. Copy the "Access Key"

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → Create OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Client Secret

**Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Set Valid OAuth Redirect URIs: `http://localhost:5000/auth/facebook/callback`
5. Copy App ID and App Secret

**MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string from "Connect" → "Connect your application"

#### Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../client
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `client/` directory:

```bash
VITE_API_BASE=http://localhost:5000
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📡 API Endpoints

### Authentication Routes

#### Google OAuth Login
```bash
GET /auth/google
# Redirects to Google OAuth consent screen
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

#### Get Current User
```bash
GET /api/user
# Returns current authenticated user info

Response:
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "displayName": "John Doe",
    "email": "john@example.com",
    "provider": "google"
  }
}
```

### Image Search Routes

#### Search Images
```bash
GET /api/search?query=nature&page=1&perPage=20

Response:
{
  "results": [
    {
      "id": "abc123",
      "title": "Beautiful Mountain",
      "url": "https://images.unsplash.com/...",
      "thumbnail": "https://images.unsplash.com/...",
      "author": "John Photographer",
      "downloadUrl": "https://unsplash.com/photos/..."
    }
  ],
  "total": 1000,
  "totalPages": 50
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/search?query=nature&page=1&perPage=20" \
  -H "Cookie: connect.sid=your-session-cookie"
```

#### Get Top Searches
```bash
GET /api/top-searches?limit=5

Response:
{
  "topSearches": [
    {
      "term": "nature",
      "count": 45
    },
    {
      "term": "sunset",
      "count": 32
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/top-searches?limit=5"
```

#### Get Search History
```bash
GET /api/search/history?limit=10

Response:
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

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/search/history?limit=10" \
  -H "Cookie: connect.sid=your-session-cookie"
```

### Saved Images Routes

#### Get All Saved Images
```bash
GET /api/saved-images

Response:
{
  "images": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "imageId": "abc123",
      "title": "Mountain View",
      "url": "https://images.unsplash.com/...",
      "thumbnail": "https://images.unsplash.com/...",
      "author": "John Doe",
      "downloadUrl": "https://unsplash.com/photos/...",
      "savedAt": "2025-11-04T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/saved-images" \
  -H "Cookie: connect.sid=your-session-cookie"
```

#### Save Single Image
```bash
POST /api/saved-images
Content-Type: application/json

{
  "imageId": "abc123",
  "title": "Mountain View",
  "url": "https://images.unsplash.com/...",
  "thumbnail": "https://images.unsplash.com/...",
  "author": "John Doe",
  "downloadUrl": "https://unsplash.com/photos/..."
}

Response:
{
  "message": "Image saved successfully",
  "image": { ... }
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/saved-images" \
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

#### Save Multiple Images (Batch)
```bash
POST /api/saved-images/batch
Content-Type: application/json

{
  "images": [
    {
      "imageId": "abc123",
      "title": "Mountain View",
      "url": "...",
      "thumbnail": "...",
      "author": "John Doe",
      "downloadUrl": "..."
    },
    {
      "imageId": "xyz789",
      "title": "Ocean Waves",
      "url": "...",
      "thumbnail": "...",
      "author": "Jane Smith",
      "downloadUrl": "..."
    }
  ]
}

Response:
{
  "message": "2 images saved successfully",
  "savedImages": [ ... ]
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/saved-images/batch" \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "images": [
      {
        "imageId": "abc123",
        "title": "Mountain View",
        "url": "https://images.unsplash.com/photo-abc",
        "thumbnail": "https://images.unsplash.com/photo-abc?w=400",
        "author": "John Doe",
        "downloadUrl": "https://unsplash.com/photos/abc123/download"
      }
    ]
  }'
```

#### Delete Saved Image
```bash
DELETE /api/saved-images/:id

Response:
{
  "message": "Image deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:5000/api/saved-images/507f1f77bcf86cd799439011" \
  -H "Cookie: connect.sid=your-session-cookie"
```

## 📮 Postman Collection

### Import Collection

1. Open Postman
2. Click "Import"
3. Create a new collection with these requests:

### Collection Structure

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
              "raw": "{\n  \"imageId\": \"abc123\",\n  \"title\": \"Mountain View\",\n  \"url\": \"https://images.unsplash.com/photo-...\",\n  \"thumbnail\": \"https://images.unsplash.com/photo-...?w=400\",\n  \"author\": \"John Doe\",\n  \"downloadUrl\": \"https://unsplash.com/photos/abc123/download\"\n}"
            },
            "url": "{{baseUrl}}/api/saved-images"
          }
        },
        {
          "name": "Save Multiple Images",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"images\": [\n    {\n      \"imageId\": \"abc123\",\n      \"title\": \"Mountain View\",\n      \"url\": \"https://images.unsplash.com/photo-...\",\n      \"thumbnail\": \"https://images.unsplash.com/photo-...?w=400\",\n      \"author\": \"John Doe\",\n      \"downloadUrl\": \"https://unsplash.com/photos/abc123/download\"\n    }\n  ]\n}"
            },
            "url": "{{baseUrl}}/api/saved-images/batch"
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

## 🔧 Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Lucide React** - Professional icon library
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### External APIs
- **Unsplash API** - Image search
- **Google OAuth 2.0** - Authentication
- **GitHub OAuth** - Authentication
- **Facebook OAuth** - Authentication

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy the `dist/` folder

3. Set environment variable:
```bash
VITE_API_BASE=https://your-backend-url.com
```

### Backend (Heroku/Railway)

1. Set all environment variables in your hosting platform

2. Ensure MongoDB Atlas IP whitelist includes your hosting provider's IPs

3. Update OAuth callback URLs to production URLs:
```
https://your-backend-url.com/auth/google/callback
https://your-backend-url.com/auth/github/callback
https://your-backend-url.com/auth/facebook/callback
```

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Developed as a full-stack image search application with OAuth authentication and collection management.

## 🤝 Support

For issues and questions, please open an issue in the repository.
- **Modern Design** — Purple gradient theme with smooth animations
- **Responsive Layout** — Works on desktop, tablet, and mobile
- **Loading States** — Skeleton screens and spinners
- **Error Handling** — User-friendly error messages
- **Empty States** — Helpful messages when no results found

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | 18.2.0 |
| | Vite | 5.0.0 |
| **Backend** | Node.js | Latest |
| | Express | 4.18.2 |
| | Passport.js | 0.6.0 |
| **Database** | MongoDB | Latest |
| | Mongoose | 8.0.3 |
| **APIs** | Unsplash | REST API v1 |
| **Auth** | Google OAuth 2.0 | - |
| | GitHub OAuth | - |
| | Facebook OAuth | - |
| **Dev Tools** | Concurrently | 8.2.0 |
| | Nodemon | 2.0.22 |

## 📁 Project Structure

```
image-search-multi-select/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   └── SearchPage.jsx       # Main search interface
│   │   ├── components/
│   │   │   ├── UserSearchHistory.jsx    # User's search history
│   │   │   ├── TopSearches.jsx          # Trending searches
│   │   │   ├── ImageGrid.jsx            # Image grid component
│   │   │   ├── LoginButtons.jsx         # OAuth login UI
│   │   │   ├── UserProfile.jsx          # User profile display
│   │   │   ├── SearchHistory.jsx        # Full history view
│   │   │   └── SearchStats.jsx          # Statistics dashboard
│   │   ├── examples/
│   │   │   └── OAuthExamples.jsx        # OAuth integration examples
│   │   ├── App.jsx                      # Original app layout
│   │   ├── OAuthDemo.jsx                # OAuth demo page
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js              # OAuth routes
│   │   │   └── search.js            # Search API endpoints
│   │   ├── models/
│   │   │   └── SearchHistory.js     # MongoDB schema
│   │   ├── config/
│   │   │   ├── passport.js          # Passport strategies
│   │   │   └── database.js          # MongoDB connection
│   │   └── index.js                 # Main Express app
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── README.md                        # This file
├── PROJECT_SUMMARY.md               # Complete project summary
├── SEARCH_PAGE_LAYOUT.md            # Visual layout guide
├── TESTING_GUIDE.md                 # Testing instructions
├── DEPLOYMENT_GUIDE.md              # Deployment guide
├── OAUTH_SETUP.md                   # OAuth credentials setup
├── OAUTH_FRONTEND_GUIDE.md          # Frontend OAuth integration
├── OAUTH_VISUAL_GUIDE.md            # OAuth flow diagrams
├── OAUTH_CHEATSHEET.txt             # Quick OAuth reference
├── SEARCH_API_SETUP.md              # API setup guide
├── SEARCH_API_QUICKREF.md           # API quick reference
└── package.json                     # Root package (scripts)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Atlas account)
- **Unsplash API Key** (free at [unsplash.com/developers](https://unsplash.com/developers))
- **OAuth Credentials** (optional, see [OAUTH_SETUP.md](OAUTH_SETUP.md))

### Installation

```powershell
# 1. Clone the repository
git clone <your-repo-url>
cd image-search-multi-select

# 2. Install dependencies for both client and server
npm run install-all

# 3. Setup environment variables (see next section)

# 4. Start both servers
npm run dev
```

The application will open at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## 🔧 Environment Setup

### Server Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-random-secret-key-change-this-in-production

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/image-search
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/image-search?retryWrites=true&w=majority

# Unsplash API (Required)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
# Get your key at: https://unsplash.com/developers

# OAuth - Google (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# OAuth - GitHub (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# OAuth - Facebook (Optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

# CORS (Production)
FRONTEND_URL=http://localhost:5173
# In production, change to your frontend domain:
# FRONTEND_URL=https://your-app.vercel.app
```

### Getting API Keys

#### Unsplash API (Required)
1. Go to https://unsplash.com/developers
2. Register as a developer
3. Create a new application
4. Copy the **Access Key**
5. Paste in `UNSPLASH_ACCESS_KEY`

#### MongoDB (Required)
**Option 1: Local MongoDB**
```powershell
# Install MongoDB: https://www.mongodb.com/try/download/community
# Start MongoDB
mongod --dbpath C:\data\db
```

**Option 2: MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0 Sandbox)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Paste in `MONGODB_URI`

#### OAuth Credentials (Optional)
See detailed setup in [OAUTH_SETUP.md](OAUTH_SETUP.md)

- **Google:** https://console.cloud.google.com/apis/credentials
- **GitHub:** https://github.com/settings/developers
- **Facebook:** https://developers.facebook.com/apps

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Initiate OAuth Login
```http
GET /auth/google
GET /auth/github
GET /auth/facebook
```
**Description:** Redirects to OAuth provider for authentication.  
**Response:** 302 Redirect to provider login page.

#### OAuth Callback
```http
GET /auth/google/callback?code=...
GET /auth/github/callback?code=...
GET /auth/facebook/callback?code=...
```
**Description:** Handles OAuth callback and creates session.  
**Response:** 302 Redirect to frontend with session cookie.

#### Logout
```http
GET /auth/logout
```
**Description:** Destroys user session.  
**Response:** 302 Redirect to frontend.

#### Get Current User
```http
GET /auth/user
```
**Description:** Returns currently authenticated user.  
**Authentication:** Required (session cookie).  
**Response:**
```json
{
  "user": {
    "id": 12345,
    "displayName": "John Doe",
    "email": "john@example.com",
    "provider": "google"
  }
}
```

### Search Endpoints

#### Search Images
```http
POST /api/search
Content-Type: application/json

{
  "term": "mountains"
}
```
**Description:** Search for images and log to database.  
**Authentication:** Optional (logs userId if authenticated).  
**Request Body:**
```json
{
  "term": "mountains"  // Required, min 1 character
}
```
**Response:**
```json
{
  "query": "mountains",
  "term": "mountains",
  "total": 10000,
  "results": [
    {
      "id": "abc123",
      "description": "Mountain landscape",
      "urls": {
        "regular": "https://images.unsplash.com/photo-...",
        "small": "https://images.unsplash.com/photo-...",
        "thumb": "https://images.unsplash.com/photo-..."
      },
      "user": {
        "name": "Photographer Name",
        "username": "photographer"
      },
      "alt_description": "Mountain landscape photo"
    }
    // ... 29 more results
  ],
  "source": "unsplash",
  "warning": null
}
```

#### Get Top Searches
```http
GET /api/top-searches
```
**Description:** Get top 5 most searched terms across all users.  
**Authentication:** Not required (public endpoint).  
**Response:**
```json
{
  "topSearches": [
    {
      "term": "mountains",
      "totalSearches": 45,
      "uniqueUsers": 12
    },
    {
      "term": "ocean",
      "totalSearches": 38,
      "uniqueUsers": 9
    },
    {
      "term": "sunset",
      "totalSearches": 32,
      "uniqueUsers": 8
    },
    {
      "term": "forest",
      "totalSearches": 28,
      "uniqueUsers": 7
    },
    {
      "term": "city",
      "totalSearches": 24,
      "uniqueUsers": 6
    }
  ]
}
```

#### Get User's Search History
```http
GET /api/search/history?limit=20
```
**Description:** Get authenticated user's search history.  
**Authentication:** Required (session cookie).  
**Query Parameters:**
- `limit` (optional): Number of results (default: 20, max: 100)

**Response:**
```json
{
  "userId": 12345,
  "count": 15,
  "history": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": 12345,
      "term": "mountains",
      "timestamp": "2025-11-02T10:30:00.000Z",
      "resultsCount": 30
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": 12345,
      "term": "ocean",
      "timestamp": "2025-11-02T09:15:00.000Z",
      "resultsCount": 30
    }
    // ... more results
  ]
}
```

#### Get User's Search Statistics
```http
GET /api/search/stats
```
**Description:** Get statistics for authenticated user.  
**Authentication:** Required (session cookie).  
**Response:**
```json
{
  "userId": 12345,
  "totalSearches": 45,
  "uniqueTerms": 12,
  "topTerms": [
    { "term": "mountains", "count": 8 },
    { "term": "ocean", "count": 6 },
    { "term": "sunset", "count": 5 }
  ],
  "recentSearches": [
    {
      "term": "mountains",
      "timestamp": "2025-11-02T10:30:00.000Z",
      "resultsCount": 30
    }
    // ... more results
  ]
}
```

### Legacy Endpoints

#### Search Images (Deprecated)
```http
GET /api/images?q=mountains
```
**Note:** This endpoint is deprecated. Use `POST /api/search` instead.

## 📮 Postman Collection

### Import Collection

Create a new Postman collection with these requests:

#### 1. Search Images
```json
{
  "name": "Search Images",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"term\": \"mountains\"\n}"
    },
    "url": {
      "raw": "http://localhost:3000/api/search",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["api", "search"]
    }
  }
}
```

#### 2. Get Top Searches
```json
{
  "name": "Get Top Searches",
  "request": {
    "method": "GET",
    "url": {
      "raw": "http://localhost:3000/api/top-searches",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["api", "top-searches"]
    }
  }
}
```

#### 3. Get Search History (Authenticated)
```json
{
  "name": "Get Search History",
  "request": {
    "method": "GET",
    "url": {
      "raw": "http://localhost:3000/api/search/history?limit=20",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["api", "search", "history"],
      "query": [
        {
          "key": "limit",
          "value": "20"
        }
      ]
    }
  },
  "auth": {
    "type": "noauth"
  },
  "note": "Requires session cookie. Login via browser first."
}
```

#### 4. Get Search Stats (Authenticated)
```json
{
  "name": "Get Search Stats",
  "request": {
    "method": "GET",
    "url": {
      "raw": "http://localhost:3000/api/search/stats",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["api", "search", "stats"]
    }
  },
  "note": "Requires session cookie. Login via browser first."
}
```

#### 5. Get Current User
```json
{
  "name": "Get Current User",
  "request": {
    "method": "GET",
    "url": {
      "raw": "http://localhost:3000/auth/user",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["auth", "user"]
    }
  },
  "note": "Requires session cookie. Login via browser first."
}
```

### cURL Examples

```bash
# Search Images
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"term":"mountains"}'

# Get Top Searches
curl http://localhost:3000/api/top-searches

# Get Search History (with session cookie)
curl http://localhost:3000/api/search/history?limit=10 \
  -H "Cookie: connect.sid=your-session-cookie"

# Get Search Stats (with session cookie)
curl http://localhost:3000/api/search/stats \
  -H "Cookie: connect.sid=your-session-cookie"

# Get Current User (with session cookie)
curl http://localhost:3000/auth/user \
  -H "Cookie: connect.sid=your-session-cookie"
```

### PowerShell Examples

```powershell
# Search Images
$body = @{term="mountains"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/search" `
  -Method POST -Body $body -ContentType "application/json"

# Get Top Searches
Invoke-RestMethod -Uri "http://localhost:3000/api/top-searches"

# Get Search History (requires browser session)
# Login via browser first, then:
Invoke-WebRequest -Uri "http://localhost:3000/api/search/history?limit=10" `
  -UseDefaultCredentials -UseBasicParsing

# Get Search Stats
Invoke-WebRequest -Uri "http://localhost:3000/api/search/stats" `
  -UseDefaultCredentials -UseBasicParsing
```

## 🎨 Frontend Features

### SearchPage Component
The main search interface with:
- **Top Searches Banner** — Trending searches at the top
- **Search Input** — Large, accessible search box
- **4-Column Grid** — Responsive image layout
- **Checkboxes** — Top-left corner of each image
- **Selection Counter** — "Selected: X images" display
- **Select All/Clear** — Bulk selection buttons
- **User Search History** — Your recent searches below results

### UserSearchHistory Component
- **Last 10 Searches** — Most recent queries
- **Relative Timestamps** — "2m ago", "3h ago", "5d ago"
- **Result Count** — Badge showing number of results
- **Click-to-Search** — Click any term to search again
- **Refresh Button** — Reload history
- **Auto-Hide** — Only shows when logged in

### OAuth Components
- **LoginButtons** — Google, GitHub, Facebook login buttons
- **UserProfile** — Display logged-in user info
- **OAuthDemo** — Standalone OAuth demo page

## ⚙️ Backend Features

### Express Server
- **CORS Configuration** — Credentials enabled for session cookies
- **Session Middleware** — Secure session handling
- **Passport.js** — OAuth 2.0 authentication
- **MongoDB Integration** — Mongoose ODM
- **Error Handling** — Graceful error responses
- **Fallback Mode** — Works without MongoDB/Unsplash

### Search History Logging
Every search is logged to MongoDB:
```javascript
{
  userId: 12345,              // User ID (or 0 if not logged in)
  term: "mountains",          // Search term
  timestamp: ISODate(...),    // When search was performed
  resultsCount: 30            // Number of results returned
}
```

### MongoDB Aggregation
Top searches uses aggregation pipeline:
```javascript
db.searchhistories.aggregate([
  { $group: {
      _id: "$term",
      count: { $sum: 1 },
      users: { $addToSet: "$userId" }
    }
  },
  { $addFields: {
      term: "$_id",
      totalSearches: "$count",
      uniqueUsers: { $size: "$users" }
    }
  },
  { $sort: { totalSearches: -1 } },
  { $limit: 5 }
])
```

## 🗄️ Database Schema

### SearchHistory Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: 12345,
  term: "mountains",
  timestamp: ISODate("2025-11-02T10:30:00.000Z"),
  resultsCount: 30,
  __v: 0
}
```

**Indexes:**
- `{ userId: 1, timestamp: -1 }` — Compound index for user history queries
- `{ userId: 1 }` — Single field index for user lookups
- `{ term: 1 }` — Index for trending searches aggregation

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy (Free Tier)

**Recommended Stack:**
- Frontend: Vercel (free)
- Backend: Render (free)
- Database: MongoDB Atlas (free 512MB)

**Total Cost: $0/month** 🎉

### Environment Variables for Production

Update `server/.env`:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
MONGODB_URI=mongodb+srv://...atlas.mongodb.net/...
```

Update OAuth callback URLs to production URLs:
```env
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/auth/google/callback
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/auth/github/callback
FACEBOOK_CALLBACK_URL=https://your-backend.onrender.com/auth/facebook/callback
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```powershell
# Start local MongoDB
mongod --dbpath C:\data\db

# OR check Atlas connection string
# Make sure IP 0.0.0.0/0 is whitelisted
```

### "Unsplash API 401 Unauthorized"
- Verify `UNSPLASH_ACCESS_KEY` in `.env`
- Check app is active on Unsplash dashboard
- Note: 50 requests/hour limit on free tier

### "CORS error in browser"
- Ensure backend on port 3000, frontend on port 5173
- Check `credentials: 'include'` in fetch calls
- Verify `FRONTEND_URL` in server `.env`

### "OAuth redirect fails"
- Callback URLs must match exactly in provider console
- Use `http://localhost:3000` (not `127.0.0.1`)
- HTTPS required in production

### "Search history not showing"
- Must be logged in via OAuth
- Check MongoDB connection
- Check `/api/search/history` endpoint in browser

## 📖 Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** — Complete project overview
- **[SEARCH_PAGE_LAYOUT.md](SEARCH_PAGE_LAYOUT.md)** — Visual layout diagrams
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** — Comprehensive testing guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — Deploy to production
- **[OAUTH_SETUP.md](OAUTH_SETUP.md)** — OAuth credentials setup
- **[OAUTH_FRONTEND_GUIDE.md](OAUTH_FRONTEND_GUIDE.md)** — React OAuth integration
- **[OAUTH_VISUAL_GUIDE.md](OAUTH_VISUAL_GUIDE.md)** — OAuth flow diagrams
- **[OAUTH_CHEATSHEET.txt](OAUTH_CHEATSHEET.txt)** — Quick OAuth reference
- **[SEARCH_API_SETUP.md](SEARCH_API_SETUP.md)** — MongoDB & Unsplash setup
- **[SEARCH_API_QUICKREF.md](SEARCH_API_QUICKREF.md)** — API quick reference

## 📝 Scripts

```powershell
# Root (runs both client and server)
npm run dev              # Start both in development mode
npm run install-all      # Install all dependencies

# Client only
cd client
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Server only
cd server
npm run dev              # Start with nodemon
npm start                # Start production server
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Unsplash** for beautiful free images
- **MongoDB** for flexible database
- **Passport.js** for authentication
- **React** and **Vite** for amazing developer experience

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/image-search-multi-select/issues)
- 📖 Docs: See documentation files above

---

**Made with ❤️ using the MERN Stack**

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** November 2, 2025
- Implement image download functionality
- Add user profile management
- Deploy to production (Vercel, Heroku, AWS, etc.)

