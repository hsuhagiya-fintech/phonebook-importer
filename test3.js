class WeatherSimulator {
    constructor() {
        this.locations = new Map();
        this.currentSeason = this.getCurrentSeason();
        this.weatherPatterns = {
            spring: { tempRange: [5, 20], precipitation: 0.4, windRange: [5, 25] },
            summer: { tempRange: [15, 35], precipitation: 0.3, windRange: [3, 20] },
            autumn: { tempRange: [0, 15], precipitation: 0.5, windRange: [10, 30] },
            winter: { tempRange: [-10, 5], precipitation: 0.6, windRange: [15, 40] }
        };
    }

    addLocation(name, latitude, longitude, elevation = 0) {
        this.locations.set(name, {
            latitude,
            longitude,
            elevation,
            weatherHistory: []
        });
        return this.locations.get(name);
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    generateWeather(locationName, days = 1) {
        const location = this.locations.get(locationName);
        if (!location) throw new Error('Location not found');

        const forecasts = [];
        const pattern = this.weatherPatterns[this.currentSeason];
        
        for (let i = 0; i < days; i++) {
            const baseTemp = this.randomInRange(...pattern.tempRange);
            const elevationEffect = location.elevation * -0.0065; // -6.5°C per 1000m
            const finalTemp = Math.round(baseTemp + elevationEffect);
            
            const precipitation = Math.random() < pattern.precipitation;
            const precipitationType = finalTemp <= 0 ? 'snow' : 'rain';
            const precipitationAmount = precipitation ? this.randomInRange(1, 50) : 0;
            
            const windSpeed = this.randomInRange(...pattern.windRange);
            const windDirection = this.randomInRange(0, 359);
            
            const humidity = this.randomInRange(30, 100);
            const pressure = this.randomInRange(980, 1040);
            
            const forecast = {
                date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
                temperature: finalTemp,
                condition: this.getWeatherCondition(precipitation, finalTemp, humidity),
                precipitation: {
                    type: precipitationType,
                    amount: precipitationAmount
                },
                wind: {
                    speed: windSpeed,
                    direction: windDirection
                },
                humidity,
                pressure
            };
            
            forecasts.push(forecast);
            location.weatherHistory.push({ ...forecast, timestamp: new Date() });
        }
        
        return forecasts;
    }

    getWeatherCondition(precipitation, temperature, humidity) {
        if (precipitation) {
            return temperature <= 0 ? 'snowy' : 'rainy';
        }
        if (humidity > 80) return 'foggy';
        if (temperature > 30) return 'sunny';
        if (temperature < 0) return 'freezing';
        return 'cloudy';
    }

    randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    getWeatherHistory(locationName, limit = 10) {
        const location = this.locations.get(locationName);
        if (!location) throw new Error('Location not found');
        
        return location.weatherHistory.slice(-limit);
    }

    getTemperatureTrend(locationName, days = 7) {
        const history = this.getWeatherHistory(locationName, days);
        return history.map(entry => entry.temperature);
    }

    generateWeatherReport(locationName, days = 3) {
        const forecasts = this.generateWeather(locationName, days);
        let report = `Weather Forecast for ${locationName}:\n\n`;
        
        forecasts.forEach(forecast => {
            report += `${forecast.date}: ${forecast.temperature}°C, ${forecast.condition}\n`;
            report += `Precipitation: ${forecast.precipitation.amount}mm ${forecast.precipitation.type}\n`;
            report += `Wind: ${forecast.wind.speed.toFixed(1)} km/h from ${forecast.wind.direction}°\n`;
            report += `Humidity: ${forecast.humidity}%, Pressure: ${forecast.pressure}hPa\n\n`;
        });
        
        return report;
    }

    simulateSeasonChange() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(this.currentSeason);
        this.currentSeason = seasons[(currentIndex + 1) % seasons.length];
        return this.currentSeason;
    }
}

// Example usage:
// const weather = new WeatherSimulator();
// weather.addLocation('London', 51.5074, -0.1278, 35);
// weather.addLocation('Tokyo', 35.6762, 139.6503, 40);
// const forecast = weather.generateWeather('London', 3);
// console.log(weather.generateWeatherReport('London'));