
//Formatter to generate charts
var chartFormatter = function (cell, formatterParams, onRendered) {
    var content = document.createElement("span");
    var values = cell.getValue();

    //invert values if needed
    if (formatterParams.invert) {
        values = values.map(val => val * -1);
    }

    //add values to chart and style
    content.classList.add(formatterParams.type);
    content.inneHrTML = values.join(",");

    //setup chart options
    var options = {
        width: 50,
        // min: 0.0,
        // max: 100.0,
    }

    if (formatterParams.fill) {
        options.fill = formatterParams.fill
    }

    //instantiate piety chart after the cell element has been aded to the DOM
    onRendered(function () {
        peity(content, formatterParams.type, options);
    });

    return content;
};


var colorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();

    // If the value is null, undefined, or not a number, return a dash
    if (value === null || value === undefined || isNaN(value) || value === "-") {
        return "<span style='display: block; width: 100%; height: 100%; text-align: center;'>-</span>";
    }

    // Default values
    var defaults = {
        min: 0.0,
        max: 100.0,
        startColor: { r: 255, g: 255, b: 255 },
        endColor: { r: 107, g: 142, b: 35 }
    };

    // Override defaults with provided formatterParams values
    var min = (formatterParams && formatterParams.min) || defaults.min;
    var max = (formatterParams && formatterParams.max) || defaults.max;
    var startColor = (formatterParams && formatterParams.startColor) || defaults.startColor;
    var endColor = (formatterParams && formatterParams.endColor) || defaults.endColor;

    // Normalize the value between 0 and 1
    var normalizedValue = (value - min) / (max - min);

    // Compute the color gradient 
    var red = Math.floor(startColor.r + (endColor.r - startColor.r) * normalizedValue);
    var green = Math.floor(startColor.g + (endColor.g - startColor.g) * normalizedValue);
    var blue = Math.floor(startColor.b + (endColor.b - startColor.b) * normalizedValue);

    // Round the value to 1 decimal place
    value = parseFloat(value).toFixed(1);

    return "<span style='display: block; width: 100%; height: 100%; background-color: rgb(" +
        red + ", " + green + ", " + blue + "); text-align: center;'>" + value + "</span>";
};


var barColorFn = function (value, formatterParams) {
    var defaults = {
        range : [-50, 50],
        low: { r: 255, g: 100, b: 150 },
        high: { r: 150, g: 255, b: 150 }
    };

    // Override defaults with provided formatterParams values

    var low_range = (formatterParams && formatterParams.range[0]) || defaults.range[0];
    var high_range = (formatterParams && formatterParams.range[1]) || defaults.range[1];
    var low = (formatterParams && formatterParams.low) || defaults.low;
    var high = (formatterParams && formatterParams.high) || defaults.high;

    // Clamp the value to the range [-100, 100]
    value = Math.max(low_range, Math.min(high_range, value));
    var range = high_range - low_range;

    // Normalize the value to the range [0, 1]
    var normalizedValue = (value + range / 2) / range;
    // Interpolate between the two colors based on the normalized value
    var interpolated = {
        r: Math.floor(low.r + (high.r - low.r) * normalizedValue),
        g: Math.floor(low.g + (high.g - low.g) * normalizedValue),
        b: Math.floor(low.b + (high.b - low.b) * normalizedValue)
    };

    return 'rgba(' + interpolated.r + ',' + interpolated.g + ',' + interpolated.b + ',0.9)';
}

document.addEventListener('DOMContentLoaded', function () {
   fetch('website/data/webarena_table.json')
  .then(response => response.json())
  .then(data => {
    new Tabulator("#benchmark-table2", {
      data: data,
      layout: "fitColumns",
      responsiveLayout: "collapse",
      columnDefaults: { tooltip: true },
      columns: [
        { title: "Method", field: "method", minWidth: 180 },
        { title: "Backbone", field: "backbone", minWidth: 160 },
        { title: "Open-Source", field: "openweight", minWidth: 160 },
        { title: "Average", field: "avg", hozAlign: "center", formatter: colorFormatter },
        { title: "Shopping", field: "shopping", hozAlign: "center", formatter: colorFormatter },
        { title: "CMS", field: "cms", hozAlign: "center", formatter: colorFormatter },
        { title: "Reddit", field: "reddit", hozAlign: "center", formatter: colorFormatter },
        { title: "GitLab", field: "gitlab", hozAlign: "center", formatter: colorFormatter },
        { title: "Maps", field: "maps", hozAlign: "center", formatter: colorFormatter }
      ]
    });
  });



})

