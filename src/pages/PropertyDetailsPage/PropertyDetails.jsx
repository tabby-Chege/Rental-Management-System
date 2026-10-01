import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { searchProperties } from "../../api/rentcastAPI";
import { normalizeProperty } from "../../utils/propertyAdapter";
import "./PropertyDetail.css";

function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadProperty() {
    try {
      const data = await searchProperties("Austin", "TX");
      const normalizedProperties = data.map(normalizeProperty);

      const found = normalizedProperties.find(
        (p) => String(p.id) === String(id)
      );

      if (!found) {
        setError("Property not found.");
      } else {
        setProperty(found);

        setRelated(
          normalizedProperties
            .filter(
              (p) =>
                String(p.id) !== String(id) &&
                p.city === found.city
            )
            .slice(0, 3)
        );
      }
    } catch (err) {
      setError(err.message || "Could not load property.");
    } finally {
      setIsLoading(false);
    }
  }

  loadProperty();
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
        <Link to="/properties" className="details-back">
          ← Back to properties
        </Link>
        <p className="details-error">{error}</p>
      </div>
    );
  }

 const age = property.yearBuilt
  ? new Date().getFullYear() - property.yearBuilt
  : null;

  return (
    <div className="details-page">
      <Link to="/properties" className="details-back">
        ← Back to properties
      </Link>

      <header className="details-header">
  <div className="details-title">
    <h1>{property.name}</h1>

    <div className="details-badges">
      {age !== null && age <= 5 && (
        <span className="badge badge-info">New</span>
      )}
    </div>
  </div>

  <p className="details-address">
    📍 {property.address}, {property.city} {property.state} {property.zip}
  </p>
</header>

      <div className="details-grid">
       <section className="details-box">
  <h3>Overview</h3>
  <ul>
    <li>
      <span>Property type</span>
      <strong>{property.propertyType}</strong>
    </li>

    <li>
      <span>Bedrooms</span>
      <strong>{property.bedrooms}</strong>
    </li>

    <li>
      <span>Bathrooms</span>
      <strong>{property.bathrooms}</strong>
    </li>

    <li>
      <span>Square footage</span>
      <strong>
        {property.squareFootage !== "N/A"
          ? `${property.squareFootage} sq ft`
          : "N/A"}
      </strong>
    </li>

    <li>
      <span>Built</span>
      <strong>
        {property.yearBuilt ?? "N/A"}{" "}
        {age !== null && `(${age} yrs)`}
      </strong>
    </li>

    <li>
      <span>Total apartments</span>
      <strong>{property.totalUnits ?? "N/A"}</strong>
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
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default PropertyDetailsPage;
