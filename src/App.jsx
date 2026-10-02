import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import SearchPage from "./pages/SearchPage/SearchPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage/PropertyDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="nav-brand">Rental Management System</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/search">Search</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Rental Management System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
