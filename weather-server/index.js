const express = require("express");
const axios = require("axios");
const url = require("url");
const querystring = require("querystring");
const moment = require("moment-timezone");
require("dotenv").config();
const app = express();

const setWindScale = (windspeed) => {
  if (windspeed < 0.5) {
    return 0;
  } else if (windspeed <= 1.5) {
    return 1;
  } else if (windspeed <= 3.3) {
    return 2;
  } else if (windspeed <= 5.5) {
    return 3;
  } else if (windspeed <= 7.9) {
    return 4;
  } else if (windspeed <= 10.7) {
    return 5;
  } else if (windspeed <= 13.8) {
    return 6;
  } else if (windspeed <= 17.1) {
    return 7;
  } else if (windspeed <= 20.7) {
    return 8;
  } else if (windspeed <= 24.4) {
    return 9;
  } else if (windspeed <= 28.4) {
    return 10;
  } else if (windspeed <= 32.6) {
    return 11;
  } else if (windspeed > 32.6) {
    return 12;
  }
};

const getCondition = (weather) => {
  console.log(weather);
  if (weather.id === 800) {
    // return "clear";
    return 0;
  } else if (weather.id < 300) {
    // return "thunderstorm";
    return 1;
  } else if (weather.id < 500) {
    // return "shower rain";
    return 2;
  } else if (weather.id < 505) {
    // return "rain";
    return 3;
  } else if (weather.id === 511) {
    // return "snow";
    return 4;
  } else if (weather.id < 600) {
    // return "shower rain";
    return 2;
  } else if (weather.id < 700) {
    // return "snow";
    return 4;
  } else if (weather.id < 800) {
    // return "mist";
    return 5;
  } else {
    if (weather.id === 801) {
      // return "few clouds";
      return 6;
    } else if (weather.id === 802) {
      // return "scattered clouds";
      return 7;
    } else if (weather.id === 803) {
      // return "broken clouds";
      return 8;
    } else {
      // return "overcast clouds";
      return 9;
    }
  }
};

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/test", (req, res) => {
  res.send({
    temp: 25.7,
    weather: "sunny",
  });
});

app.get("/hcmc", (req, res) => {
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/onecall?lat=10.762622&lon=106.660172&exclude=minutely,alert&units=metric&appid=" +
        process.env.OPEN_WEATHER_API_KEY
    )
    .then((data) => {
      let condition;
      let temp;
      let maxtemp;
      let mintemp;
      let windspeed;
      switch (req.query.time) {
        case "now":
          condition = getCondition(data.data.current.weather[0]);
          temp = data.data.current.temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "nexthour":
          condition = getCondition(data.data.hourly[1].weather[0]);
          temp = data.data.hourly[1].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "sixhour":
          condition = getCondition(data.data.hourly[6].weather[0]);
          temp = data.data.hourly[6].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "twelvehour":
          condition = getCondition(data.data.hourly[12].weather[0]);
          temp = data.data.hourly[12].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "tomorrow":
          let nowtz = Number(moment().tz("Asia/Ho_Chi_Minh").format("HH"));
          let tmrtime;
          if (0 <= nowtz && nowtz <= 8) {
            tmrtime = "morn";
          } else if (8 < nowtz && nowtz <= 16) {
            tmrtime = "day";
          } else {
            tmrtime = "eve";
          }
          console.log(nowtz, tmrtime);
          condition = getCondition(data.data.daily[1].weather[0]);
          mintemp = data.data.daily[1].temp["min"];
          maxtemp = data.data.daily[1].temp["max"];
          temp = (mintemp + maxtemp) / 2;
          windspeed = setWindScale(data.data.current.wind_speed);
          break;
        default:
          break;
      }
      toSend = {
        temp: Math.round(temp),
        maxtemp: Math.round(maxtemp),
        mintemp: Math.round(mintemp),
        windspeed: windspeed,
        weather: condition,
      };
      res.send(toSend);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/helsinki", (req, res) => {
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/onecall?lat=60.192059&lon=24.945831&exclude=minutely,alerts&units=metric&appid=" +
        process.env.OPEN_WEATHER_API_KEY
    )
    .then((data) => {
      let condition;
      let temp;
      let maxtemp;
      let mintemp;
      let windspeed;
      switch (req.query.time) {
        case "now":
          condition = getCondition(data.data.current.weather[0]);
          temp = data.data.current.temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "twohour":
          condition = getCondition(data.data.hourly[2].weather[0]);
          temp = data.data.hourly[2].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "sevenhour":
          condition = getCondition(data.data.hourly[7].weather[0]);
          temp = data.data.hourly[7].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "twelvehour":
          condition = getCondition(data.data.hourly[12].weather[0]);
          temp = data.data.hourly[12].temp;
          windspeed = setWindScale(data.data.current.wind_speed);
          mintemp = temp;
          maxtemp = temp;
          break;
        case "tomorrow":
          let nowtz = Number(moment().tz("Europe/Helsinki").format("HH"));
          let tmrtime;
          if (0 <= nowtz && nowtz <= 8) {
            tmrtime = "morn";
          } else if (8 < nowtz && nowtz <= 16) {
            tmrtime = "day";
          } else {
            tmrtime = "eve";
          }
          console.log(nowtz, tmrtime);
          console.log(data);
          condition = getCondition(data.data.daily[1].weather[0]);
          temp = data.data.daily[1].temp[tmrtime];
          mintemp = data.data.daily[1].temp["min"];
          maxtemp = data.data.daily[1].temp["max"];
          windspeed = setWindScale(data.data.current.wind_speed);
          break;
        default:
          break;
      }
      toSend = {
        temp: Math.round(temp),
        maxtemp: Math.round(maxtemp),
        mintemp: Math.round(mintemp),
        windspeed: windspeed,
        weather: condition,
      };
      res.send(toSend);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/nursultan", (req, res) => {
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/onecall?lat=51.169392&lon=71.449074&exclude=minutely,hourly,daily,alerts&units=metric&appid=" +
        process.env.OPEN_WEATHER_API_KEY
    )
    .then((data) => {
      toSend = {
        temp: data.data.current.temp,
        weather: data.data.current.weather[0].main,
      };
      res.send(toBeSend);
      data.data.hourly.forEach(console.log);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
