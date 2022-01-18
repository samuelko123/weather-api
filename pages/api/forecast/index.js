import axios from 'axios'

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
            },
            daily: data.daily.map(item => {
                return {
                    dt: item.dt,
                    min: item.temp.min,
                    max: item.temp.max,
                }
            }),
            hourly: data.hourly.map(item => {
                return {
                    dt: item.dt,
                    temp: item.temp,
                }
            })
        }

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
