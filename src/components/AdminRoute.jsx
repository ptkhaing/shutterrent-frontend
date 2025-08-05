import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

function AdminRoute({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthState({ loading: false, isAdmin: false });
        return;
      }

      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isAdmin = res.data.isAdmin === true;
        setAuthState({ loading: false, isAdmin });
      } catch (err) {
        console.error("Admin check failed:", err);
        setAuthState({ loading: false, isAdmin: false });
      }
    };

    checkAdmin();
  }, []);

  if (authState.loading) {
    return <p className="text-center mt-10 text-gray-500">🔐 Checking admin access...</p>;
  }

  if (!authState.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;