import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SigninPage from "./pages/LoginPage";
import SignupPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import "bootstrap/dist/css/bootstrap.min.css";

/*---> Component <---*/
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <SigninPage />
        </Route>
        <Route path="/register">
          <SignupPage />
        </Route>
        <Route path="/browse">
          <BrowsePage />
        </Route>
        <Route path="/privacy">
          <PrivacyPage />
        </Route>

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
