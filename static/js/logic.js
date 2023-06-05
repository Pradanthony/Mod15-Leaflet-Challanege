// Initialize the map
var myMap = L.map("map", {
    center: [37.09, -95.71], // Set the initial center coordinates
    zoom: 5 // Set the initial zoom level
  });
  
  // Add the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Fetch the earthquake data
  d3.json(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  ).then(function(data) {
    // Process the data and create markers
    data.features.forEach(function(feature) {
      // Get the coordinates of the earthquake
      var lat = feature.geometry.coordinates[1];
      var lon = feature.geometry.coordinates[0];
  
      // Create a circle marker at the earthquake location
      var marker = L.circleMarker([lat, lon], {
        radius: getMarkerSize(feature.properties.mag),
        color: "black",
        weight: 1,
        fillOpacity: 0.8,
        fillColor: getMarkerColor(feature.geometry.coordinates[2])
      }).addTo(myMap);
  
      // Bind a popup to the marker
      marker.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          " km"
      );
    });
  
    // Helper function to calculate marker size based on magnitude
    function getMarkerSize(magnitude) {
      return magnitude * 3;
    }
  
    // Helper function to calculate marker color based on depth
    function getMarkerColor(depth) {
        if (depth < 10) {
            return "#FF0000"; // Red for shallow earthquakes
        } else if (depth < 30) {
            return "#FFA500"; // Orange for medium-depth earthquakes
        } else if (depth < 50) {
            return "#FFFF00"; // Yellow for earthquakes with depth between 30 and 50
        } else if (depth < 70) {
            return "#00FF00"; // Green for earthquakes with depth between 50 and 70
        } else if (depth < 90) {
            return "#00FFFF"; // Cyan for earthquakes with depth between 70 and 90
        } else {
            return "#0000FF"; // Blue for deep earthquakes with depth greater than or equal to 90
        }
    }
  
  
    // Create a legend control
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      var depths = [-10, 10, 30, 50, 70, 90];
      var labels = [];
  
      // Loop through depth ranges and create legend labels with colors
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getMarkerColor(depths[i] + 1) +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  });
  