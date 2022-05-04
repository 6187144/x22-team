
const geoKey = "d5d2ee05032da2352d58fe53fda8106b";

mapboxgl.accessToken = "pk.eyJ1IjoiNjE4NzE0NCIsImEiOiJjbDJhZmxldmYwMHdoM2NwN2cxNGZkcjVnIn0.nk5Yfg6OGIE8gS3F_XA0QQ";
let map;

let hydrants = [];
let places = [];
let placer = [];
let dist = [];

let centerer = [-75.765, 45.456];
let marker;
let poslat;
let poslng;

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
        console.log(lati);
        console.log(lngi);

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
        //console.log(dist[i]);
        // lng2 = places[i-1].geometry.coordinates[0];
        // lat2 = places[i-1].geometry.coordinates[1];
        // if (distance(poslat, poslng, lat, lng, "K") <= distance(poslat, poslng, lat, lng, "K")) {
        //     html += '<p>' + data[i].location + ' - ' + data[i].code + '</p>';
        // }
        // for (var i = 0; i < data.length; i++) {
        //     // if this location is within 0.1KM of the user, add it to the list
            
        // }

    }
    
    for (let j = 0; j < selectedPlaces.length; j++) {
        let marker;
        lng = selectedPlaces[j].geometry.coordinates[0];
        lat = selectedPlaces[j].geometry.coordinates[1];
        dist[j]=distance(poslat, poslng, lat, lng, "K");
        console.log(dist[j]);
        console.log(mindist);
            if (dist[j]==mindist) {
                marker = new mapboxgl.Marker({ "color": "#b20456" }).setLngLat([lng, lat]).addTo(map);
                //console.log(mindist);
            } else {
            marker = new mapboxgl.Marker({ "color": "yellow" }).setLngLat([lng, lat]).addTo(map);
            //console.log(mindist);
            }
            //marker.remove();
            hydrants.push(marker);
            //console.log(places[i].properties.NOM);
    }
};

let getLab56s = async function () {
    let Lab56Data = await (await fetch(Lab56ServiceUrl,
        {
            cache: 'no-cache', 
            method: 'GET'
        })).json();
    let html = document.createElement("div");
    html.innerHTML+="My Places<br><ol id='placesList'></ol>";
    Lab56El.innerHTML="";
    Lab56El.appendChild(html);
    let plEl = document.getElementById("placesList");
    
    for (let i = 0; i < Lab56Data.length; i++) {
        plEl.innerHTML += `<li><button class="placeChoose">${Lab56Data[i].name}</button>`;
        plEl.innerHTML += `<button class="placeDel">Delete Place</button></li>`;
        lng = Lab56Data[i].lng;
        lat = Lab56Data[i].lat;
        plEl.innerHTML+=lng;
        plName= Lab56Data[i].name;
        places.push(new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map));
        placer[i]={id:Lab56Data[i].lab56ItemId, name:Lab56Data[i].name, lat:lat,lng:lng};
        Lab56El.appendChild(plEl);
    }
    let placeFocus= plEl.querySelectorAll(".placeChoose");
    for (let i = 0; i < Lab56Data.length; i++) {
        placeFocus[i].addEventListener("click", () => {
            map.flyTo({center: [placer[i].lng,placer[i].lat ], essential: true });
            poslat = placer[i].lat;
            poslng = placer[i].lng;
        });
    }
    let placeDel= plEl.querySelectorAll(".placeDel");
    for (let i = 0; i < Lab56Data.length; i++) {
        placeDel[i].addEventListener("click", async () => {
            let idDel= placer[i].id;
            //let delPlace = lab56ItemId: idDel;
        console.log(idDel);
        let delLab56Data = await (await fetch(Lab56ServiceUrl+"/"+idDel, {method:"delete"})).text();
        getLab56s();
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
    //placesEl.innerHTML = layoutPlaces (await getLab56s());
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
getHydrants();
getLab56s();
