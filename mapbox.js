import mapboxgl from "mapbox-gl"

const ROOTMAPBOXURI = 'https://api.mapbox.com/search/searchbox/v1/category/'
const CATEGORY = 'trailhead'
const ACCESSTOKEN = `${import.meta.env.VITE_ACCESS_TOKEN}`
const LOCATIONLON = -83.045753
const LOCATIONLAT = 42.331429

const MAPBOXURI = `${ROOTMAPBOXURI}${CATEGORY}?access_token=${ACCESSTOKEN}&limit=10&origin=${LOCATIONLON},${LOCATIONLAT}&proximity=${LOCATIONLON},${LOCATIONLAT}`

async function fetchMapData() {
    const mapData = await fetch(MAPBOXURI);
    const data = await mapData.json();

    // Convert the features array to a GeoJSON object
    const geojsonData = {
        type: 'FeatureCollection',
        features: data.features
    };

    // Add the GeoJSON data source to the map
    map.addSource('trailhead-points', {
        type: 'geojson',
        data: geojsonData
    });

    // Add a symbol layer to the map using the GeoJSON data source
    map.addLayer({
        id: 'trailhead-points',
        type: 'symbol',
        source: 'trailhead-points',
        layout: {
            'icon-image': 'custom-marker', // You can use a custom marker image if you prefer
            'icon-size': 1.5,
            'text-field': ['get', 'name'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
        }
    });
}

mapboxgl.accessToken = `${import.meta.env.VITE_ACCESS_TOKEN}`;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [LOCATIONLON, LOCATIONLAT], // starting position [lng, lat]
    zoom: 9, // starting zoom
    pitch: 0,
    bearing: 0
});

map.on('load', async () => {
    map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);
            // Add a GeoJSON source with 2 points
            fetchMapData();
        });
})







