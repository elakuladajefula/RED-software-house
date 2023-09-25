import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [rowsData, setRowsData] = useState([]);
  const [city, searchCity] = useState("");

  var jsonData = getDataFromStorage();
  jsonData = JSON.parse(jsonData);
  //on load read data saved from previous sessions
  useEffect(() => {
    if(jsonData !== undefined && jsonData !== '') {
      setRowsData([...rowsData, ...jsonData]);
    }
  }, []);
 
  //add new search to table and save to storage
  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = await collectData(city);
    if (data.length === 3) {
      let stored = localStorage.getItem(data[0]);
      if (stored === undefined || stored === '') {
        localStorage.setItem(data[0], 1);
      } else {
        stored++;
        localStorage.setItem(data[0], stored);
      }
      const rowsInput = {city: data[0], date: data[1], temperature: data[2]};
      setRowsData([...rowsData, rowsInput]);
      saveDataInStorage(jsonData, rowsInput);
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>Search city:
          <input 
            type="text" 
            value={city}
            onChange={(e) => searchCity(e.target.value)}
            className="formInput"
          />
        </label>
        <input type="submit" value="Search" className="submitBtn"/>
      </form>

      <table className="tableClass">
        <thead>
          <tr>
            <th>City</th>
            <th>Date</th>
            <th>Temperature</th>
            <th>Searched</th>
          </tr>
        </thead>
        {rowsData.map((val, key) => {
          return (
            <tbody>
              <tr key={key}>
                <td>{val.city}</td>
                <td>{val.date}</td>
                <td>{val.temperature} (st C)</td>
                <td>{localStorage.getItem(val.city)} time(s)</td>
              </tr>
            </tbody>
          )
        })}
      </table>
    </div>
  );
}

//collect data from api
async function collectData(city) {
  const apiUrl = "https://api.weatherapi.com/v1/current.json?key=3dfce0a016e541dbb87120605232209&q=";
  const fullUrl = apiUrl + city;
  const response = await fetch(fullUrl);
  const returnData = [];
  if (response.status === 200) {
    const data = await fetch(fullUrl).then((data) => data.json());
    const returnData = [data.location.name, data.current.last_updated.slice(0, 10), data.current.temp_c];
    return returnData;
  } else {
    alert("Error fetching data");
    return returnData;
  }
}

//get data from local storage
function getDataFromStorage() {
  let data = [];
  data = localStorage.getItem('weatherData');
  return data;
}

//save data to local storagedik
function saveDataInStorage(data, input) {
  let jsonData = [...data, input];
  localStorage.setItem('weatherData', JSON.stringify(jsonData))
};

export default App;