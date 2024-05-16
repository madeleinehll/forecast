/* Wind & Wetter Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 5);

// thematische Layer
let themaLayer = {
    forecast: L.featureGroup().addTo(map)
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Wettervorhersage MET Norway": themaLayer.forecast
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Wettervorhersage MET Norway
async function showForecast(url) {
    let response = await fetch(url);
    let jsondata = await response.json();

    // aktuelles Wetter und Wettervorhersage implementieren
    console.log(jsondata);
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            let content = `
            <ul>
                <li>Luftdruck Meereshöhe (hPa): air_pressure_at_sea_level</li>
                <li>Lufttemperatur (°C): air_temperature </li>
                <li>Bewölkungsgrad (%): cloud_area_fraction</li>
                <li>Niederschlagsmenge (mm): precipitation_amount</li>
                <li>Luftfeuchtigkeit(%): relative_humidity</li>
                <li>Windrichtung (°): wind_from_direction</li>
                <li>Windgeschwindigkeit (km/h): wind_speed</li>
            </ul>
            `;
            L.popup(latlng, { 
                content: content 
            }).openOn(themaLayer.forecast);
        }
    }).addTo(themaLayer.forecast);
}
showForecast("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=47.267222&lon=11.392778");
