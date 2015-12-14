var map;

/*
   Compute the arithmetic mean of a list of values.
*/
function mean(values) {
    var sum = 0;
    for (var index in values) {
        sum += values[index];
    }
    return sum / values.length;
}

/*
   Merge data points who have the same coordinates.

   The corresponding rent is the average of the merged rents.
*/
function mergeDataPoints(points) {
    var merged = {};
    for (var index in points) {
        var point = points[index];
        var key = [point[0], point[1]];
        if (key in merged) {
            merged[key][1].push(point[2]);
        } else {
            merged[key] = [[point[0], point[1]], [point[2]]];
        }
    }
    var result = [];
    for (var key in merged) {
        if (merged.hasOwnProperty(key)) {
            var entry = merged[key];
            result.push([entry[0][0], entry[0][1], mean(entry[1])]);
        }
    }
    return result;
}

var RENT_SPAN = MAX_RENT - MIN_RENT;

/*
    Add circle markers to map.
*/
function addMarkers(json) {
    json = mergeDataPoints(json);
    for (var index in json) {
        var point = json[index];
        if (point[2] < MIN_RENT || point[2] > MAX_RENT) {
            continue;
        }
        var fillColor = colormap((point[2] - MIN_RENT) / RENT_SPAN);
        var options = $.extend({'fillColor': fillColor}, CIRCLE_OPTIONS);
        var label = (point[2].toFixed(2) + ' €/m²').replace(/\./, ',');
        L.circleMarker([point[0], point[1]], options)
            .setRadius(CIRCLE_RADIUS)
            .bindLabel(label)
            .addTo(map);
    }
}

/*
   Add heatmap overlay to map.
*/
function addOverlay() {
    L.imageOverlay(OVERLAY_URL, OVERLAY_BOUNDS, OVERLAY_OPTIONS)
        .addTo(map);
}

/*
   Initialize map.
*/
function initMap() {
    var tiles = new L.TileLayer(TILES_URL, {attribution: ATTRIBUTION});
    map = new L.Map('map', {
            center: INITIAL_LOCATION,
            zoom: INITIAL_ZOOM,
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM
        })
        .addLayer(tiles)
    addOverlay();
    $.getJSON(RENT_URL, addMarkers);
}

/*
   Initialize colorbar in legend.
*/
function initColorbar() {
    var gradient = colormap_gradient('to right');
    $('#colorbar').css('background', gradient);
    $('#min-rent').html(MIN_RENT + ' €/m²');
    $('#max-rent').html(MAX_RENT + ' €/m²');
}

/*
   Initialize legend.
*/
function initLegend() {
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (m) {
        return L.DomUtil.get('legend');
    };
    legend.addTo(map);
    initColorbar();
}

