
var mapboxAccessToken = "pk.eyJ1IjoianlvdGlrIiwiYSI6ImNrNnJpcTl5YzA1cmczbHF2M2pqeDZuZGMifQ.aTWO0KaNHed7RxzRAJIXBQ";
var map = L.map('map').setView([37.8, -96], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var layers = [];
//L.geoJson(statesData).addTo(map);
function getColor(d) {
    return d > 1000 ? '#0f8bba' :
        d > 500 ? '#0f8bba' :
            d > 200 ? '#0f8bba' :
                d > 100 ? '#0f8bba' :
                    d > 50 ? '#277fa1' :
                        d > 20 ? '#54d2d6' :
                            d > 0 ? '#54d2d6' :
                                '#d3d3d3';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 1,
        opacity: 1,
        color: 'lightgrey',
        dashArray: '0',
        fillOpacity: 0.5
    };
}

function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        layers.forEach(function (layer) {
            map.removeLayer(layer);
        });
        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        marker.bindPopup("<b>Country</b><br>" + feature.properties.name + ".").openPopup();
        layers.push(marker)
        // You can make your ajax call declaration here
    });
}

function onSearchLocation(feature) {
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    var marker = L.marker([feature.properties.latitude, feature.properties.longitude]).addTo(map);
    if (feature.properties.density > 100) {
        marker.bindPopup("<b>" + feature.properties.name + "</b> has good 4G LTE coverage.").openPopup();
        map.setView([feature.properties.latitude, feature.properties.longitude], 7);
    }
    if (feature.properties.density > 50 && feature.properties.density <= 100) {
        marker.bindPopup('<b>' + feature.properties.name + "</b> has good 4G coverage.").openPopup();
        map.setView([feature.properties.latitude, feature.properties.longitude], 7);
    }
    if (feature.properties.density <= 50) {
        marker.bindPopup('<b>' + feature.properties.name + "</b> has 3G coverage and providing 4G coverage soon.").openPopup();
        map.setView([feature.properties.latitude, feature.properties.longitude], 7);
    }
    //marker.bindPopup("<b>Country</b><br>" + feature.properties.name + ".").openPopup();
    layers.push(marker)
}

L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


// To get 4G LTE, 4G, 3G data areas- pass 'd' value > 500 in getColor()
document.getElementById('4gltedata').addEventListener('click', function () {
    //L.geoJson(data4glte, { style: style }).addTo(map);
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    var data4gltenetwork = L.geoJson(statesData, {
        style: function (features) {
            if (features.properties.density > 100) {
                return {
                    color: "lightgrey",
                    fillColor: getColor(features.properties.density),
                    weight: 1,
                    opacity: 1,
                    dashArray: '0',
                    fillOpacity: 0.5
                };
            }
            else {
                return {
                    fillColor: 'darkgrey',
                    weight: 1,
                    opacity: 1,
                    color: 'lightgrey',
                    dashArray: '0',
                    fillOpacity: 0.5
                }
            }

        },
        onEachFeature: onEachFeature
    }).addTo(map)
    layers.push(data4gltenetwork)
});

document.getElementById('4gdata').addEventListener('click', function () {
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    var data4gnetwork = L.geoJson(statesData, {
        style: function (features) {
            if (features.properties.density > 50 && features.properties.density <= 100) {
                return {
                    color: "lightgrey",
                    fillColor: getColor(features.properties.density),
                    weight: 1,
                    opacity: 1,
                    dashArray: '0',
                    fillOpacity: 0.5
                };
            }
            else {
                return {
                    fillColor: 'darkgrey',
                    weight: 1,
                    opacity: 1,
                    color: 'lightgrey',
                    dashArray: '0',
                    fillOpacity: 0.5
                }
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    layers.push(data4gnetwork)
});

document.getElementById('3gdata').addEventListener('click', function () {
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    var data3gnetwork = L.geoJson(statesData, {
        style: function (features) {
            if (features.properties.density <= 50) {
                return {
                    color: "lightgrey",
                    fillColor: getColor(features.properties.density),
                    weight: 1,
                    opacity: 1,
                    dashArray: '0',
                    fillOpacity: 0.5
                };
            }
            else {
                return {
                    fillColor: 'darkgrey',
                    weight: 1,
                    opacity: 1,
                    color: 'lightgrey',
                    dashArray: '0',
                    fillOpacity: 0.5
                }
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    layers.push(data3gnetwork)
});

document.getElementById('reset').addEventListener('click', function () {
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
});

document.getElementById("searchlocation").addEventListener("input", autosuggestion);

function autosuggestion() {
    var liststr = '';
    var $searchbox = document.getElementById("searchlocation");
    var searchvalue = $searchbox.value;
    if (searchvalue != "") {
        statesData.features.forEach(function (element) {
            var city = element.properties.name
            if ((city.toLowerCase().indexOf(searchvalue.toLowerCase()) != -1)) {
                liststr += '<li class="location" value="' + city + '" data-attr=' + element.id + '>' + city + '</li>';
            }
            document.getElementById("autosuggestionresults").innerHTML = liststr;
        });
    }
    else {
        document.getElementById("autosuggestionresults").innerHTML = "";
    }

}

$("#autosuggestionresults").on('click', '.location', function () {
    document.getElementById('searchlocation').value = $(this).text();
    document.getElementById('searchlocation').setAttribute("data-attr", $(this).attr("data-attr"));
})

document.addEventListener('click', function (event) {
    var element = document.getElementById('autosuggestionresults');

    if (event.target == element && element.contains(event.target)) {
        console.log(element + "-----")
    }
    else {
        document.getElementById("autosuggestionresults").innerHTML = "";
    }

}, false);

document.getElementById("searchbutton").addEventListener('click', onCountryHighLight);

function onCountryHighLight() {
    layers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    var countryindex = $('#searchlocation').attr("data-attr");
    var countrysearch = L.geoJson(statesData, {
        style: function (features) {
            if (features.id == countryindex) {
                return {
                    color: "lightgrey",
                    fillColor: 'orange',
                    weight: 1,
                    opacity: 1,
                    dashArray: '0',
                    fillOpacity: 0.5,
                    onEachFeature: onSearchLocation(features)
                };
            }
            else {
                return {
                    fillColor: getColor(features.properties.density),
                    weight: 1,
                    opacity: 1,
                    color: 'lightgrey',
                    dashArray: '0',
                    fillOpacity: 0.5
                }
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    layers.push(countrysearch)
}
