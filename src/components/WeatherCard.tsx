import React, { Component } from "react";
import "../css/WeatherCard.css";
import "../css/weather-icons.min.css";
import { Button } from "semantic-ui-react";

export interface Props {
  weatherData: any;
  savedCities: any[];
  callBackFromParent: (cityArr: []) => void;
}

class WeatherCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.saveDataToLocalStorage = this.saveDataToLocalStorage.bind(this);
    this.deleteDataFromLocalStorage =
      this.deleteDataFromLocalStorage.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  deleteDataFromLocalStorage() {
    // var retrievedObject = localStorage.getItem("cityList");
    // const existingCities = JSON.parse(retrievedObject != null ? retrievedObject : "");
    const existingCities = JSON.parse(localStorage.getItem("cityList") || "{}");
    const indexOfCity = existingCities.indexOf(this.props.weatherData.city);

    existingCities.splice(indexOfCity, 1);
    localStorage.setItem("cityList", JSON.stringify(existingCities));
    this.props.callBackFromParent(existingCities);
  }

  saveDataToLocalStorage() {
    // Get data from LocalStorage if there is any and push back with new city
    //const existingCities = JSON.parse(localStorage.getItem("cityList")) || [];
    const existingCities = JSON.parse(localStorage.getItem("cityList") || "[]");

    existingCities.push(this.props.weatherData.city);
    localStorage.setItem("cityList", JSON.stringify(existingCities));
    this.props.callBackFromParent(existingCities);
  }

  downloadFile() {
    const { city, weather, country, temp } = this.props.weatherData;
    const celcius = Math.round(temp - 273.15);
    const content = `${country}, ${celcius}°, ${weather[0].main}`;

    const byteString = window.atob(
      window.btoa(content)
    );
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    let blob = new Blob([int8Array]);

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = data;

    link.download = "Weather Data.txt";
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );

    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  render() {
    const { city, weather, country, temp } = this.props.weatherData;
    const celcius = Math.round(temp - 273.15);
    const saveBtn = (
      <Button
        positive
        size="mini"
        onClick={this.saveDataToLocalStorage}
        content="Save to favorites"
      />
    );
    const deleteBtn = (
      <Button
        negative
        size="mini"
        onClick={this.deleteDataFromLocalStorage}
        content="Delete from favorites"
      />
    );
    const saveFileBtn = (
      <Button
        positive
        size="mini"
        onClick={this.downloadFile}
        content="Save file"
      />
    );
    const existingCities = this.props.savedCities;

    return (
      <div className="WeatherCard">
        <h1 className="WeatherCard-degrees">{celcius}°</h1>
        <div className="WeatherCard-icon-container">
          <i className={`wi wi-owm-${weather[0].id} WeatherCard-icon`} />
          <p>{weather[0].main}</p>
        </div>
        <h2 className="WeatherCard-city">
          {city}, {country}
        </h2>
        {existingCities.includes(city) ? deleteBtn : saveBtn}
        {saveFileBtn}
      </div>
    );
  }
}

export default WeatherCard;
