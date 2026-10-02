import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage/SearchPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage/PropertyDetails";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<SearchPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;
