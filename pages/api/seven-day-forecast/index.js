import axios from 'axios'

export default async function handler(req, res) {
  const { lat, lon } = req.query

  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.API_KEY_WEATHER}&lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric`
    const res_weather = await axios.get(url)
    const data = await res_weather.data

    const result = data.daily.map(item => {
      return {
        dt: item.dt,
        min: item.temp.min,
        max: item.temp.max,
      }
    })

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({error: err})
  }
}
