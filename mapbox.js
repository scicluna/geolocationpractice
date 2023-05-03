require('dotenv').config()
const ROOTMAPBOXURI = 'https://api.mapbox.com/search/searchbox/v1/category/'
const CATEGORY = 'trailhead'
const ACCESSTOKEN = process.env.ACCESS_TOKEN
const LOCATIONLON = '42.331429'
const LOCATIONLAT = '-83.045753'

const MAPBOXURI = `${ROOTMAPBOXURI}${CATEGORY}?access_token=${ACCESSTOKEN}&limit=10&origin=${LOCATIONLON},${LOCATIONLAT}`

async function fetchMapData() {
    const mapData = await fetch(MAPBOXURI)
    const data = await mapData.json()
    console.table(JSON.stringify(data))
}
fetchMapData()