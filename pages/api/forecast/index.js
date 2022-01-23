import axios from 'axios'

const iconMapping = {
    Clear: 'weather-sunny',
    Clouds: 'weather-cloudy',
    Rain: 'weather-rainy',
    Drizzle: 'weather-partly-rainy',
    Thunderstorm: 'weather-lightning',
    Snow: 'weather-snowy',
    Fog: 'weather-fog',
    Squall: 'weather-windy',
    Tornado: 'weather-hurricane',
    Mist: 'weather-hazy',
    Smoke: 'weather-hazy',
    Haze: 'weather-hazy',
    Dust: 'weather-hazy',
    Sand: 'weather-hazy',
    Ash: 'weather-hazy',
}

function convertWindDegToText(degree) {
    if (degree > 337.5) return 'N'
    if (degree > 292.5) return 'NW'
    if (degree > 247.5) return 'W'
    if (degree > 202.5) return 'SW'
    if (degree > 157.5) return 'S'
    if (degree > 122.5) return 'SE'
    if (degree > 67.5) return 'E'
    if (degree > 22.5) return 'NE'
    return 'N'
}

export default async function handler(req, res) {
    const { lat, lon } = req.query

    try {
        if (!lat) {
            res.status(400).json({ error: "Missing 'lat' parameter" })
            return
        } else if (isNaN(parseFloat(lat))) {
            res.status(400).json({ error: `Invalid 'lat' parameter - ${lat}` })
            return
        }

        if (!lon) {
            res.status(400).json({ error: "Missing 'lon' parameter" })
            return
        } else if (isNaN(parseFloat(lon))) {
            res.status(400).json({ error: `Invalid 'lat' parameter - ${lon}` })
            return
        }

        const url = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.API_KEY_WEATHER}&lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric`
        const res_weather = await axios.get(url)
        const data = await res_weather.data

        const result = {
            current: [data.current].map(item => {
                return {
                    dt: item.dt,
                    humidity: item.humidity,
                    sunrise: item.sunrise,
                    sunset: item.sunset,
                    temp: item.temp,
                    temp_feels_like: item.feels_like,
                    uv_index: item.uvi,
                    weather_icon: iconMapping[item.weather[0].main],
                    weather_short_desc: item.weather[0].main,
                    wind_direction: convertWindDegToText(item.wind_deg),
                    wind_gust: item.wind_gust,
                    wind_speed: item.wind_speed,
                }
            })[0],
            hourly: data.hourly.map(item => {
                return {
                    dt: item.dt,
                    rain: item.rain ? item.rain['1h'] : 0,
                    temp: item.temp,
                    temp_feels_like: item.feels_like,
                    weather_icon: iconMapping[item.weather[0].main],
                }
            }),
            daily: data.daily.map(item => {
                return {
                    dt: item.dt,
                    humidity: item.humidity,
                    rain: item.rain || 0,
                    sunrise: item.sunrise,
                    sunset: item.sunset,
                    temp_max: item.temp.max,
                    temp_min: item.temp.min,
                    uv_index: item.uvi,
                    weather_icon: iconMapping[item.weather[0].main],
                    weather_short_desc: item.weather[0].main,
                    wind_direction: convertWindDegToText(item.wind_deg),
                    wind_gust: item.wind_gust,
                    wind_speed: item.wind_speed,
                }
            }),
        }

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.toString() })
    }
}
