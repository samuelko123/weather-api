import axios from 'axios'

export default async function handler(req, res) {
    const { q } = req.query

    try {
        const url = `http://api.jsacreative.com.au/v1/suburbs?q=${q}`
        const data = await fetchData(url)
        res.status(200).json(data)
    } catch (err) {
        try {
            const url = `http://v0.postcodeapi.com.au/suburbs.json?q=${q}`
            const data = await fetchData(url)
            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
}

async function fetchData(url) {
    const { data } = await axios.get(url)
    const result = data
        .filter(item => !!item.latitude && !!item.longitude)
        .map(item => {
            return {
                name: item.name,
                lat: item.latitude,
                lon: item.longitude,
                postcode: item.postcode,
                state: item.state.abbreviation,
            }
        })
    
    return result
}