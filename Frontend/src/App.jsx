import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ListingPage1 from "./pages/ListingPage1";
import ListingPage2 from "./pages/ListingPage2";
import ListingPage3 from "./pages/ListingPage3";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/listingpage1" element={<ListingPage1 />}></Route>
        <Route path="/listingpage2" element={<ListingPage2 />}></Route>
        <Route path="/listingpage3" element={<ListingPage3 />}></Route>
      </Routes>
    </>
  );
}

export default App;
