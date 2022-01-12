import axios from 'axios'
import cities from '../../../utils/cities'

export default async function handler(req, res) {
  const { state } = req.query

  if (Object.keys(cities).indexOf(state) === -1) {
    res.status(404).json({ error: 'Not Found' })
    return
  }

  const { lat, lon } = cities[state]
  const url = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.API_KEY}&lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric`
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
}
