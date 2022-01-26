import axios from 'axios'

export default async function handler(req, res) {
    const { q } = req.query

    try {
        const url = `http://api.geonames.org/postalCodeSearchJSON?placename_startsWith=${q}&maxRows=10&countryCode=AU&username=${process.env.API_KEY_SUBURB}`
        const { data } = await axios.get(url)
        const result = data.postalCodes.map(item => {
            return {
                name: item.placeName,
                lat: item.lat,
                lon: item.lng,
                postcode: item.postalCode,
                state: item['ISO3166-2'],
            }
        })

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.toString() })
    }
}