import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminCategories from "./pages/AdminCategories";
import { getUser } from "./api";

function App() {
  const [user, setUser] = useState(getUser());
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
  }, [location]);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="container py-4">
        <Routes>
          {/* Public routes */}

          <Route path="/" element={<Shop />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={() => setUser(getUser())} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegister={() => setUser(getUser())} />
              )
            }
          />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" replace />}
          />

          {/* Admin routes - Protected */}
          <Route element={<ProtectedRoute user={user} requireAdmin />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminProductForm />} />
            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductForm />}
            />
            <Route path="/admin/categories" element={<AdminCategories />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
