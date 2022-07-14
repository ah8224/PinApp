import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import StarIcon from '@mui/icons-material/Star';
import RoomIcon from '@mui/icons-material/Room';
import { useEffect, useState } from "react";
import './app.css'
import axios from 'axios';
import Register from './components/register';
import Login from './components/login';

function App() {
  const storage = window.localStorage
  const [pins, setPins] = useState([]);
  const [currentPin, setCurrentPin] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newPlace,setNewPlace] = useState(null)
  const [title,setTitle] = useState(null)
  const [currentUser,setCurrentUser] = useState(storage.getItem("user"))
  const [rating,setRating] = useState(1)
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  async function fetchData() {
    const response = await axios.get('/pin')
    setPins(response.data);
  }
   
  const handleMarkerClick = (id,lat,long) => {
    setCurrentPin(id)
  }

  const handleAddClick = (e) => {
    // e.preventDefault();
    const {lng,lat} = e.lngLat
    console.log(e)
    setNewPlace({
      lat:lat,
      long:lng
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try {
      const res = await axios.post('/pin',newPin)
      setPins([...pins,res.data])
      setNewPlace(null)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = (e) => {
      storage.removeItem("user")
      setCurrentUser(null)
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (err) {
      console.log(err)
    }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
    <div className='buttons'>
       { currentUser ? (
          <button className='button logout' onClick={handleLogout}>Logout</button>
       ):(
        <>
        <button className='button login'  onClick={()=>setShowLogin(true)} >Login</button>
        <button className='button register' onClick={()=>setShowRegister(true)}>Register</button>
        </>
       )}
     </div>
    <ReactMapGL
      doubleClickZoom={false}
      mapboxAccessToken={process.env.REACT_APP_MAPKEY}
      width="100%"
      height="100%"
      transitionDuration="200"
      mapStyle="mapbox://styles/mapbox/outdoors-v11"
      onDblClick={currentUser&& handleAddClick}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {pins.map( p=> {
        return (
          <>
            <Marker
              longitude={p.lat}
              latitude={p.long}
              anchor="left"
            >
            <RoomIcon  style={{ cursor: "pointer"}}
                onClick={ () => {handleMarkerClick(p._id,p.lat,p.long)}} 
            />
            </Marker>
            {p._id === currentPin && (
            <Popup
                longitude={p.lat}
                latitude={p.long}
                anchor="top-right"
                closeOnClick={false}
                onClose={() => {setCurrentPin(null)}}
              >
                <div className='card'>
                  <label>Title</label>
                  <div>{p.title}</div>
                  <label>Rating</label>
                    <span>
                    {p.rating && [...Array(Number(p.rating))].map((e,i) => <StarIcon key={'star-'+i} className='staricon'/> )}
                    </span>
                    <label>Created By</label>
                    <div>{p.username}</div>
                </div>
              </Popup>) }
            
          </>
          )
        })}
        {newPlace && (
          <Popup
          longitude={newPlace.lat}
          latitude={newPlace.long}
          anchor="top-right"
          closeOnClick={false}
          onClose={() => {setNewPlace(null)}}
        >
          <div className='form'>
             <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder='Enter Title' onChange={(e)=>setTitle(e.target.value)}/>
              <label>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1" >1</option>
                <option value="2" >2</option>
                <option value="3" >3</option>
                <option value="4" >4</option>
                <option value="5" >5</option>
              </select>
              <hr/>
              <button type="submit" className='submit'>Add Pin</button>
             </form>
          </div>
  </Popup>
        )}
        

     </ReactMapGL>
     
     
     {showRegister && (
        <Register setShowRegister={setShowRegister} />
     )}
     {showLogin && (
        <Login setShowLogin={setShowLogin} storage={storage} setCurrentUser={setCurrentUser}/>
     )}
     </div>
  );
}

export default App;
