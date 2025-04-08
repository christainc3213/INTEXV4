import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import BrowsePage from "./pages/BrowsePage";
import PrivacyPage from "./pages/PrivacyPage";
import MoviePage from "./pages/MoviePage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import AdminPage from "./pages/AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";
import FooterComponent from "./components/FooterComponent";
import Cookies from "js-cookie";

/*---> Component <---*/
const App: React.FC = () => {
  // COOKIE IMPLEMENTATION
  useEffect(() => {
    let interactionId = Cookies.get("interactionId");

    if (!interactionId) {
      interactionId = generateUniqueId();
      Cookies.set("interactionId", interactionId, {
        expires: 7, // Days until cookie expires
        secure: true, // Only if you're using HTTPS
        sameSite: "Strict", // Or 'Lax', based on your setup
      });
    }
  }, []);

  const generateUniqueId = () => {
    return "xxxxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/movie/:slug" element={<MoviePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
      <FooterComponent />
    </>
  );
};

export default App;
