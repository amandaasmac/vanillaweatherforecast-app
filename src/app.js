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
  return `${day} ${hours}:${minutes}`;
}

function formatForecastDay(timestamp) {
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
        <div class="forecast-day">${formatForecastDay(forecastDay.dt)}</div>
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

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  unitElement.innerHTML = "˚C";
  switchUnitElement.innerHTML = "˚F";

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#today-temp");
  celsiusTemperature = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = celsiusTemperature;

  let maxTempElement = document.querySelector("#today-max-temp");
  celsiusMaxTemperature = Math.round(response.data.main.temp_max);
  maxTempElement.innerHTML = celsiusMaxTemperature;

  let minTempElement = document.querySelector("#today-min-temp");
  celsiusMinTemperature = Math.round(response.data.main.temp_min);
  minTempElement.innerHTML = celsiusMinTemperature;

  let descriptionElement = document.querySelector("#today-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let feelsLikeElement = document.querySelector("#feelslike");
  celsiusFeelsLikeTemperature = Math.round(response.data.main.feels_like);
  feelsLikeElement.innerHTML = celsiusFeelsLikeTemperature;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windSpeedElement = document.querySelector("#windspeed");
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);

  let dateElement = document.querySelector("#current-dayandtime");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#today-icon");
  let iconId = response.data.weather[0].id;
  iconElement.setAttribute("src", `img/${iconId}d.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();

  let cityInputElement = document.querySelector("#search-input");
  searchCity(cityInputElement.value);
}

function calculateFahrenheitTemperature(celsiusTemp) {
  return Math.round((celsiusTemp * 9) / 5 + 32);
}

function switchUnit(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#today-temp");
  let maxTempElement = document.querySelector("#today-max-temp");
  let minTempElement = document.querySelector("#today-min-temp");
  let feelsLikeElement = document.querySelector("#feelslike");

  let fahrenheitTemperature =
    calculateFahrenheitTemperature(celsiusTemperature);
  let fahrenheitMaxTemperature = calculateFahrenheitTemperature(
    celsiusMaxTemperature
  );
  let fahrenheitMinTemperature = calculateFahrenheitTemperature(
    celsiusMinTemperature
  );
  let fahrenheitFeelsLikeTemperature = calculateFahrenheitTemperature(
    celsiusFeelsLikeTemperature
  );

  switch (switchUnitElement.innerHTML) {
    case "˚F":
      temperatureElement.innerHTML = fahrenheitTemperature;
      switchUnitElement.innerHTML = "˚C";
      maxTempElement.innerHTML = fahrenheitMaxTemperature;
      minTempElement.innerHTML = fahrenheitMinTemperature;
      feelsLikeElement.innerHTML = fahrenheitFeelsLikeTemperature;
      unitElement.innerHTML = "˚F";
      break;
    case "˚C":
      temperatureElement.innerHTML = celsiusTemperature;
      switchUnitElement.innerHTML = "˚F";
      maxTempElement.innerHTML = celsiusMaxTemperature;
      minTempElement.innerHTML = celsiusMinTemperature;
      feelsLikeElement.innerHTML = celsiusFeelsLikeTemperature;
      unitElement.innerHTML = "˚C";
      break;
  }
}

function getDevicePosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

function usePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

let apiKey = "f2a962d48c46d7fc23aca5910b2db6af";

let celsiusTemperature = null;
let celsiusMaxTemperature = null;
let celsiusMinTemperature = null;
let celsiusFeelsLikeTemperature = null;

let unitElement = document.querySelector("#temp-unit");
unitElement.innerHTML = "˚C";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let switchUnitElement = document.querySelector("#unit-switch");
switchUnitElement.addEventListener("click", switchUnit);

let locationButton = document.querySelector("#use-device-button");
locationButton.addEventListener("click", getDevicePosition);

searchCity("Rome");
