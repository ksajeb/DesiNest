import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./Context/AuthContext.jsx";
import ListingContext from "./Context/ListingContext";
import UserContext from "./Context/UserContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <ListingContext>
          <App />
        </ListingContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>,
);
