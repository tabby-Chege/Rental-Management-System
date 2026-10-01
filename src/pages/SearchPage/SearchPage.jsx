import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { searchProperties } from "../../api/rentcastAPI";
import { normalizeProperty } from "../../utils/propertyAdapter";
import "./SearchPage.css";
function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  async function loadProperties() {
    try {
      const data = await searchProperties("Austin", "TX");
      const normalizedProperties = data.map(normalizeProperty);

      setProperties(normalizedProperties);
    } catch (err) {
      setError(err.message || "Could not load properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  loadProperties();
}, []);
 function matchesSearch(p) {
  if (!query) return true;

  const t = query.toLowerCase();

  return (
    p.name.toLowerCase().includes(t) ||
    p.address.toLowerCase().includes(t) ||
    p.city.toLowerCase().includes(t) ||
    p.state.toLowerCase().includes(t) ||
    p.zip.toLowerCase().includes(t)
  );
}
  function matchesAge(p) {
    if (ageFilter === "all") return true;
    const age = new Date().getFullYear() - p.yearBuilt;
    if (ageFilter === "new") return age <= 5;
    if (ageFilter === "recent") return age > 5 && age <= 15;
    if (ageFilter === "old") return age > 15;
    return true;
  }

function matchesSize(p) {
  if (sizeFilter === "all") return true;

  const size = Number(p.squareFootage);

  if (!Number.isFinite(size)) return false;

  if (sizeFilter === "small") return size < 800;
  if (sizeFilter === "medium") return size >= 800 && size <= 1500;
  if (sizeFilter === "large") return size > 1500;

  return true;
}
  let results = properties.filter(
    (p) =>
      matchesSearch(p) &&
      matchesAge(p) &&
      matchesSize(p)
  );

if (sortBy === "newest") {
  results = [...results].sort((a, b) => {
    if (a.yearBuilt == null) return 1;
    if (b.yearBuilt == null) return -1;

    return b.yearBuilt - a.yearBuilt;
  });
} else if (sortBy === "oldest") {
  results = [...results].sort((a, b) => {
    if (a.yearBuilt == null) return 1;
    if (b.yearBuilt == null) return -1;

    return a.yearBuilt - b.yearBuilt;
  });
} else if (sortBy === "biggest") {
  results = [...results].sort((a, b) => {
    const aSize = Number(a.squareFootage);
    const bSize = Number(b.squareFootage);

    if (!Number.isFinite(aSize)) return 1;
    if (!Number.isFinite(bSize)) return -1;

    return bSize - aSize;
  });
}

  function clearAll() {
    setQuery("");
    setAgeFilter("all");
    setSizeFilter("all");
    setSortBy("default");
  }

  const activeCount = [ageFilter, sizeFilter].filter(
  (v) => v !== "all"
).length;

  return (
    <div className="search-page">
      <header className="search-page-header">
        <h1>Find a rental property</h1>
        <p>
           Search by name, address, city, or zip. Filter properties by age and size.
            </p>
      </header>

      <div className="search-page-searchbar">
        <SearchBar onSearch={setQuery} isLoading={isLoading} />
      </div>

      <div className="search-page-layout">
        <aside className="filter-panel">
          <div className="filter-header">
            <h2>Filters</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="filter-clear">
                Clear ({activeCount})
              </button>
            )}
          </div>

          <div className="filter-group">
            <p className="filter-label">Property age</p>
            <label>
              <input
                type="radio"
                name="age"
                checked={ageFilter === "all"}
                onChange={() => setAgeFilter("all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="age"
                checked={ageFilter === "new"}
                onChange={() => setAgeFilter("new")}
              />
              New (0–5 yrs)
            </label>
            <label>
              <input
                type="radio"
                name="age"
                checked={ageFilter === "recent"}
                onChange={() => setAgeFilter("recent")}
              />
              Recent (5–15 yrs)
            </label>
            <label>
              <input
                type="radio"
                name="age"
                checked={ageFilter === "old"}
                onChange={() => setAgeFilter("old")}
              />
              Old (15+ yrs)
            </label>
          </div>

          <div className="filter-group">
            <p className="filter-label">Property Size</p>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "all"}
                onChange={() => setSizeFilter("all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "small"}
                onChange={() => setSizeFilter("small")}
              />
              Small (&lt;800 sq ft)
            </label>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "medium"}
                onChange={() => setSizeFilter("medium")}
              />
              Medium (800–1500 sq ft)
            </label>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "large"}
                onChange={() => setSizeFilter("large")}
              />
              Large (&gt;1500 sq ft)
            </label>
          </div>
        </aside>

        <div className="results-area">
          {error && <div className="error-message">{error}</div>}

          {!error && !isLoading && (
            <div className="results-header">
              <p className="results-count">
                Showing <strong>{results.length}</strong> of {properties.length}{" "}
                properties
              </p>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="results-sort"
              >
                <option value="default">Best match</option>
                <option value="newest">Newest properties</option>
                <option value="oldest">Oldest properties</option>
                <option value="biggest">Largest properties</option>
              </select>
            </div>
          )}

          {isLoading && (
            <div className="property-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="property-skeleton" />
              ))}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔎</div>
              <h3>No properties match your search</h3>
              <p>Try a different search term or clear some filters.</p>
            </div>
          )}
{!isLoading && !error && results.length > 0 && (
  <div className="property-grid">
    {results.map((p) => {
      const age = p.yearBuilt
        ? new Date().getFullYear() - p.yearBuilt
        : null;

      return (
        <Link
          to={`/properties/${p.id}`}
          key={p.id}
          className="property-card"
        >
          <div className="property-card-top">
            <h3>{p.name}</h3>

            <div className="property-card-badges">
              {p.propertyType && (
                <span className="badge badge-info">
                  {p.propertyType}
                </span>
              )}

              {age !== null && age <= 5 && (
                <span className="badge badge-success">
                  New
                </span>
              )}
            </div>
          </div>

          <p className="property-card-address">
            {p.address}, {p.city} {p.state} {p.zip}
          </p>

          <ul className="property-card-info">
            <li>{p.bedrooms} bedrooms</li>
            <li>{p.bathrooms} bathrooms</li>
            <li>{p.squareFootage} sq ft</li>
            {p.yearBuilt && <li>Built {p.yearBuilt}</li>}
          </ul>

          {p.totalUnits && (
            <p className="property-card-units">
              {p.totalUnits} units
            </p>
          )}
        </Link>
      );
    })}
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;