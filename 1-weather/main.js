async function getCityCode(input) {
  let url =
    'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=TU9LmNyi71HeS02AKxOuYBaQCmauLdKQ&q=';
  url += input;
  console.log(url);
  let cityCode;

  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.length == 0) {
        error.innerHTML = `${input} is not a valid city name`;
        return;
      }
      const key = data[0]['Key'];
      localStorage.setItem('cityCode', key);
      cityCode = key;
    });
  return cityCode;
}

async function getConditions(code) {
  let url =
    'http://dataservice.accuweather.com/currentconditions/v1/' +
    code +
    '?apikey=TU9LmNyi71HeS02AKxOuYBaQCmauLdKQ';
  let conditions = {};
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      conditions.temperature = data[0]['Temperature']['Imperial']['Value'];
      conditions.condition = data[0]['WeatherText'];
      conditions.day = data[0]['IsDayTime'];
      conditions.rain = data[0]['HasPrecipitation'];
    });
  return conditions;
}

function clearError() {
  error.innerHTML = '';
}

function searchCity() {
  clearError();
  const input = document.getElementById('cityInput').value;
  getCityCode(input).then((code) => {
    console.log(code);
    getConditions(code).then((conditions) => {
      form.innerHTML = '';
      symbols = '';
      if (!conditions.day) {
        symbols += '🌝';
      } else {
        symbols += '☀️';
      }
      if (conditions.rain) {
        symbols += '☔️';
      }
      cityText.innerHTML = `${input} ${symbols}`;
      temperatureText.innerHTML = `${conditions.temperature} ℉`;
      conditionText.innerHTML = conditions.condition;
      console.log(conditions);
    });
  });
  event.preventDefault();
}

const error = document.getElementById('error');

const form = document.getElementById('cityForm');

const cityText = document.getElementById('cityName');
const temperatureText = document.getElementById('temperature');
const conditionText = document.getElementById('condition');

form.addEventListener('submit', searchCity, true);
