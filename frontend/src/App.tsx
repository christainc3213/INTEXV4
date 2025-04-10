import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivacyPage from "./pages/PrivacyPage";
import MoviePage from "./pages/MoviePage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import AdminPage from "./pages/AdminPage";
import SearchResults from "./pages/SearchResults";
import "bootstrap/dist/css/bootstrap.min.css";
import FooterComponent from "./components/FooterComponent";
import ScrollToTop from "./components/ScrollToTop";
import MoviePageWrapper from "./components/MoviePageWrapper";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

/*---> Component <---*/
const App: React.FC = () => {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/movie/:slug" element={<MoviePageWrapper />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
      <FooterComponent />
    </>
  );
};

export default App;
