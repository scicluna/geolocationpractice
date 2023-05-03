import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
    apiKey: `${import.meta.env.VITE_GOOGLE_TOKEN}`,
    version: "weekly",
    libraries: ["places"]
});

let map;

loader.load().then(async () => {
    function initMap() {
        const noPoiStyles = [
            {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }]
            }
        ];

        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
            styles: noPoiStyles
        });

        const input = document.getElementById("pac-input");
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        const autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Update the map center to the selected place
            map.setCenter(place.geometry.location);

            // Call markerPlacement to update the markers
            markerPlacement();
        });

        const infowindow = new google.maps.InfoWindow();
        const placesService = new google.maps.places.PlacesService(map);



        function markerPlacement(e) {
            {
                const request = {
                    location: map.getCenter(),
                    radius: '100000', // Search within a 5 km radius
                    type: 'park' // Only show parks
                };

                placesService.nearbySearch(request, (results, status) => {
                    console.log(results)
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                });

                const requestTrail = {
                    location: map.getCenter(),
                    radius: '100000', // Search within a 5 km radius
                    keyword: 'trail' // Search for trails
                };

                placesService.nearbySearch(requestTrail, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                });
            }
        };
        window.addEventListener('load', markerPlacement)
        input.addEventListener('place_changed', markerPlacement)

        function createMarker(place) {
            const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '</div>');
                infowindow.open(map, this);
            });
        }
    }

    initMap();



});



