let currentTime = new Date();
        let currentHour = currentTime.getHours();

        if(currentHour > 12) {
            currentHour = currentTime.getHours()-12;
        }

        let currentDate = currentTime.getDate();
        let currentMonth = currentTime.getMonth();
        let currentDateMonth = currentMonth + '' + currentDate;
        let weatherCode = '';
        let sunsetHour = '';
        let sunriseTimeGMT = '';
        let sunriseTimeEST= '';
        let sunsetTimeGMT = '';
        let sunsetTimeEST = '';
        let cityName = 'toronto';

        $('.city_search').click(function(){
            $('.city_name').html(`<input type="text" class="place_input" placeholder="search.." ><button class="place_search" type="submit"><i class="fas fa-search"></i></button>`);
            $('.city_search').empty();

            $('.place_search').click(function(){

                if($('.place_input').val() == undefined || $('.place_input').val() == ""){
                    alert('please type your city');
                    location.reload();
                }

                cityName = $('.place_input').val();
                
                $('.weather_icon').empty();
                $('.weather_forecast > div').empty();
                $('.city_search').html(`<i class="fas fa-bars"></i>`);
                weatherApp.init();
            })            
        })

        const weatherApp = {};
        weatherApp.init = function() {
            weatherApp.getCurrentWeather();
            weatherApp.getWeatherForecast();
            
        };

        $(function(){
            weatherApp.init();
        })

        weatherApp.getWeatherForecast = async () => {

            const countryCode = 'CA';
            const API_KEY = '6555e507cb2a46bda2444864effd5b1f';
            let weatherCon = '';

            try {
                const requestResult = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&country=${countryCode}&key=${API_KEY}`);
                const results = await requestResult.json();

                $('.weather_forecast > div').each(function(index){

                    weatherCon = results.data[index].weather.code.toString();
                    $(this).append(`${results.data[index].datetime}`);

                    if(weatherCon === "200" || weatherCon === "201" || weatherCon === "202" || weatherCon === "230" || weatherCon === "231" || weatherCon === "232" || weatherCon === "233") {
                        
                        $(this).append(`<i class="fas fa-bolt"></i>`);
                    }else if(weatherCon === "300" || weatherCon === "301" || weatherCon === "302" || weatherCon === "500" || weatherCon === "501" || weatherCon === "502" || weatherCon === "511"|| weatherCon === "520"|| weatherCon === "521"|| weatherCon === "522"|| weatherCon === "900") {
                        $(this).append(`<i class="fas fa-cloud-rain"></i>`);
                    }else if(weatherCon === "610" || weatherCon === "611" || weatherCon === "612") {                
                        $(this).append(`<i class="fas fa-cloud-showers-heavy"></i>`);
                    }else if(weatherCon === "600" || weatherCon === "601" || weatherCon === "602" || weatherCon === "621" || weatherCon === "622" || weatherCon === "623") {
                        $(this).append(`<i class="fas fa-snowflake"></i>`);
                    }else if(weatherCon === "700" || weatherCon === "711" || weatherCon === "721" || weatherCon === "731" || weatherCon === "741" || weatherCon === "751") {
                        $(this).append(`<i class="fas fa-smog"></i>`);
                    }else if(weatherCon === '800' || weatherCon === '801' ) {
                        $(this).append(`<i class="fas fa-sun"></i>`); 
                    }else if(weatherCon === "803" || weatherCon === "804" || weatherCon === '802') {
                        $(this).append(`<i class="fas fa-cloud"></i>`);
                    }

                    $(this).append(`<br> Max ${results.data[index].max_temp} °C  &nbsp; Min ${results.data[index].min_temp} °C`);
                    })


            } catch (err) {
                console.log(err);
            }

        }

        weatherApp.getCurrentWeather = async () => {

            let countryCode = 'CA';
            const API_KEY = '6555e507cb2a46bda2444864effd5b1f';
            let localTime = '';
            
            
            let currentDateMonth_num = parseInt(currentDateMonth)

            try {
                const requestResult = await fetch(`https://api.weatherbit.io/v2.0/current?city=${cityName}&country=${countryCode}&key=${API_KEY}`);
                const results = await requestResult.json();
                
                weatherCode = results.data[0].weather.code;
                sunriseTimeGMT = results.data[0].sunrise.split(":");
                sunsetTimeGMT = results.data[0].sunset.split(":");

                let timezone = results.data[0].timezone;
                let time_difference = 0;

                if(timezone === "America/Vancouver" || timezone === "America/Whitehorse") {
                    console.log(timezone);
                    time_difference = -3;
                }else if(timezone === "America/Edmonton" || timezone === "America/Yellowknife") {
                    time_difference = -2;
                }else if(timezone === "America/Winnipeg" || timezone === "America/Rankin_Inlet") {
                    time_difference = -1;
                }else if(timezone === "America/Montreal") {
                    time_difference = 0;
                }else if(timezone === "America/Halifax") {
                    time_difference = 1;
                }

                //daylight saving time
                if((0214 < currentDateMonth_num) && (currentDateMonth_num < 1001)) {
                    sunriseTimeEST = [sunriseTimeGMT[0]-4+time_difference, sunriseTimeGMT[1]];
                }else {
                    sunriseTimeEST = [sunriseTimeGMT[0]-5+time_difference, sunriseTimeGMT[1]];
                }

                 //daylight saving time
                if((0214 < currentDateMonth_num) && (currentDateMonth_num < 1001)) {
                    sunsetTimeEST = [sunsetTimeGMT[0]-4+time_difference, sunsetTimeGMT[1]];

                    if(sunsetTimeEST[0] == -1) {
                        sunsetTimeEST[0] = 11;
                    }else if(sunsetTimeEST[0] == -2) {
                        sunsetTimeEST[0] = 10;
                    }else if(sunsetTimeEST[0] == -3) {
                        sunsetTimeEST[0] = 9;
                    }else if(sunsetTimeEST[0] == -4) {
                        sunsetTimeEST[0] = 8;
                    }else if(sunsetTimeEST[0] == -5) {
                        sunsetTimeEST[0] = 7;
                    }else if(sunsetTimeEST[0] == -6) {
                        sunsetTimeEST[0] = 6;
                    }else if(sunsetTimeEST[0] == -7) {
                        sunsetTimeEST[0] = 5;
                    }
                }else {
                    sunsetTimeEST = [sunsetTimeGMT[0]-5+time_difference, sunsetTimeGMT[1]];
                    if(sunsetTimeEST[0] == -1) {
                        sunsetTimeEST[0] = 11;
                    }else if(sunsetTimeEST[0] == -2) {
                        sunsetTimeEST[0] = 10;
                    }else if(sunsetTimeEST[0] == -3) {
                        sunsetTimeEST[0] = 9;
                    }else if(sunsetTimeEST[0] == -4) {
                        sunsetTimeEST[0] = 8;
                    }else if(sunsetTimeEST[0] == -5) {
                        sunsetTimeEST[0] = 7;
                    }else if(sunsetTimeEST[0] == -6) {
                        sunsetTimeEST[0] = 6;
                    }else if(sunsetTimeEST[0] == -7) {
                        sunsetTimeEST[0] = 5;
                    }
                }

                if(sunsetTimeEST[0] > 12) {
                    sunsetHour = sunsetTimeEST[0]-12;
                }

                $('.city_name').text(results.data[0].city_name);
                $('.weather_description').text(results.data[0].weather.description);
                $('.current_temp').text(`${results.data[0].temp} °C (${((results.data[0].temp)*9/5 + 32).toFixed(1)} °F)`);
                $('.app_temp').text(`${results.data[0].app_temp} °C (${((results.data[0].app_temp)*9/5 + 32).toFixed(1)} °F)`);
                $('.sunrise').text(`${sunriseTimeEST[0]}:${sunriseTimeEST[1]} AM`);
                $('.sunset').text(`${sunsetHour}:${sunsetTimeEST[1]} PM`);
                $('.uv_index').text((results.data[0].uv).toFixed(1));
                $('.wind_speed').text(`${results.data[0].wind_spd} m/s`);
                $('.cloud_coverage').text(results.data[0].clouds);

            } catch (err) {
                console.log(err);
                alert("Please search proper city name. This service is only for Canada.");
                location.reload();
            }

            weatherApp.getPhotoByWeather();

        }

        let number = (Math.floor((Math.random() * 7) + 1));

        weatherApp.getPhotoByWeather = function() {
            const api_key = "563492ad6f91700001000001b328e07c43694cc1a0483e1333d8106f"
            let condition = ""
            let weatherCon = weatherCode.toString();

            // 200, 201, 202, 230, 231, 232, 233 = storm
            // 300, 301, 302, 500, 501, 502, 900 = rain
            // 610, 611, 612 = sleet, frost
            // 621, 622, 623 = snow
            // 700, 711, 721, 731, 741, 751 = haze, fog, smog
            // 800, 801 = sunny
            // 802  = half cloud
            // 803, 804 = cloudy
            
            if(weatherCon === "200" || weatherCon === "201" || weatherCon === "202" || weatherCon === "230" || weatherCon === "231" || weatherCon === "232" || weatherCon === "233") {
                condition = "storm"
                $('.weather_icon').append(`<i class="fas fa-bolt"></i>`);
            }else if(weatherCon === "300" || weatherCon === "301" || weatherCon === "302" || weatherCon === "500" || weatherCon === "501" || weatherCon === "502" || weatherCon === "511"|| weatherCon === "520"|| weatherCon === "521"|| weatherCon === "522"|| weatherCon === "900") {
                condition = "rain"
                $('.weather_icon').append(`<i class="fas fa-cloud-rain"></i>`);
            }else if(weatherCon === "610" || weatherCon === "611" || weatherCon === "612") {
                condition = "frost"
                $('.weather_icon').append(`<i class="fas fa-cloud-showers-heavy"></i>`);
            }else if(weatherCon === "600" || weatherCon === "601" || weatherCon === "602" || weatherCon === "621" || weatherCon === "622" || weatherCon === "623") {
                condition = "snow"
                $('.weather_icon').append(`<i class="fas fa-snowflake"></i>`);
            }else if(weatherCon === "700" || weatherCon === "711" || weatherCon === "721" || weatherCon === "731" || weatherCon === "741" || weatherCon === "751") {
                condition = "fog"
                $('.weather_icon').append(`<i class="fas fa-smog"></i>`);
            }else if(weatherCon === '800' || weatherCon === '801' ) {
                condition = "clear"
                
                if(currentTime.getHours() > sunsetTimeEST[0] || currentTime.getHours() < sunriseTimeEST[0]) {
                    $('.weather_icon').append(`<i class="fas fa-moon"></i>`);  
                }else {
                    $('.weather_icon').append(`<i class="fas fa-sun"></i>`);  
                }
                
            }else if(weatherCon === "803" || weatherCon === "804" || weatherCon === '802') {
                condition = "cloud"
                $('.weather_icon').append(`<i class="fas fa-cloud"></i>`);
            }

            if(currentTime.getHours() > sunsetTimeEST[0] || currentTime.getHours() < sunriseTimeEST[0]) {
                condition = condition + " night";  
                console.log('night');
            }

            $.ajax({
                method: "GET",
                beforeSend: function(xhr){
                    xhr.setRequestHeader("Authorization", api_key)
                },
                url: `https://api.pexels.com/v1/search?query=${condition}&per_page=10&page=1`,                
                dataType: 'json'

            }).then((result) => {
            $(".photo").css("background-image", `url(${result.photos[number].src.landscape})`);
            $(".photo").css("background-size", "cover");
            });
        }

        