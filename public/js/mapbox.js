export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW1hbjE3MDEiLCJhIjoiY2ttcXM4d2MwMDB6bTJ4czBqdDcwMXowZCJ9.fZtkSqdp5caAd5vkasxXpw";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/aman1701/ckmqst8hl1exk17qt0u8z6t91",
    scrollZoom: false,
    //   center: [-118.113491, 34.11745],
    //   zoom: 4,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create Marker
    const el = document.createElement("div");
    el.className = "marker";

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add a popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
