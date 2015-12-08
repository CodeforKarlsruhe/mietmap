
var COLORMAP = [
    [0.0, 0.5, 0.4],
    [0.050980392156862744, 0.5254901960784314, 0.4],
    [0.10196078431372549, 0.5509803921568628, 0.4],
    [0.1568627450980392, 0.5784313725490196, 0.4],
    [0.20784313725490194, 0.6039215686274509, 0.4],
    [0.2627450980392157, 0.6313725490196078, 0.4],
    [0.3137254901960784, 0.6568627450980392, 0.4],
    [0.3686274509803922, 0.6843137254901961, 0.4],
    [0.4196078431372549, 0.7098039215686275, 0.4],
    [0.4745098039215686, 0.7372549019607844, 0.4],
    [0.5254901960784314, 0.7627450980392156, 0.4],
    [0.580392156862745, 0.7901960784313725, 0.4],
    [0.6313725490196078, 0.8156862745098039, 0.4],
    [0.6862745098039216, 0.8431372549019608, 0.4],
    [0.7372549019607844, 0.8686274509803922, 0.4],
    [0.792156862745098, 0.896078431372549, 0.4],
    [0.8431372549019608, 0.9215686274509804, 0.4],
    [0.8980392156862745, 0.9490196078431372, 0.4],
    [0.9490196078431372, 0.9745098039215686, 0.4],
    [1.0, 1.0, 0.4]
];

// See https://stackoverflow.com/a/5624139/857390
function componentToHex(c) {
    var hex = Math.round(255 * c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/*
   Compute color for a value.

   Based on the data from COLORMAP.

   Returns a color hex string.
*/
function colormap(v) {
    var nbins = COLORMAP.length - 1;
    var rgb;
    if (v <= 0) {
        rgb = COLORMAP[0];
    } else if (v >= 1) {
        rgb = COLORMAP[nbins];
    } else {
        var bin_width = 1 / nbins;
        var bin = Math.floor(nbins * Math.max(0, v));
        var y = (v - bin * bin_width) / bin_width;
        var x = 1 - y;
        var pred = COLORMAP[bin];
        var succ = COLORMAP[bin + 1];
        rgb = [x * pred[0] + y * succ[0],
               x * pred[1] + y * succ[1],
               x * pred[2] + y * succ[2]];
    }
    return ('#' + componentToHex(rgb[0])
                + componentToHex(rgb[1])
                + componentToHex(rgb[2]));
}


/*
    CSS gradient from colormap.

    Based on the data from COLORMAP.

    `direction` is the gradient direction (e.g. "to right").

    Returns a CSS gradient definition string.
*/
function colormap_gradient(direction) {
    var g = 'linear-gradient(' + direction;
    for (var i = 0; i < COLORMAP.length; i++) {
        var c = COLORMAP[i];
        g += ',rgb(' + Math.round(255 * c[0]) + ','
                     + Math.round(255 * c[1]) + ','
                     + Math.round(255 * c[2]) + ')';
    }
    return g + ')';
}

