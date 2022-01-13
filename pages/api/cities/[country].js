import axios from 'axios'

export default async function handler(req, res) {
    const { namePrefix, country } = req.query

    try {
        if (!namePrefix) {
            res.status(400).json({ error: "Missing 'namePrefix' parameter" })
            return
        }

        console.log(country)

        const config = {
            method: 'GET',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
            params: { countryIds: country, namePrefix: namePrefix, sort: '-population', offset: 0, limit: 10 },
            headers: {
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                'x-rapidapi-key': process.env.API_KEY_CITY
            }
        }

        const { data } = await axios.request(config)
        const result = data.data.map(item => {
            return {
                name: item.name,
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

