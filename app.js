const inputBox = document.querySelector('.input');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weatherImg');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('windSpeed');
const list_content = document.querySelector('.list-content ul');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weatherBody');

const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

const api_key = "61bf0abca2ea1b1613aefcb265b32514";

async function checkWeather(city){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${weatherUrl}`).then(response => response.json());  

    if(weather_data.cod === '404'){
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        list_content.style.display="none";
        console.log("error");
        return;
    }
    
    list_content.style.display="flex";
    weather_body.style.display = "flex";
    location_not_found.style.display = "none";
    

    //convert to celsius
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;  
    description.innerHTML = `${weather_data.weather[0].description}`;  

    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/Hr`;


    switch(weather_data.weather[0].main){
        case 'Clear':
            weather_img.src="images/sun.png";
            break;
        case 'Rain':
            weather_img.src = "images/rain.png";
            break;
        case 'Mist':
            weather_img.src = "images/mist.png";
            break;
        case 'Snow':
            weather_img.src = "images/snow.png";
            break;
        case 'Clouds':
            weather_img.src = "images/cloud.png";
            break;
    }

    const lat = weather_data.coord.lat;
    const lon = weather_data.coord.lon;
    await displayForeCast(lat, lon);
}


async function displayForeCast(lat, long) {
    list_content.innerHTML = ""; // clear the previous forecast data
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${api_key}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
  
    const daysForecast = result.list.reduce((acc, current) => {
      const day = new Date(current.dt_txt);
      const dayKey = day.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!acc[dayKey]) {
        acc[dayKey] = [current];
      } else {
        acc[dayKey].push(current);
      }
      return acc;
    }, {});
  
    Object.keys(daysForecast).forEach((dayKey) => {
      const dayForecast = daysForecast[dayKey][0];
      list_content.insertAdjacentHTML("beforeend", forecast(dayForecast));
    });
  }
  
  function forecast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayOfWeek = day.toLocaleDateString("en-US", { weekday: "short" });
  
    return `<li>
      <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" />
      <span>${dayOfWeek}</span>
      <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
    </li>`;
  }

searchBtn.addEventListener('click', ()=>{
    checkWeather(inputBox.value);
});