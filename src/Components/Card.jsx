import styles from "./Card.module.css"

const Card = () => {

    return(
        <div className={styles.container}>
        <div className={styles.text}>
          {/* <div > */}
          <label htmlFor=""><em>Latitude: </em></label>
          {props.data?.latitude || "Loading..."}
          {/* </div> */}
          
          {/* <div> */}
          <label htmlFor="" ><em>Longitude: </em></label>
          {props.data?.longitude }
          {/* </div> */}
          
          {/* <div> */}
          <label htmlFor="" ><em>Time: </em></label>
          {props.data?.hourly?.time[5] }
          {/* </div> */}
          
          {/* <div> */}
          
          <label htmlFor="" ><em>Temperature: </em></label>
          {props.data?.hourly?.temperature_2m[5]  }
          {props.data?.hourly_units.temperature_2m}
          
          {/* </div> */}
        </div>
      </div>
    );
}

export default Card