$(document).ready(function() {
    // Function to fetch weather data for a given city
    function fetchWeatherData(city) {
        var apiKey = 'ecce65277b7ef1b2acf2b7863bdcbe21'; // Replace 'YOUR_API_KEY' with your actual OpenWeather API key
        
        var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + apiKey;
        var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;
        
        // Fetch current weather data
        $.ajax({
            url: currentWeatherUrl,
            method: 'GET',
            success: function(currentResponse) {
                // Extract relevant current weather information
                var cityName = currentResponse.name;
                var currentDate = new Date(currentResponse.dt * 1000); // Convert Unix timestamp to milliseconds
                var formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
                var currentIconUrl = 'http://openweathermap.org/img/wn/' + currentResponse.weather[0].icon + '.png';
                var currentTemperature = currentResponse.main.temp;
                var currentWindSpeed = currentResponse.wind.speed;
                var currentHumidity = currentResponse.main.humidity;
                
                // Update HTML content for current weather
                $('#today').html(`
                    <div class="weather-info">
                        <h2>${cityName} (${formattedCurrentDate})</h2>
                        <img src="${currentIconUrl}" alt="Weather Icon">
                    </div>
                    <p>Temperature: ${currentTemperature}°F</p>
                    <p>Wind Speed: ${currentWindSpeed} mph</p>
                    <p>Humidity: ${currentHumidity}%</p>
                `);
                
                // Display current weather container
                $('#today').css('display', 'block');
                
                // Add searched city to history list and local storage
                addCityToHistory(cityName);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching current weather data:', error);
            }
        });
        
        // Fetch 5-day forecast data
        $.ajax({
            url: forecastUrl,
            method: 'GET',
            success: function(forecastResponse) {
                // Extract relevant forecast information
                var forecasts = forecastResponse.list;
                var forecastHtml = '';
                
                // Add heading for 5-Day Forecast
                forecastHtml += '<h3>5-Day Forecast:</h3>';
                
                for (var i = 7; i < forecasts.length; i += 8) {
                    var forecastDate = new Date(forecasts[i].dt * 1000);
                    var formattedForecastDate = `${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}`;
                    var forecastIconUrl = 'http://openweathermap.org/img/wn/' + forecasts[i].weather[0].icon + '.png';
                    var forecastTemperature = forecasts[i].main.temp;
                    var forecastWindSpeed = forecasts[i].wind.speed;
                    var forecastHumidity = forecasts[i].main.humidity;
                    
                    // Append forecast HTML
                    forecastHtml += `
                        <div class="forecast-item">
                            <h3>${formattedForecastDate}</h3>
                            <img src="${forecastIconUrl}" alt="Weather Icon">
                            <p>Temperature: ${forecastTemperature}°F</p>
                            <p>Wind Speed: ${forecastWindSpeed} mph</p>
                            <p>Humidity: ${forecastHumidity}%</p>
                        </div>
                    `;
                }
                
                // Update HTML content for forecast
                $('#forecast').html(forecastHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching forecast data:', error);
            }
        });
    }
    
    // Function to add a city to the history list and local storage
    function addCityToHistory(cityName) {
        // Retrieve existing cities from local storage
        var cities = JSON.parse(localStorage.getItem('cities')) || [];
        
        // Add the new city to the array if it doesn't already exist
        if (!cities.includes(cityName)) {
            cities.push(cityName);
            localStorage.setItem('cities', JSON.stringify(cities));
            
            // Update the history list
            $('<li>').text(cityName).appendTo('.history-list');
        }
    }

    // Function to load cities from local storage
    function loadCitiesFromLocalStorage() {
        var cities = JSON.parse(localStorage.getItem('cities')) || [];
        cities.forEach(function(city) {
            $('<li>').text(city).appendTo('.history-list');
        });
    }
    
    // Event listener for search button
    $('#search-button').click(function(event) {
        event.preventDefault(); // Prevent form submission
        var city = $('#search-value').val();
        fetchWeatherData(city);
    });
    
    // Event listener for history list items
    $('.history-list').on('click', 'li', function() {
        var city = $(this).text();
        fetchWeatherData(city);
    });

    // Load cities from local storage when the page is loaded
    loadCitiesFromLocalStorage();
    
});