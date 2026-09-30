import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
      </Routes>
    </>
  );
}

export default App;