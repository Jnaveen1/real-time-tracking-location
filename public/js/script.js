// let socket = io() ;

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition(
//     (position)=>{
//         const {latitude, longitude} =  position.coords;
//         socket.emit("send-location", {latitude, longitude}) ;
//     }, 
//     (error)=>{
//         console.error(error) ;
//     }, 
//     {
//         enableHighAccuracy:true ,
//         timeout: 5000, 
//         maximumAge : 0 
//     }
// ) ;
// }

// const map =  L.map("map").setView([0, 0], 10) ;

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution : "OpenStreetMap" 
// }).addTo(map) 

// const markers = {}

// socket.on("receive-location", (data)=>{
//     const {id, latitude, longitude} = data ;
//     map.setView([latitude, longitude], 16) ;
//     if(markers[id]){
//         markers[id].setLatLng([latitude, longitude]) ;
//     }else{
//         markers[id] = L.marker([latitude, longitude]) .addTo(map)
//     }
//  })

//  socket.on("user-disconnected", (id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]) ;
//         delete markers[id]
//     }
//  })
const socket = io();
const map = L.map("map").setView([0, 0], 2);
const markers = {};

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

socket.emit("join-room", ROOM_ID);

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { roomId: ROOM_ID, latitude, longitude });
    },
    (err) => console.error(err),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

socket.on("receive-location", ({ id, latitude, longitude }) => {
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  map.setView([latitude, longitude], 15);
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

document.getElementById("share-btn").addEventListener("click", () => {
    const shareLink = `${window.location.origin}/track-naveen-location/${ROOM_ID}`;

    // Copy silently using clipboard API
    navigator.clipboard.writeText(shareLink).then(() => {
        alert("🔗 Live location link copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed:", err);
        alert("⚠️ Could not copy the link.");
    });
});

