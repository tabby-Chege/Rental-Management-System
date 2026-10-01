import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PropertyDetail.css";

function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => String(p.id) === id);
        if (!found) {
          setError("Property not found.");
        } else {
          setProperty(found);
          setRelated(
            data.filter((p) => String(p.id) !== id && p.city === found.city).slice(0, 3)
          );
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError("Could not load property.");
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="details-page">
        <div className="details-skeleton details-skeleton-title" />
        <div className="details-skeleton details-skeleton-sub" />
        <div className="details-grid">
          <div className="details-skeleton details-skeleton-box" />
          <div className="details-skeleton details-skeleton-box" />
          <div className="details-skeleton details-skeleton-box" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-page">
        <Link to="/search" className="details-back">
          ← Back to search
        </Link>
        <p className="details-error">{error}</p>
      </div>
    );
  }

  const age = new Date().getFullYear() - property.yearBuilt;
  const vacant = property.totalUnits - property.occupiedUnits;
  const occupancy = Math.round(
    (property.occupiedUnits / property.totalUnits) * 100
  );

  return (
    <div className="details-page">
      <Link to="/search" className="details-back">
        ← Back to search
      </Link>

      <header className="details-header">
        <div className="details-title">
          <h1>{property.name}</h1>
          <div className="details-badges">
            {vacant > 0 ? (
              <span className="badge badge-success">{vacant} vacant</span>
            ) : (
              <span className="badge badge-danger">Fully occupied</span>
            )}
            {age <= 5 && <span className="badge badge-info">New</span>}
          </div>
        </div>
        <p className="details-address">
          📍 {property.address}, {property.city} {property.zip}
        </p>
      </header>

      <section className="details-occupancy">
        <div className="details-occupancy-head">
          <span>Occupancy</span>
          <strong>{occupancy}%</strong>
        </div>
        <div className="details-bar">
          <div className="details-bar-fill" style={{ width: `${occupancy}%` }} />
        </div>
        <p className="details-occupancy-note">
          {property.occupiedUnits} of {property.totalUnits} apartments occupied
        </p>
      </section>

      <div className="details-grid">
        <section className="details-box">
          <h3>Overview</h3>
          <ul>
            <li>
              <span>Built</span>
              <strong>
                {property.yearBuilt} ({age} yrs)
              </strong>
            </li>
            <li>
              <span>Total apartments</span>
              <strong>{property.totalUnits}</strong>
            </li>
            <li>
              <span>Occupied</span>
              <strong>{property.occupiedUnits}</strong>
            </li>
            <li>
              <span>Vacant</span>
              <strong>{vacant}</strong>
            </li>
          </ul>
        </section>

        <section className="details-box">
          <h3>Rent</h3>
          <ul>
            <li>
              <span>Starting from</span>
              <strong>${property.rentFrom}/mo</strong>
            </li>
          </ul>
        </section>

        <section className="details-box">
          <h3>Status</h3>
          <ul>
            <li>
              <span>Availability</span>
              <strong>
                {vacant > 0 ? `${vacant} vacant` : "Fully occupied"}
              </strong>
            </li>
            <li>
              <span>Property age</span>
              <strong>{age <= 5 ? "New" : `${age} years`}</strong>
            </li>
          </ul>
        </section>
      </div>

      {related.length > 0 && (
        <section className="details-related">
          <h2>Other properties in {property.city}</h2>
          <div className="related-grid">
            {related.map((p) => (
              <Link
                to={`/properties/${p.id}`}
                key={p.id}
                className="related-card"
              >
                <h3>{p.name}</h3>
                <p>{p.address}</p>
                <span>From ${p.rentFrom}/mo</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default PropertyDetailsPage;
