import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setIsAdmin(payload.isAdmin || false);
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener("storage", checkToken);
    const interval = setInterval(checkToken, 500);
    checkToken(); // Run once on mount

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav className="w-full px-4 py-3 shadow bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-200"
      >
        ShutterRent
      </Link>

      <div className="flex flex-wrap justify-start sm:justify-end gap-4 text-sm sm:text-base">
        <Link to="/" className="hover:text-blue-600 transition duration-200">Home</Link>

        {!isAdmin && (
          <>
            <Link to="/listings" className="hover:text-blue-600 transition duration-200">Browse</Link>
            <Link to="/about" className="hover:text-blue-600 transition duration-200">About Us</Link>
          </>
        )}

        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin" className="hover:text-blue-600 transition duration-200">Dashboard</Link>
                <Link to="/admin-profile" className="hover:text-blue-600 transition duration-200">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/orders" className="hover:text-blue-600 transition duration-200">Order History</Link>
                <Link to="/profile" className="hover:text-blue-600 transition duration-200">Profile</Link>
              </>
            )}
            <button onClick={handleLogout} className="hover:text-blue-600 transition duration-200">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 transition duration-200">Login</Link>
            <Link to="/register" className="hover:text-blue-600 transition duration-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;