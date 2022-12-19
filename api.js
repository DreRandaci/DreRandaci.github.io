'use-strict';

/** Class representing needed API's.
 * Although it is only used for the weather API for mvp, it can easily be extended to include other API domains and share common configurations.
*/
class API {
  WeatherAPI;
  constructor() {
    this.WeatherAPI = new WeatherAPI();
  }
}

class WeatherAPI {
  // TODO: hide API key
  #apiKey = '25e989bd41e3e24ce13173d8126e0fd6';
  #baseURI = 'https://api.openweathermap.org';

  // Note: only supporting US/imperial/eng for mvp. storing these as properties will allow easier refactoring later as requirements change (eng is the default, so not storing)
  #defaultUnits = 'imperial';
  #supportedCountryCodes = ['US'];

  constructor() { }

  /**
   * Fetches the lat/long for a given city and state (US support only)
   *
   * @param {{city: string, stateCode: string}} query - location options
   * @returns {Promise<{lat: string, lon: string}>} - geo request result
  */
  async getGeoCoordinates(query = {}) {
    // Adding try/catch to return optional custom errors vs. the caller handling all API and runtime errors
    try {
      const country = this.#supportedCountryCodes[0]; // see note about country support above
      const { city, stateCode } = query;
      const route = `${this.#baseURI}/geo/1.0/direct`;
      const params = {
        q: `${city},${stateCode},${country}`,
        limit: 1,
        appid: this.#apiKey
      };
      const { data } = await axios.get(`${route}`, { params });

      if (!data.length) {
        throw new Error('No results for provided query')
      }

      // The result is an array even when limit is set to 1
      const { lat, lon } = data[0];

      return { lat, lon }
    } catch (error) {
      // rethrow error to caller for handling
      throw error;
    }
  }

  /**
   * Fetches the lat/long for a given city and state (US support only)
   *
   * @param {{city: string, stateCode: string}} location - location for where to fetch the weather
   * @returns {Promise<{}>} - current weather result
  */
  async getCurrentWeather(location) {
    try {
      const latLon = await this.getGeoCoordinates(location);
      const route = `${this.#baseURI}/data/2.5/weather`;
      const params = {
        lat: latLon.lat,
        lon: latLon.lon,
        units: this.#defaultUnits,
        appid: this.#apiKey
      };
      const { data } = await axios.get(route, { params });

      return data;
    } catch (error) {
      // rethrow error to caller for handling
      throw error;
    }
  }
}