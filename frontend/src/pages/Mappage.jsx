import {useState,useEffect} from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
function Mappage(){
    const [song,setSong]=useState("");
    const [artist,setArtist]=useState("");
    const [lat,setLat]=useState(null);
    const [lon,setLon]=useState(null);
    const [songs,setSongs]=useState([]);
    useEffect(() => {
  fetchSongs();
  navigator.geolocation.getCurrentPosition((position) => {
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);      
    console.log("Current location:", position.coords.latitude, position.coords.longitude);
  }, (error) => {
    console.error("Error getting location:", error);
  });
}, []);

const fetchSongs = async () => {
  try {
    const response = await axios.get(
      "https://musiccue.onrender.com/songs"
    );

    console.log(response.data);

    setSongs(response.data);

  } catch (error) {
    console.error(error);
  }
};
    const handleSubmit=async()=>{
        console.log("Button clicked");
        try{  
              const response= await axios.post("https://musiccue.onrender.com/songs",{
                song,
                artist,
                lat,            
                lon
              },
              {
                headers: {  
                    Authorization: localStorage.getItem("token")        
                }
            }  ); 
              
              console.log(response.data);
              alert("Song added to map successfully");
        }
        catch(error){
            console.error("Error adding song to map:", error);
            alert("Error adding song to map");
        }
    };

    {
        return(
            <div align="center">
                <h1 style={{textAlign:"center",color:"green"}}>Map Page</h1>
                <input 
                type="text"
                placeholder="Song Name"
                value={song}
                onChange={(e)=>setSong(e.target.value)}
                />
                <input 
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e)=>setArtist(e.target.value)}
                />
                <br/>
                <br/>
                <button onClick={handleSubmit}>Add Song </button>
             <br/>
             <hr style={{border: "2px solid #0b757a"}}/>  

           
        <MapContainer
      center={[13.0827, 80.2707]}
      zoom={10}
      style={{ height: "100vh", width: "100%" , padding :"20px"  }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {songs.map((song) => (
  <Marker
    key={song.id}
    position={[
      parseFloat(song.latitude),
      parseFloat(song.longitude)
    ]}
  >
    <Popup>
      <h3>{song.name}</h3>
      <h4>{song.song_name}</h4>
      <p>{song.artist}</p>
    </Popup>
  </Marker>
))}
    </MapContainer>
 </div>  
        );
    }
}
export default Mappage;