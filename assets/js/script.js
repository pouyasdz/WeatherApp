class Service {
    #openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5";
    #countriesBaseUrl = "https://countriesnow.space/api/v0.1";
    #apiKey = "879c5b548bf0d3fe010486591670a747"; 

    async getAllCountry(){
        try {
            const response = await fetch(this.#countriesBaseUrl + "/countries/positions");
            const countries = await response.json();
            if(countries.error) throw countries;
            return countries;
        } catch (error) {
            throw error;   
        }
    }

    async getAllCityByCountry(country){
        try {
            const response = await fetch(this.#countriesBaseUrl + `/countries/cities/q?country=${country}`);
            const cities = await response.json();
            if(cities.error) throw cities;
            return cities;
        } catch (error) {
            throw error;
        }
    }

    async getCurrent(city, country){
        try {
            const response = await fetch(this.#openWeatherBaseUrl + `/weather?q=${city},${country}&appid=${this.#apiKey}&unit=metric`);
            const weather = await response.json();
            if(weather.error) throw weather;
            return weather;
        } catch (error) {
            throw error;
        }
    }

}

const serv = new Service(); 