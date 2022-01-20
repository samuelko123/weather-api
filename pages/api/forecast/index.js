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

        const url = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.API_KEY_WEATHER}&lat=${lat}&lon=${lon}&exclude=minutely,alerts,&units=metric`
        const res_weather = await axios.get(url)
        const data = await res_weather.data

        const result = {
            current: {
                dt: data.current.dt,
                temp: data.current.temp,
                icon: iconMapping[data.current.weather[0].main],
            },
            hourly: data.hourly.map(item => {
                return {
                    dt: item.dt,
                    temp: item.temp,
                    icon: iconMapping[item.weather[0].main],
                }
            }),
            daily: data.daily.map(item => {
                return {
                    dt: item.dt,
                    min: item.temp.min,
                    max: item.temp.max,
                    icon: iconMapping[item.weather[0].main],
                }
            }),
        }

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
