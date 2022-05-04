
const geoKey = "d5d2ee05032da2352d58fe53fda8106b";

mapboxgl.accessToken = "pk.eyJ1IjoiNjE4NzE0NCIsImEiOiJjbDJhZmxldmYwMHdoM2NwN2cxNGZkcjVnIn0.nk5Yfg6OGIE8gS3F_XA0QQ";
let map;

let facility = [];
let places = [];
let myPlaces = [];
let placer = [];
let dist = [];

let centerer = [-75.765, 45.456];
let marker;
let poslat;
let poslng;

let GatineauerServiceUrl = "https://localhost:7205/api/Gatineauer"; 

let GatineauerEl = document.getElementById("items");
    document.getElementById("location-submit").addEventListener("click", async () => {
    let locationNameEl = document.getElementById("location-name");
    let locationStreetNoEl = document.getElementById("location-street-no");
    let locationAddressEl = document.getElementById("location-address");
    let locationPostcodeEl = document.getElementById("location-postcode");
    //let locationRegionEl = document.getElementById("location-region");
    let locationName = locationNameEl.value;
    let locationStreetNo = locationStreetNoEl.value;
    let locationAddress = locationAddressEl.value;
    let locationPostcode = locationPostcodeEl.value;
    let lati;
    let lngi;
    let getLoca = async function () {
        let loca = `http://api.positionstack.com/v1/forward?access_key=${geoKey}&query=${locationStreetNo}%20${locationAddress},%20Gatineau%20QC`;
        //console.log("fdsfsd");   
        let response = await axios.get(loca);

        let data = response.data;
        //let [first] = data;
        let first = data.data[0];
        lati = first.latitude+"";
        lngi = first.longitude+"";
        // console.log(lati);
        // console.log(lngi);

    }
    await getLoca();
    if (locationName.trim() != '') {
        let newLocation = { name: locationName, address: locationAddress, postcode:locationPostcode,streetNo:locationStreetNo,lat:lati,lng:lngi };

        let newGatineauerData = await fetch(GatineauerServiceUrl,
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(newLocation)
            });
        getGatineauers();
        map.flyTo({center: [lngi,lati ], essential: true });
        locationNameEl.value = "";
        locationStreetNoEl.value = "";
        locationAddressEl.value = "";
        locationPostcodeEl.value = "";
    }
});
let facName;
document.getElementById("parc").addEventListener("click", async () => {
    facName = "Parc";
    facility.forEach((marker) => marker.remove())
    facility = [];
    getFacility();
});
document.getElementById("ecole").addEventListener("click", async () => {
    facName = "École";
    facility.forEach((marker) => marker.remove())
    facility = [];
    getFacility();
});
document.getElementById("garderie").addEventListener("click", async () => {
    facName = "Garderie";
    facility.forEach((marker) => marker.remove())
    facility = [];
    getFacility();
});
document.getElementById("hospital").addEventListener("click", async () => {
    facName = "Hôpital";
    facility.forEach((marker) => marker.remove())
    facility = [];
    getFacility();
});
let getFacility = async() => {

    let placesFetchResult = await (await fetch('http://localhost:3000/api/facility', {
        mode: 'no-cors'
    })).json();

    let places = placesFetchResult.features;
    //console.log(places);
    let selectedPlaces = [];
    //console.log(places);    
    //let conList;
    for (let i = 0; i < places.length; i++) {
    if (places[i].properties.NOM.includes(facName))
    {
        selectedPlaces.push(places[i]);
        //console.log(places[i]);
    }}
    //console.log(selectedPlaces);
    let mindist = distance(poslat, poslng, selectedPlaces[0].geometry.coordinates[1], selectedPlaces[0].geometry.coordinates[0], "K");
    for (let i = 0; i < selectedPlaces.length; i++) {

        lng = selectedPlaces[i].geometry.coordinates[0];
        lat = selectedPlaces[i].geometry.coordinates[1];
        dist[i]=distance(poslat, poslng, lat, lng, "K");
        
        if (dist [i] < mindist) {mindist=dist[i];}

    }
    
    for (let j = 0; j < selectedPlaces.length; j++) {
        let marker;
        lng = selectedPlaces[j].geometry.coordinates[0];
        lat = selectedPlaces[j].geometry.coordinates[1];
        dist[j]=distance(poslat, poslng, lat, lng, "K");
        let faciName= selectedPlaces[j].properties.NOM;
        //console.log(facName);
        //console.log(dist[j]);
        //console.log(mindist);
        if (dist[j]==mindist) {
                marker = new mapboxgl.Marker({ "color": "#b20456" }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setHTML(`The nearest ${facName}<br>${faciName}`)).addTo(map).togglePopup();
                //console.log(mindist);
            } else {
            marker = new mapboxgl.Marker({ "color": "yellow" }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setHTML(facName)).addTo(map);
            //console.log(mindist);
            }
            //marker.remove();
            facility.push(marker);
            //console.log(places[i].properties.NOM);
    }
};

let getGatineauers = async function () {
    let GatineauerData = await (await fetch(GatineauerServiceUrl,
        {
            cache: 'no-cache', 
            method: 'GET'
        })).json();
    let html = document.createElement("div");
    html.innerHTML+="My Places<br><ol id='placesList'></ol>";
    GatineauerEl.innerHTML="";
    GatineauerEl.appendChild(html);
    let plEl = document.getElementById("placesList");
    
    for (let i = 0; i < GatineauerData.length; i++) {
        plEl.innerHTML += `<li><button class="placeChoose">${GatineauerData[i].name}</button>`;
        plEl.innerHTML += `<button class="placeDel">Delete Place</button></li>`;
        lng = GatineauerData[i].lng;
        lat = GatineauerData[i].lat;
        plEl.innerHTML+=lng;
        plName= GatineauerData[i].name;
        
        let mark = new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setHTML(plName)).addTo(map);
        myPlaces.push(mark);
        // mark.getElement().addEventListener('click', () => {
        //     map.flyTo({center: [lng,lat ], essential: true });
        //     poslat = lat;
        //     poslng = lng;
        //   });
        placer[i]={id:GatineauerData[i].gatineauerItemId, name:GatineauerData[i].name, lat:lat,lng:lng};
        GatineauerEl.appendChild(plEl);
    }
    //console.log(myPlaces);
    let placeFocus= plEl.querySelectorAll(".placeChoose");
    for (let i = 0; i < GatineauerData.length; i++) {
        placeFocus[i].addEventListener("click", () => {
            map.flyTo({center: [placer[i].lng,placer[i].lat ], essential: true });
            poslat = placer[i].lat;
            poslng = placer[i].lng;
        });
    }
    for (let i = 0; i < myPlaces.length; i++) {
        myPlaces[i].getElement().addEventListener("click", () => {
            map.flyTo({center: myPlaces[i]._lngLat, essential: true });
            //console.log(myPlaces[i]._lngLat.lng);
            poslat = myPlaces[i]._lngLat.lat;
            poslng = myPlaces[i]._lngLat.lng;
        });
    }
    let placeDel= plEl.querySelectorAll(".placeDel");
    for (let i = 0; i < GatineauerData.length; i++) {
        placeDel[i].addEventListener("click", async () => {
            let idDel= placer[i].id;
            //let delPlace = gatineauerItemId: idDel;
        //console.log(idDel);
        let delGatineauerData = await (await fetch(GatineauerServiceUrl+"/"+idDel, {method:"delete"})).text();
        getGatineauers();
        });
    }
    
}

let mapInit = async function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/6187144/cl2afv12m000c14p5qtma8qwz',
        center: centerer,
        zoom: 13.5
    });
    //placesEl.innerHTML = layoutPlaces (await getGatineauers());
}
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    //console.log(dist);
    return dist
}

mapInit();
getFacility();
getGatineauers();
