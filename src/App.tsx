import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Favorites from "./components/Favorites";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

//export default App;

class App extends Component {
  state = {
    weatherData: {
      weather: "",
      city: "",
      country: "",
      temp: 0,
    },
    searchDone: false,
    savedCities: [],
    hasSavedCities: false,
    errorMessage: "",
  };

  constructor(props: any) {
    super(props);    

    this.callWeatherData = this.callWeatherData.bind(this);
    this.updateSavedCities = this.updateSavedCities.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //this.reverseGeocoding(position.coords.latitude, position.coords.longitude);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=034a228bf950af8c9eef368a69f8a99d&lang=en`;
        fetch(url)
          .then(handleErrors)
          .then((resp) => resp.json())
          .then((data) => {
            const weatherObj = {
              weather: data.weather,
              city: data.name,
              country: data.sys.country,
              temp: data.main.temp,
            };
            this.setState({
              weatherData: weatherObj,
              searchDone: true,
              errorMessage: "",
            });
          })
          .catch((error) => {
            // If an error is catch, it's sent to SearchBar as props
            this.setState({ errorMessage: error.message });
          });

        function handleErrors(response: any) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        }
      },
      (err) => {
        console.error(`ERROR(${err.code}): ${err.message}`);
        //getCoordinatesByIP();
      },
      {
        timeout: 6000,
        enableHighAccuracy: false,
      }
    );
  }

  callWeatherData(city: string) {
    //const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=034a228bf950af8c9eef368a69f8a99d`;
    fetch(url)
      .then(handleErrors)
      .then((resp) => resp.json())
      .then((data) => {
        const weatherObj = {
          weather: data.weather,
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
        };
        this.setState({
          weatherData: weatherObj,
          searchDone: true,
          errorMessage: "",
        });

        console.log("data", data);
      })
      .catch((error) => {
        // If an error is catch, it's sent to SearchBar as props
        this.setState({ errorMessage: error.message });
      });

    function handleErrors(response: any) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }
  }

  updateSavedCities(cityArr: []) {
    // hasCities is set to true if length is more than 0, otherwise false
    const hasCities = cityArr.length > 0;
    this.setState({ savedCities: cityArr, hasSavedCities: hasCities });
  }

  componentWillMount() {
    // See if there's saved cities in localStorage before the App is mounted
    // Tests didn't like parsing when localStorage.getItem was undefined, so this was my solution for it
    let existingCities = JSON.parse(localStorage.getItem("cityList") || "[]");

    if (existingCities.length !== 0) {
      this.setState({
        hasSavedCities: true,
        savedCities: existingCities,
      });
    }
  }

  render() {
    const {
      searchDone,
      weatherData,
      hasSavedCities,
      savedCities,
      errorMessage,
    } = this.state;

    return (
      <div className="App">
        <SearchBar
          callBackFromParent={this.callWeatherData}
          callBackForGeoLocation={this.getLocation}
          error={errorMessage}
        />        
        {searchDone && (
          <WeatherCard
            weatherData={weatherData}
            savedCities={savedCities}
            callBackFromParent={this.updateSavedCities}
          />
        )}
        {hasSavedCities && (
          <Favorites
            savedCities={savedCities}
            callBackFromParent={this.callWeatherData}
          />
        )}
      </div>
    );
  }
}

export default App;
