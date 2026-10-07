import { useEffect, useState } from "react";
import styles from './App.module.css'
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const UpdateMapCenter = ({ latitude, longitude }) => {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [map, latitude, longitude]);
  return null;
};


const App = () => {
  const [data, setData] = useState();
  const [countryName, setCountryName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");


  const handleW = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError("Please enter both latitude and longitude");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Latitude must be -90 to 90, longitude -180 to 180");
      return;
    }

    setError("");
    setLoading(true);
    setCountryName("");

    // Weather + timezone from open-meteo (single reliable API)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true&timezone=auto`;

    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      setShow(true);

      // Country name via reverse geocoding (independent — won't break weather)
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "User-Agent": "WeatherLookupApp/1.0" } }
        );
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          setCountryName(geoJson?.address?.country || "--");
        }
      } catch {
        // Country lookup is optional — silently ignore
        setCountryName("--");
      }
    } catch (err) {
      console.error(err.message);
      setError("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  // figure out which hourly index matches "now" at that location
  const getCurrentTempIndex = () => {
    if (!data?.hourly?.time) return 0;
    const now = new Date();
    // find the closest hour
    let best = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < data.hourly.time.length; i++) {
      const diff = Math.abs(new Date(data.hourly.time[i]) - now);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    return best;
  };

  // Format the current time in the location's timezone
  const getLocalTime = () => {
    if (!data?.timezone) return "--";
    try {
      return new Date().toLocaleString("en-US", {
        timeZone: data.timezone,
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "--";
    }
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather Lookup</h1>

      <div className={`${show ? styles.cons : styles.consO}`}>
        <form onSubmit={handleW}>
          <div className={styles.fieldRow}>
            <label htmlFor="lat" className={styles.spacing}>Latitude</label>
            <input
              type="number"
              id="lat"
              step="any"
              className={styles.inputt}
              value={latitude}
              placeholder="e.g. 28.6"
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label htmlFor="lon" className={styles.spacing}>Longitude</label>
            <input
              type="number"
              id="lon"
              step="any"
              className={styles.inputt}
              value={longitude}
              placeholder="e.g. 77.2"
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.hello} disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </form>
      </div>

      {show && data && (
        <div className={styles.output}>
          <div className={styles.outputRow}>
            <span className={styles.opp}>Time:</span>
            <span>{getLocalTime()}</span>
          </div>
          <div className={styles.outputRow}>
            <span className={styles.opp}>Timezone:</span>
            <span>{data?.timezone || "--"}</span>
          </div>
          <div className={styles.outputRow}>
            <span className={styles.opp}>Temperature:</span>
            <span>
              {data?.current_weather?.temperature ??
                data?.hourly?.temperature_2m[getCurrentTempIndex()] ??
                "--"}
              {data?.current_weather_units?.temperature ||
                data?.hourly_units?.temperature_2m ||
                ""}
            </span>
          </div>
          <div className={styles.outputRow}>
            <span className={styles.opp}>Country:</span>
            <span>{countryName || "--"}</span>
          </div>
        </div>
      )}

      {show && (
        <div className={styles.mapers}>
          <MapContainer
            center={[latitude || 0, longitude || 0]}
            zoom={13}
            style={{ height: "350px", width: "100%", borderRadius: "16px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <UpdateMapCenter latitude={latitude} longitude={longitude} />
            <Marker position={[latitude, longitude]} />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default App;