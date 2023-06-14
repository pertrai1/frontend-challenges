const API_BASE_URL = "https://geo.ipify.org/api/v2/";
const API_KEY = "at_cGWCpLT0efCwQ0pIn5dhDy4vjKFar";
const API = `${API_BASE_URL}country,city?apiKey=${API_KEY}`;

const asideEl = document.querySelector("aside");

const searchInput = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");

window.addEventListener("DOMContentLoaded", async() => {
  displayMap();
  searchBtn.addEventListener("click", () => {
    if (searchInput.value === '') {
      console.log('You did not enter a value');
    } else {
      fetchAddress(searchInput.value);
    }
  });

  fetchAddress(searchInput.value);
});

function showLocationMatch(data) {
  const {ip, location, isp} = data;

  asideEl.innerHTML = "";
  asideEl.style.display = "flex";
  asideEl.innerHTML = `
    <div>
      <span>IP Address</span>
      <span>${ip}</span>
    </div>
    <div class="separator"></div>
    <div>
      <span>Location</span>
      <span>${location.region}</span>
    </div>
    <div class="separator"></div>
    <div>
      <span>Timezone</span>
      <span>UTC ${location.timezone}</span>
    </div>
    <div class="separator"></div>
    <div>
      <span>ISP</span>
      <span>${isp}</span>
    </div>
  `;
}

let map;
function displayMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=G8SKeFmLdUR50nElB69F', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 2 // starting zoom
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new maplibregl.NavigationControl());
}

function updateMap(params) {
  const {location} = params;

  // create the popup
  const popupContent = `${location.city}, ${location.region} ${location.postalCode}`;
  const popup = new maplibregl.Popup({ offset: 25 }).setText(popupContent);

  // create DOM element for the marker
  const el = document.createElement('div');
  el.id = 'marker';

  const marker = new maplibregl.Marker()
    .setLngLat([location.lng, location.lat - 0.8])
    .setPopup(popup)
    .addTo(map);

  map.flyTo({
    center: [location.lng, location.lat],
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion,
    zoom: 5
  });
}

async function fetchAddress(val = '') {
  const isIPAddress = validateIPaddress(val);
  let APIParams = '';

  if (isIPAddress) {
    APIParams = `&ipAddress=${val}`;
  } else if (!isIPAddress && val !== '') {
    APIParams = `&domain=${val}`;
  }

  try {
    const response = await fetch(`${API}${APIParams}`);
    const data = await response.json();
    showLocationMatch(data); 
    updateMap(data);
  } catch (error) {
    console.error('An error occurred while fetching the address:', error);
  }
}

function validateIPaddress(val) {  
  const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipAddressRegex.test(val);
}
