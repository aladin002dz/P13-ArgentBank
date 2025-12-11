# ArgentBank - React Frontend Application

A React + TypeScript banking application with Redux Toolkit for state management.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Adding Redux Toolkit from Scratch](#adding-redux-toolkit-from-scratch)
  - [Step 0: Create a Vite + React + TypeScript Project](#step-0-create-a-vite--react--typescript-project)
  - [Step 1: Install Redux Dependencies](#step-1-install-redux-dependencies)
  - [Step 2: Create the Store Directory Structure](#step-2-create-the-store-directory-structure)
  - [Step 3: Create the Redux Store](#step-3-create-the-redux-store)
  - [Step 4: Create Your First Slice](#step-4-create-your-first-slice)
  - [Step 5: Connect Store to React App](#step-5-connect-store-to-react-app)
  - [Step 6: Create Typed Hooks](#step-6-create-typed-hooks)
  - [Step 7: Use Redux in Components](#step-7-use-redux-in-components)
  - [Step 8: Add RTK Query for API Calls](#step-8-add-rtk-query-for-api-calls)
- [API Reference](#api-reference)

---

## Project Overview

ArgentBank is a banking application frontend that allows users to:
- Sign in to their account
- View and edit their profile
- View account transactions

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Redux Toolkit** - State Management
- **RTK Query** - Data Fetching & Caching
- **React Router** - Routing

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Images and static files
│   ├── components/       # Reusable components
│   ├── hooks/            # Custom hooks (useRedux.ts)
│   ├── pages/            # Page components
│   ├── store/            # Redux store configuration
│   │   ├── api/          # RTK Query API slices
│   │   │   └── apiSlice.ts
│   │   ├── slices/       # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   └── userSlice.ts
│   │   └── store.ts      # Store configuration
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point with Provider
├── package.json
└── vite.config.ts
```

## Getting Started

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Adding Redux Toolkit from Scratch

This guide explains how to integrate Redux Toolkit into a React + TypeScript project **starting from a fresh Vite template**.

### Step 0: Create a Vite + React + TypeScript Project

If you don't have a project yet, create one using Vite:

```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest my-app -- --template react-ts

# Navigate into the project
cd my-app

# Install base dependencies
npm install
```

This gives you a project structure like:

```
my-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

### Step 1: Install Redux Dependencies

Now add Redux Toolkit and React-Redux:

```bash
npm install @reduxjs/toolkit react-redux
```

> **💡 Note:** For TypeScript projects, types are **included** in both packages—no additional `@types` packages needed!

---

### Step 2: Create the Store Directory Structure

Create the following folder structure in your `src` directory:

```
src/
└── store/
    ├── api/          # For RTK Query (optional)
    ├── slices/       # For Redux slices
    └── store.ts      # Store configuration
```

```bash
# Create directories
mkdir -p src/store/slices
mkdir -p src/store/api
```

---

### Step 3: Create the Redux Store

Create `src/store/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // Your reducers will go here
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

> **💡 Key Point:** `RootState` and `AppDispatch` types are automatically inferred, ensuring full type safety throughout your app.

---

### Step 4: Create Your First Slice

A **slice** is a collection of Redux reducer logic and actions for a single feature.

#### Example: Auth Slice

Create `src/store/slices/authSlice.ts`:

```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 1. Define the state interface
interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

// 2. Define initial state
const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
};

// 3. Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action to set credentials after login
        setCredentials: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
        },
        // Action to clear credentials on logout
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
});

// 4. Export actions and reducer
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

#### Example: User Slice

Create `src/store/slices/userSlice.ts`:

```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

#### Update Store with Slices

Update `src/store/store.ts` to include your slices:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### Step 5: Connect Store to React App

Wrap your application with the Redux `Provider` in `src/main.tsx`:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

---

### Step 6: Create Typed Hooks

For TypeScript, create custom typed hooks to avoid repeating types in every component.

Create `src/hooks/useRedux.ts`:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

// Use these hooks instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

> **💡 Why?** These hooks provide automatic type inference for your entire store, so you get autocomplete and type checking when selecting state.

---

### Step 7: Use Redux in Components

Now you can use Redux state and dispatch actions in any component!

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setCredentials, logout } from '@/store/slices/authSlice';

function MyComponent() {
    // Select state with full type safety
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);
    
    // Dispatch actions
    const dispatch = useAppDispatch();
    
    const handleLogin = (token: string) => {
        dispatch(setCredentials({ token }));
    };
    
    const handleLogout = () => {
        dispatch(logout());
    };
    
    return (
        <div>
            {isAuthenticated ? (
                <>
                    <p>Welcome, {user?.firstName}!</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={() => handleLogin('sample-token')}>
                    Login
                </button>
            )}
        </div>
    );
}
```

---

### Step 8: Add RTK Query for API Calls

RTK Query is Redux Toolkit's built-in solution for data fetching and caching. It eliminates the need for `useEffect` + `fetch` patterns.

#### Create API Slice

Create `src/store/api/apiSlice.ts`:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define request/response types
interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    status: number;
    message: string;
    body: {
        token: string;
    };
}

interface ProfileResponse {
    status: number;
    message: string;
    body: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
}

// Create the API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/v1',
        // Automatically add auth token to requests
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Tags for cache invalidation
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        // Mutation: Login
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Query: Get user profile
        getProfile: builder.query<ProfileResponse, void>({
            query: () => ({
                url: '/user/profile',
                method: 'POST',
            }),
            providesTags: ['Profile'],
        }),
        // Mutation: Update profile
        updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
            query: (profile) => ({
                url: '/user/profile',
                method: 'PUT',
                body: profile,
            }),
            // Invalidate cache to refetch profile
            invalidatesTags: ['Profile'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useLoginMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
} = apiSlice;
```

#### Update Store with API Slice

Update `src/store/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,  // Add API reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),  // Add API middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Use RTK Query in Components

```typescript
import { useLoginMutation, useGetProfileQuery } from '@/store/api/apiSlice';
import { useAppDispatch } from '@/hooks/useRedux';
import { setCredentials } from '@/store/slices/authSlice';
import { setUser } from '@/store/slices/userSlice';

function LoginForm() {
    const dispatch = useAppDispatch();
    
    // RTK Query mutation hook
    const [login, { isLoading, error }] = useLoginMutation();
    
    const handleSubmit = async (email: string, password: string) => {
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({ token: result.body.token }));
        } catch (err) {
            console.error('Login failed:', err);
        }
    };
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('user@example.com', 'password');
        }}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error occurred!</p>}
            <button type="submit" disabled={isLoading}>
                Sign In
            </button>
        </form>
    );
}

function ProfilePage() {
    // RTK Query hook - automatically fetches on mount
    const { data, isLoading, error } = useGetProfileQuery();
    const dispatch = useAppDispatch();
    
    // Update user state when profile is loaded
    useEffect(() => {
        if (data?.body) {
            dispatch(setUser(data.body));
        }
    }, [data, dispatch]);
    
    if (isLoading) return <p>Loading profile...</p>;
    if (error) return <p>Error loading profile</p>;
    
    return (
        <div>
            <h1>Welcome, {data?.body.firstName}!</h1>
        </div>
    );
}
```

---

## API Reference

### Hooks

| Hook | Description |
|------|-------------|
| `useAppDispatch()` | Typed dispatch hook |
| `useAppSelector()` | Typed selector hook |
| `useLoginMutation()` | Login API mutation |
| `useGetProfileQuery()` | Fetch user profile |
| `useUpdateProfileMutation()` | Update user profile |

### Actions

| Slice | Action | Description |
|-------|--------|-------------|
| `auth` | `setCredentials({ token })` | Store auth token |
| `auth` | `logout()` | Clear auth state |
| `user` | `setUser(user)` | Store user data |
| `user` | `clearUser()` | Clear user data |

---

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [React Redux TypeScript Guide](https://react-redux.js.org/using-react-redux/usage-with-typescript)
