let apiKey = "f2a962d48c46d7fc23aca5910b2db6af";
let units = "metric";
let city = "Rome";

let unitElement = document.querySelector("#temp-unit");
unitElement.innerHTML = "˚C";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let switchUnitElement = document.querySelector("#unit-switch");
switchUnitElement.addEventListener("click", switchUnit);

let locationButton = document.querySelector("#use-device-button");
locationButton.addEventListener("click", getDevicePosition);

searchCity(city);

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let day = days[date.getDay()];

  return day;
}

function handleSubmit(event) {
  event.preventDefault();

  let cityInputElement = document.querySelector("#search-input");
  city = cityInputElement.value;
  searchCity(city);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#today-temp");
  temperature = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = temperature;

  let maxTempElement = document.querySelector("#today-max-temp");
  maxTemperature = Math.round(response.data.main.temp_max);
  maxTempElement.innerHTML = maxTemperature;

  let minTempElement = document.querySelector("#today-min-temp");
  minTemperature = Math.round(response.data.main.temp_min);
  minTempElement.innerHTML = minTemperature;

  let descriptionElement = document.querySelector("#today-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let feelsLikeElement = document.querySelector("#feelslike");
  feelsLikeTemperature = Math.round(response.data.main.feels_like);
  feelsLikeElement.innerHTML = feelsLikeTemperature;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windSpeedElement = document.querySelector("#windspeed");
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);

  let dateElement = document.querySelector("#current-dayandtime");
  dateElement.innerHTML = `${formatDay(response.data.dt)} ${formatDate(
    response.data.dt * 1000
  )}`;

  let iconElement = document.querySelector("#today-icon");
  let iconId = response.data.weather[0].id;
  iconElement.setAttribute("src", `img/${iconId}d.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = ``;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 8) {
      forecastHTML =
        forecastHTML +
        `
      <div class="daily-forecast">
        <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
        <div>
          <span class="forecast-max-temp">${Math.round(
            forecastDay.temp.max
          )}˚</span>|
          <span class="forecast-min-temp">${Math.round(
            forecastDay.temp.min
          )}˚</span>
        </div>
        <img
          src="img/${forecastDay.weather[0].id}d.png"
          alt="${forecastDay.weather[0].description}"
        />
      </div>
    `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function switchUnit(event) {
  event.preventDefault();

  let speedUnitElement = document.querySelector("#speed-unit");
  let cityElement = document.querySelector("#city");
  let currentCity = cityElement.innerHTML;

  switch (switchUnitElement.innerHTML) {
    case "˚F":
      switchUnitElement.innerHTML = "˚C";
      unitElement.innerHTML = "˚F";
      speedUnitElement.innerHTML = "mi/h";
      units = "imperial";
      searchCity(currentCity);

      break;
    case "˚C":
      switchUnitElement.innerHTML = "˚F";
      unitElement.innerHTML = "˚C";
      speedUnitElement.innerHTML = "km/h";
      units = "metric";
      searchCity(currentCity);

      break;
  }
}

function getDevicePosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

function usePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  if (unitElement.innerHTML === "˚C") {
    units = "metric";
  } else {
    units = "imperial";
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
}
