const getWeather =  () => {
    const apiKey = '31017f8dc610c817d2ed9313d3451612';//API key to openweathermap
    const city = document.getElementById('city').value;//Gets the value fromthe input element

    //checks if the input element is empty
    if(!city) {
        return alert('Please enter a city');
    }

    //defines the url you use to fetch 
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;


    //Api GET request for the current weather
    fetch(currentWeatherUrl).then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Error fetching current weather data!');
    }, networkError => alert(networkError.message)
).then(data => {
    displayWeather(data);
})

//GET reuquest for hourly forecast
fetch(foreCastUrl).then(response => {
    if(response.ok) {
        return response.json();
    }
    throw new Error('Error fetching hourly forecast data. Please try again!');
},networkError => alert(networkError.message)
).then(data => {
    displayHourlyForecast(data.list);
})
}

//Function responsible for updating the HTML with info about current weather based on the data from the API
const displayWeather = (data) => {
//Get reference to HTML elements where weather will be displayed
const tempDivInfo = document.getElementById('temp-div');
const weatherInfoDiv = document.getElementById('weather-info');
const weatherIcon = document.getElementById('weather-icon');
const hourlyForecastDiv = document.getElementById('hourly-forecast');

//Clear previous content
tempDivInfo.innerHTML='';
weatherInfoDiv.innerHTML = '';
hourlyForecastDiv.innerHTML = '';

//Checks if there is an error code in received data from weatherInfoDiv
if(data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`
} else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); //Converts the temperature to celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHTML = `
    <p>${cityName}</p>
    <p>${description}</p>`

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
}
}

const displayHourlyForecast = (hourlyData) => {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24hours = hourlyData.slice(0, 8);//Slices 24hourly data into 3 hours intervals

    next24hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
        <div class = "hourly-item">
        <span>${hour}:00</span>
        <img src ="${iconUrl}" alt= "Hourly Weather Icon">
        <span>${temperature}°C</span>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
    console.log(typeof hourlyData)
}

const showImage = () => {
    const  weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}