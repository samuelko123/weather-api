import axios from 'axios'

export default async function handler(req, res) {
    const { namePrefix } = req.query

    try {
        const config = {
            method: 'GET',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
            params: { namePrefix: namePrefix, sort: '-population', offset: 0, limit: 10 },
            headers: {
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                'x-rapidapi-key': process.env.API_KEY_CITY
            }
        }

        const { data } = await axios.request(config)
        const result = data.data.map(item => {
            return {
                name: item.name,
                countryCode: item.countryCode,
                lat: item.latitude,
                lon: item.longitude,
            }
        })

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

