const countiries = document.querySelector("#countiries");
const cities = document.querySelector("#cities");
const inpCountry = document.querySelector(".country-input");
const inpCity = document.querySelector(".city-input");
const locationBtn = document.querySelector(".location-btn");
const menuBtn = document.querySelector(".menu-btn");

class Service {
  #openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5";
  #countriesBaseUrl = "https://countriesnow.space/api/v0.1";
  #apiKey = "879c5b548bf0d3fe010486591670a747";

  async getAllCountry() {
    try {
      const response = await fetch(
        this.#countriesBaseUrl + "/countries/positions"
      );
      const countries = await response.json();
      if (countries.error) throw countries;
      return countries;
    } catch (error) {
      throw error;
    }
  }

  async getAllCityByCountry(country) {
    try {
      const response = await fetch(
        this.#countriesBaseUrl + `/countries/cities/q?country=${country}`
      );
      const cities = await response.json();
      if (cities.error) throw cities;
      return cities;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentTemp(city, country) {
    try {
      const response = await fetch(
        this.#openWeatherBaseUrl +
          `/weather?q=${city},${country}&appid=${this.#apiKey}&units=metric`
      );
      const weather = await response.json();
      if (weather.error) throw weather;
      return weather;
    } catch (error) {
      throw error;
    }
  }
}

function renderData(city, country) {
  serv.getCurrentTemp(city, country).then((res) => {
    switch (res.weather[0].main) {
      case "Clouds":
        document.querySelector("#cloud-status").src =
          "./assets/public/icons/clouds.svg";
        break;

      case "Clear":
        document.querySelector("#cloud-status").src =
          "./assets/public/icons/sun.svg";
        break;

      case "Rain":
        document.querySelector("#cloud-status").src =
          "./assets/public/icons/sun-clouds-rain.svg";
        break;

      default:
        break;
    }
    document.querySelector("#main-temp").innerHTML =
      Math.floor(res.main.temp) + "°";
    document.querySelector(
      "#position"
    ).innerHTML = `${res.sys.country}, ${res.name}`;
    document.querySelector("#wind-speed").innerHTML = res.wind.speed;
    document.querySelector("#dioxide").innerHTML = 0.0;
    document.querySelector("#rain").innerHTML = `${res.clouds.all}%`;
    document.querySelector("#uv").innerHTML = 0.0;
    document.querySelector("#temp").innerHTML = res.main.feels_like;
    document.querySelector("#ozone").innerHTML = 0.0;
  });
}

function changeLocation() {
  locationBtn.classList.add("hidden");
  menuBtn.classList.add("hidden");
  inpCountry.classList.remove("hidden");
  inpCity.classList.remove("hidden");
}
function hideLocation() {
  locationBtn.classList.remove("hidden");
  menuBtn.classList.remove("hidden");
  inpCountry.classList.add("hidden");
  inpCity.classList.add("hidden");
}
const serv = new Service();
const sesstionStorage = "position";

serv.getAllCountry().then((res) => {
  countiries.innerHTML = null;
  res.data.forEach((country) => {
    countiries.innerHTML += `<option value="${
      country.iso2 === "IR" ? "Iran" : country.name
    }">${country.iso2 === "IR" ? "Iran" : country.name}</option>`;
  });
});

if (window.sessionStorage.getItem(sesstionStorage)) {
  const data = JSON.parse(window.sessionStorage.getItem(sesstionStorage));
  renderData(data.city, data.country);
}

inpCountry.addEventListener("click", () => (inpCountry.value = ""));
inpCity.addEventListener("keypress", (e) => {
  if (e.keyCode != 13) return;
  const position = {
    country: inpCountry.value,
    city: inpCity.value,
  };
  window.sessionStorage.setItem(sesstionStorage, JSON.stringify(position));
  renderData(position.city, position.country);
  hideLocation();
});
