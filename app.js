import axios from "axios";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const yarg = yargs(hideBin(process.argv));

const geocode = (place) => {
  const mapUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?country=id&proximity=ip&types=place%2Caddress%2Cdistrict%2Cregion%2Cneighborhood%2Clocality&language=id&access_token=pk.eyJ1IjoiaW1kemFpbiIsImEiOiJja3FrZW50aGczcTR0Mndtdjk5MzQ1b3oxIn0.WLhCCd0SIqCJ6cYuoBW4Rw`;
  return axios
    .get(mapUrl)
    .then((response) => {
      if (response?.data?.features != []) {
        return response?.data?.features[0];
      }
      return {};
    })
    .catch((error) => {
      return {};
    });
};

const forecast = (lon, lat) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f373819bc0306846013611d797e1adb8`;
  if (lon == 0 && lat == 0) return "place wasn't found";

  return axios
    .get(weatherUrl)
    .then((response) => {
      if (response?.data?.weather != []) {
        return response.data.weather[0];
      }

      return "weather can't be checked";
    })
    .catch((error) => {
      return "weather can't be checked";
    });
};

yarg.command({
  command: "weather",
  describe: "Weather check app",
  builder: {
    place: {
      describe: "Write the city or places that you want to check the weather",
      type: "string",
      demandOption: true,
    },
  },
  async handler(argv) {
    if (!argv.hasOwnProperty("place") || argv?.place == "") {
      console.error("place can't be empty");
      return false;
    }
    const place = await geocode(argv.place);
    const weather = await forecast(...place.center);

    await console.log(
      `Place:\n${place.place_name}\nWeather Condidtion: \n${weather.description}`
    );
  },
});

yarg.parse();
