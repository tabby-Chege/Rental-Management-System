import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./SearchPage.css";

function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Could not load properties. Please try again.");
        setIsLoading(false);
      });
  }, []);

  function matchesSearch(p) {
    if (!query) return true;
    const t = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(t) ||
      p.address.toLowerCase().includes(t) ||
      p.city.toLowerCase().includes(t) ||
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

  function matchesAvailability(p) {
    if (availabilityFilter === "all") return true;
    const vacant = p.totalUnits - p.occupiedUnits;
    if (availabilityFilter === "available") return vacant > 0;
    if (availabilityFilter === "full") return vacant === 0;
    return true;
  }

  function matchesSize(p) {
    if (sizeFilter === "all") return true;
    const u = p.totalUnits;
    if (sizeFilter === "small") return u <= 10;
    if (sizeFilter === "medium") return u > 10 && u <= 50;
    if (sizeFilter === "large") return u > 50;
    return true;
  }

  let results = properties.filter(
    (p) =>
      matchesSearch(p) &&
      matchesAge(p) &&
      matchesAvailability(p) &&
      matchesSize(p)
  );

  if (sortBy === "newest") {
    results = [...results].sort((a, b) => b.yearBuilt - a.yearBuilt);
  } else if (sortBy === "oldest") {
    results = [...results].sort((a, b) => a.yearBuilt - b.yearBuilt);
  } else if (sortBy === "cheapest") {
    results = [...results].sort((a, b) => a.rentFrom - b.rentFrom);
  } else if (sortBy === "biggest") {
    results = [...results].sort((a, b) => b.totalUnits - a.totalUnits);
  }

  function clearAll() {
    setQuery("");
    setAgeFilter("all");
    setAvailabilityFilter("all");
    setSizeFilter("all");
    setSortBy("default");
  }

  const activeCount = [ageFilter, availabilityFilter, sizeFilter].filter(
    (v) => v !== "all"
  ).length;

  return (
    <div className="search-page">
      <header className="search-page-header">
        <h1>Find a rental property</h1>
        <p>
          Search by name, address, city, or zip. Filter by age, availability,
          and size.
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
            <p className="filter-label">Availability</p>
            <label>
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === "all"}
                onChange={() => setAvailabilityFilter("all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === "available"}
                onChange={() => setAvailabilityFilter("available")}
              />
              Has vacancies
            </label>
            <label>
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === "full"}
                onChange={() => setAvailabilityFilter("full")}
              />
              Fully occupied
            </label>
          </div>

          <div className="filter-group">
            <p className="filter-label">Number of apartments</p>
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
              Small (1–10)
            </label>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "medium"}
                onChange={() => setSizeFilter("medium")}
              />
              Medium (11–50)
            </label>
            <label>
              <input
                type="radio"
                name="size"
                checked={sizeFilter === "large"}
                onChange={() => setSizeFilter("large")}
              />
              Large (51+)
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
                <option value="cheapest">Rent: low to high</option>
                <option value="biggest">Most apartments</option>
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
                const vacant = p.totalUnits - p.occupiedUnits;
                const age = new Date().getFullYear() - p.yearBuilt;
                const occupancy = Math.round(
                  (p.occupiedUnits / p.totalUnits) * 100
                );

                return (
                  <Link
                    to={`/properties/${p.id}`}
                    key={p.id}
                    className="property-card"
                  >
                    <div className="property-card-top">
                      <h3>{p.name}</h3>
                      <div className="property-card-badges">
                        {vacant > 0 ? (
                          <span className="badge badge-success">
                            {vacant} vacant
                          </span>
                        ) : (
                          <span className="badge badge-danger">Full</span>
                        )}
                        {age <= 5 && (
                          <span className="badge badge-info">New</span>
                        )}
                      </div>
                    </div>

                    <p className="property-card-address">
                      {p.address}, {p.city} {p.zip}
                    </p>

                    <ul className="property-card-info">
                      <li>{p.totalUnits} apartments</li>
                      <li>Built {p.yearBuilt}</li>
                      <li>From ${p.rentFrom}/mo</li>
                    </ul>

                    <div className="property-card-bar">
                      <div
                        className="property-card-bar-fill"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                    <p className="property-card-occupancy">
                      {occupancy}% occupied
                    </p>
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