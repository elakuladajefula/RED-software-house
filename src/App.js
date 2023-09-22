import './App.css';
import { useState } from "react";

class Weather {
  constructor(city, date, temperature) {
    this.city = city;
    this.date = date;
    this.temperature = temperature;
  }
}

function App() {
  const [city, searchCity] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = await collectData(city);
    if (data.length == 2) {
      console.log(data[0]);
      console.log(getDate());
      console.log(data[1]);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Search city:
        <input 
          type="text" 
          value={city}
          onChange={(e) => searchCity(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

async function collectData(city) {
  const apiUrl = "https://api.weatherapi.com/v1/current.json?key=3dfce0a016e541dbb87120605232209&q=";
  const fullUrl = apiUrl + city;
  const response = await fetch(fullUrl);
  const returnData = [];
  if (response.status == 200) {
    const data = await fetch(fullUrl).then((data) => data.json());
    const returnData = [data.location.name, data.current.temp_c];
    return returnData;
  } else {
    alert("Error fetching data");
    return returnData;
  }
}

function getDate() {
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  return year + "-" + month + "-" + day;
}

export default App;
