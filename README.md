# ForgeHive

ForgeHive is a full-stack web application designed to help developers discover, organize, and manage useful development tools in a structured and user-friendly environment. The platform provides curated tools across multiple categories and allows authenticated users to save and filter tools based on their preferences.

The system is built with a focus on usability, performance, and scalability, combining modern frontend practices with a relational backend architecture.

---

## 1. Live Application and Repository

Live Application:
https://forge-hive.vercel.app/

Source Code Repository:
https://github.com/swapnilAngarkhe/ForgeHive

---

## 2. Problem Statement

Developers frequently rely on multiple tools during their workflow, ranging from UI libraries to backend utilities and productivity platforms. However, there is no centralized system that allows developers to:

* Discover tools in an organized manner
* Categorize tools efficiently
* Save and revisit useful tools
* Maintain a personalized collection

Most existing solutions are either static lists or lack personalization and persistence.

---

## 3. Objectives

The primary objectives of ForgeHive are:

* To provide a centralized platform for discovering development tools
* To enable users to save and manage their preferred tools
* To implement a secure authentication system with persistent sessions
* To design an intuitive and responsive user interface
* To ensure scalability through proper database design and pagination
* To enhance user experience through performance optimizations such as optimistic UI and skeleton loading

---

## 4. Features

### 4.1 Authentication System

* User signup with email and password
* Email verification workflow
* Secure login and logout functionality
* Persistent sessions using server-side authentication

### 4.2 Tool Browsing

* Display of tools with name, description, and category
* Category-based filtering using interactive tags
* Pagination to handle large datasets efficiently

### 4.3 Favorites System

* Save and unsave tools
* Persistent storage of user preferences in the database
* Immediate UI feedback using optimistic updates

### 4.4 User Profile

* Display of user information
* Listing of saved tools
* Category-based filtering within saved tools
* Copy functionality for user details

### 4.5 User Interface and Experience

* Responsive layout across devices
* Skeleton loaders to improve perceived performance
* Clean and minimal design system
* Interactive components with consistent styling

---

## 5. System Architecture

The application follows a modern full-stack architecture:

* Frontend: Next.js (App Router) with React
* Backend: Supabase (Authentication and PostgreSQL database)
* Deployment: Vercel

### Data Flow

1. User interacts with frontend components
2. Requests are handled via server actions
3. Supabase processes authentication and database queries
4. Data is returned and rendered on the client

---

## 6. Database Design

The system uses a relational database with the following core tables:

### Users (Supabase Auth)

* Stores authentication credentials

### Profiles

* id (UUID, primary key)
* name
* email
* avatar_url
* role
* created_at

### Tools

* id
* name
* description
* url
* github_url
* category_id
* created_at

### Categories

* category_id
* category_name

### Favorites

* favorite_id
* user_id (foreign key)
* tool_id (foreign key)
* created_at

### Relationships

* One user can have multiple favorites
* Each tool belongs to one category
* Favorites link users and tools

---

## 7. Key Implementations

### 7.1 Server-Side Authentication

Authentication is handled using Supabase with server-side session management. Cookies are managed securely to maintain session persistence across page reloads.

### 7.2 Optimistic UI

The application updates the UI instantly when a user saves or unsaves a tool, improving responsiveness while background operations complete.

### 7.3 Hydration Error Handling

Special care was taken to ensure consistent rendering between server and client, avoiding hydration mismatches in Next.js.

### 7.4 Error Handling and Edge Cases

* Foreign key constraints handled by ensuring profile creation before favorites insertion
* Safe queries using `maybeSingle()` to prevent runtime errors
* Graceful fallback for missing data

### 7.5 Performance Enhancements

* Pagination reduces load on large datasets
* Skeleton loaders improve perceived speed
* Efficient querying and filtering

---

## 8. Setup Instructions

### 8.1 Clone the Repository

```bash
git clone https://github.com/swapnilAngarkhe/ForgeHive.git
cd ForgeHive
```

### 8.2 Install Dependencies

```bash
npm install
```

### 8.3 Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 8.4 Run the Application

```bash
npm run dev
```

---

## 9. Deployment

The application is deployed using Vercel with continuous integration from GitHub.

Steps followed:

* Repository connected to Vercel
* Environment variables configured
* Automatic build and deployment enabled

Supabase authentication settings were updated with:

* Site URL
* Redirect URL

---

## 10. Testing

The system was tested for:

* User registration and login
* Email verification workflow
* Session persistence after refresh
* Favorites functionality
* Filtering and pagination
* Profile data rendering

All critical user flows were verified in both development and production environments.

---

## 11. Limitations

* Tool submission is not yet automated
* No advanced search functionality
* Limited analytics on tool usage

---

## 12. Future Scope

* Community-driven tool submission system
* Dedicated student project showcase (Bakliwal Projects)
* Advanced filtering and search capabilities
* AI-based recommendations
* Admin dashboard for content moderation

---

## 13. Conclusion

ForgeHive demonstrates a complete full-stack implementation with real-world features such as authentication, database relationships, and deployment. The project emphasizes both functionality and user experience, making it a scalable foundation for further development.

---

## 14. Author

Swapnil Angarkhe

---

## 15. License

This project is developed for academic purposes.
