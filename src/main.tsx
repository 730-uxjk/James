import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';
import { AuthProvider, useAuth } from './screens/Auth/AuthContext.tsx';
import ProtectedRoute from './screens/Auth/ProtectedRoute.tsx';
import AdminRoute from './screens/Auth/AdminRoute.tsx';
import GuestRoute from './screens/Auth/GuestRoute.tsx';
import { getHomePath } from './screens/Auth/roles.ts';
import { ThemeProvider } from './components/theme-provider.tsx';

const Page1 = lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);



const James = lazy(() =>
  wait(1300).then(() => import("./screens/Main/James.tsx"))
);
const Page2 = lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);

const Login = lazy(() => import("./screens/Auth/login.tsx"));
const Register = lazy(() => import("./screens/Auth/Register.tsx"));

// ── Admin pages ───────────────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import("./screens/Admin/Dashboard.tsx"));
const AdminUsers      = lazy(() => import("./screens/Admin/UserPage.tsx"));
const AdminOffices    = lazy(() => import("./screens/Admin/OfficePage.tsx"));
const AdminDocuments  = lazy(() => import("./screens/Admin/DocumentPage.tsx"));
const AdminSettings   = lazy(() => import("./screens/Admin/Setting.tsx"));
const AdminProfile    = lazy(() => import("./screens/Admin/Profile.tsx"));

// ── User pages (acc_lvl !== 0) ────────────────────────────────────────────
const UserDashboard  = lazy(() => import("./screens/User/Dashboard.tsx"));
const UserDocuments  = lazy(() => import("./screens/User/Documents.tsx"));
const UserProfile    = lazy(() => import("./screens/User/Profile.tsx"));

// Legacy route kept for old links
const LegacyDashboard = lazy(() => import("./screens/Dashboard.tsx"));

// Sends "/" to the right place: role-based dashboard if logged in, login otherwise.
const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  return (
    <Navigate
      to={isAuthenticated ? getHomePath(user) : "/James/login"}
      replace
    />
  );
};

const router = createBrowserRouter([
  // ── Auth pages (no navbar) — redirect away if already logged in ────────
  {
    path: "/James/login",
    element: (
      <GuestRoute>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </GuestRoute>
    ),
  },
   {
    path: "/James/main",
    element: (
      <GuestRoute>
        <Suspense fallback={<Loader />}>
          <James />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/James/register",
    element: (
      <GuestRoute>
        <Suspense fallback={<Loader />}>
          <Register />
        </Suspense>
      </GuestRoute>
    ),
  },

  // ── Admin pages — acc_lvl === 0 only ───────────────────
  {
    path: "/James/admin/dashboard",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminDashboard /></Suspense></AdminRoute>,
  },
  {
    path: "/James/admin/users",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminUsers /></Suspense></AdminRoute>,
  },
  {
    path: "/James/admin/offices",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminOffices /></Suspense></AdminRoute>,
  },
  {
    path: "/James/admin/documents",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminDocuments /></Suspense></AdminRoute>,
  },
  {
    path: "/James/admin/settings",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminSettings /></Suspense></AdminRoute>,
  },
  {
    path: "/James/admin/profile",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminProfile /></Suspense></AdminRoute>,
  },

  // ── User pages — any authenticated user ────────────────
  {
    path: "/James/user/dashboard",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserDashboard /></Suspense></ProtectedRoute>,
  },
  {
    path: "/James/user/documents",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserDocuments /></Suspense></ProtectedRoute>,
  },
  {
    path: "/James/user/profile",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserProfile /></Suspense></ProtectedRoute>,
  },

  // ── Legacy dashboard redirect ──────────────────────────
  {
    path: "/James/dashboard",
    element: <Navigate to="/James/admin/dashboard" replace />,
  },

  // ── Legacy standalone dashboard (kept as fallback) ────
  {
    path: "/James/dashboard-old",
    element: <Suspense fallback={<Loader />}><LegacyDashboard /></Suspense>,
  },

  // ── Main app with navbar ──────────────────────────────
  {
    path: "/James/",
    element: <Login />,
    children: [
      {
        path: "/James/",
        element: <Home />,
      },
      {
        path: "/James/page1",
        element: (
          <Suspense fallback={<Loader />}>
            <Page1 />
          </Suspense>
        ),
      },
      {
        path: "/James/page2",
        element: (
          <Suspense fallback={<Loader />}>
            <Page2 />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
