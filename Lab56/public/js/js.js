//import "../css/style.css";
//import layoutPlaces from "../../views/places.hbs";
const layoutPlaces = require('../../views/places.hbs');
const placesEl = document.getElementById("place-holder");
placesEL.innerHTML=layoutPlaces;
const geoKey = "d5d2ee05032da2352d58fe53fda8106b";

mapboxgl.accessToken = "pk.eyJ1IjoiNjE4NzE0NCIsImEiOiJjbDJhZmxldmYwMHdoM2NwN2cxNGZkcjVnIn0.nk5Yfg6OGIE8gS3F_XA0QQ";
let map;

let hydrants = [];
let places = [];
let marker;

let Lab56ServiceUrl = "https://localhost:7205/api/Lab56"; 

let Lab56El = document.getElementById("items");
document.getElementById("task-submit").addEventListener("click", async () => {
    let taskNameEl = document.getElementById("task-name");
    let taskStreetNoEl = document.getElementById("task-street-no");
    let taskAddressEl = document.getElementById("task-address");
    let taskPostcodeEl = document.getElementById("task-postcode");
    //let taskRegionEl = document.getElementById("task-region");
    let taskName = taskNameEl.value;
    let taskStreetNo = taskStreetNoEl.value;
    let taskAddress = taskAddressEl.value;
    let taskPostcode = taskPostcodeEl.value;
    let lati;
    let lngi;
    let getLoca = async function () {
        let loca = `http://api.positionstack.com/v1/forward?access_key=${geoKey}&query=${taskStreetNo}%20${taskAddress},%20Gatineau%20QC`;
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
    if (taskName.trim() != '') {
        let newTask = { name: taskName, address: taskAddress, postcode:taskPostcode,streetNo:taskStreetNo,lat:lati,lng:lngi };

        let newLab56Data = await fetch(Lab56ServiceUrl,
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(newTask)
            });
        getLab56s();
        taskNameEl.value = "";
    }
});
let facName;
document.getElementById("parc").addEventListener("click", async () => {
    facName = "Parc";
    hydrants.forEach((marker) => marker.remove())
    hydrants = [];
    getHydrants();
});
document.getElementById("ecole").addEventListener("click", async () => {
    facName = "École";
    hydrants.forEach((marker) => marker.remove())
    hydrants = [];
    getHydrants();
});
document.getElementById("garderie").addEventListener("click", async () => {
    facName = "Garderie";
    hydrants.forEach((marker) => marker.remove())
    hydrants = [];
    getHydrants();
});
document.getElementById("hospital").addEventListener("click", async () => {
    facName = "Hôpital";
    hydrants.forEach((marker) => marker.remove())
    hydrants = [];
    getHydrants();
});
let getHydrants = async() => {

    let placesFetchResult = await (await fetch('http://localhost:3000/api/hydrants', {
        mode: 'no-cors'
    })).json();

    let places = placesFetchResult.features;
    //console.log(places);    
    //let conList;
    for (let i = 0; i < places.length; i++) {

        lng = places[i].geometry.coordinates[0];
        lat = places[i].geometry.coordinates[1];

        if (places[i].properties.NOM.includes(facName))
        {
            let marker = new mapboxgl.Marker({ "color": "#b40219" }).setLngLat([lng, lat]).addTo(map);
            //marker.remove();
            hydrants.push(marker);
            //console.log(places[i].properties.NOM);
        }
    }
};

let getLab56s = async function () {
    //console.log("sadas");
    let Lab56Data = await (await fetch(Lab56ServiceUrl,
        {
            cache: 'no-cache', 
            method: 'GET'
        })).json();
    let html = "";
    html+="My Places<br>";
    html += "<ol>";
    for (let i = 0; i < Lab56Data.length; i++) {
        html += `<li><button class="placeChoose">${Lab56Data[i].name}</button></li>`;
        html += `<li><button class="placeDel">Delete Place</button></li>`;
        lng = Lab56Data[i].lng;
        lat = Lab56Data[i].lat;
        places.push(new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map));
    }
    html += "</ol>";
    //console.log("sadas");
    //Lab56El.innerHTML = html;
    return (Lab56Data);
}

let mapInit = async function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/6187144/cl2afv12m000c14p5qtma8qwz',
        center: [-75.765, 45.456],
        zoom: 13.5
    });
    //placesEl.innerHTML = layoutPlaces (await getLab56s());
}

mapInit();
//getHydrants();
getLab56s();
