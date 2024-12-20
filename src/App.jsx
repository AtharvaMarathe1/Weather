import { useEffect, useState } from "react";
import styles from './App.module.css'
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
// import backgroundImg from './assets/sky.jpg';
// import Card from "./assets/Components/Card";








const App = () => {
  const [data, setData] = useState();
  const [data2, setData2] = useState();
  // const [cards, setCards] = useState(null)
  const [show, setShow] = useState(false);

  const[latitude, setLatitude] = useState("");
  const[longitude, setLongitude] = useState("");



  // const handleLatitude = (e) => {
  //   e.preventDefault();
  //   if(!latitude || !longitude){
  //     alert("lul")
  //     return
  //   }
  // }
    const handleW = async (e) => {
      e.preventDefault();
      if(!latitude || !longitude){
        alert("nub")
        return;
      }
      console.log(latitude, longitude);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
      const url2 = `http://api.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=dekudeku`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const response2 = await fetch(url2);
        if (!response2.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        const json2 = await response2.json();
        setData2(json2);
        
        setShow(true);
        // setShow(true);
        // console.log(json);
      } catch (error) {
        console.error(error.message);
      }
    }

    const UpdateMapCenter = () => {
      const map = useMap();
      useEffect(() => {
        map.setView([latitude, longitude], map.getZoom());
      }, [map]);
      return null;
    };



  
  // const formatDate = (date) => {
  //   if (!date) return "--";
  
  //   // Create a new Date object assuming the input is UTC
  //   const utcDate = new Date(date);
  
  //   // Format the date explicitly in UTC
  //   const options = { 
  //     timeZone: "UTC", 
  //     year: "numeric", 
  //     month: "2-digit", 
  //     day: "2-digit", 
  //     hour: "2-digit", 
  //     minute: "2-digit"
  //   };
    
  //   return utcDate.toLocaleString("en-US", options);
  // };

  
  return (
    <div className={styles.container}>
      {/* <img src="./sky.jpg" alt="Loading..." className={styles.skyy}/> */}
      <div className={`${show ? styles.cons :styles.consO}`} >
      
      {/* <script src="//unpkg.com/globe.gl"></script> */}

      {/* <form action=""> */}
        <div>
        <label htmlFor="" className={styles.spacing}>Latitude </label>
        <input type="number" name="" id="" className={styles.inputt} value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
        </div>
        <div>
        <label htmlFor="">HELLo</label>
        <label htmlFor="" className={styles.spacing2}>Longitude </label>
        <input type="number" name="" id="lon" className={styles.inputt2} value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
        </div>

        <button onClick={handleW} className={styles.hello}>Submit</button>
      
        {/* </form> */}
      {/* {cards.map((item, index) =>{return(
        <Card key={index} latitude={item.latitude} longitude={item.longitude} time={item.time} temperature={item.temperature} />
      );
      })} */}
      </div>
      {show && data && (<div className={styles.output}>
      {/* <div>
      {data?.latitude || "Loading..."}
      </div>
      {data?.longitude|| "Loading..."}
      <br /> */}
      <div>
      <label htmlFor="" className={styles.opp}>Time: </label>
      {/* {data?.hourly?.time[27] ? formatDate(data?.hourly?.time[27]) :"Loading..."} */}
      {data2?.time }
      </div>
      <div>
      <label htmlFor="" className={styles.opp}>Timezone: </label>
      {/* {data?.timezone || "Loading..."} */}
      {data2?.timezoneId || "Loading..."}
      </div>
      <div>
      <label htmlFor="" className={styles.opp}>Temperature: </label>
      {data?.hourly?.temperature_2m[28] || "Loading..."}
      {data?.hourly_units?.temperature_2m || "Loading..."}
      </div>
      <div>
      <label htmlFor=""  className={styles.opp}>Country: </label>
      {data2?.countryName || "Loading..."}
      </div>
      </div>
      )}
    {show && (<div className={styles.mapers}>
      <MapContainer               
        center={[latitude || 0, longitude || 0]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UpdateMapCenter latitude={latitude} longitude={longitude} />
        <Marker position={[latitude, longitude]}>

        </Marker>
      </MapContainer>
    </div>)}
  </div>
);
};

export default App;