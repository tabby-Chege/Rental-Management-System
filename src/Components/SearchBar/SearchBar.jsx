import { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  // Wait 400ms after user stops typing before calling onSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  function handleClear() {
    setQuery("");
  }

  return (
    <div className="search-bar">
      <span className="search-bar-icon" aria-hidden="true">
        🔍
      </span>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search buildings, addresses, or zips..."
        className="search-bar-input"
        aria-label="Search buildings"
      />

      {isLoading && <span className="search-bar-spinner" aria-label="Loading" />}

      {query && !isLoading && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;