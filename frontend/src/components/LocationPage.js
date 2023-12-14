import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = 'localhost:5555'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function LocationPage({user, setUser}) {
  const [location, setLocation] = useState({})
  const [comments, setComments] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [shownContainer, setShownContainer] = useState('events')

  const { id } = useParams();
  const navigate = useNavigate()

  function noMatchedLocationID() {
    /* To be finished*/
    navigate("/")
  };

  async function addToFavorite() {
    const response = await axios.post(`http://${SERVER_URL}/api/add-favorite`, {
      username: user.username,
      locationID: location.ID
    })
    const newFavoriteID = response.data
    user.favoriteVenueID = newFavoriteID
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
    // console.log(user.favoriteVenueID.favoriteVenueID)
    user.favoriteVenueID.includes(location.ID) ? setIsFavorite(true) : setIsFavorite(false)
  }

  function showComments() {
    setShownContainer('comments')
    const scrollYPercentage = window.scrollY / window.innerHeight * 100
    if (scrollYPercentage > 60) {
      const targetScrollY = 0.6 * window.innerHeight;
      window.scrollTo({
        top: targetScrollY
      });
    }
  }

  function showEvents() {
    setShownContainer('events')
    const scrollYPercentage = window.scrollY / window.innerHeight * 100
    if (scrollYPercentage > 60) {
      const targetScrollY = 0.6 * window.innerHeight;
      window.scrollTo({
        top: targetScrollY
      });
    }
  }

  useEffect(() => {
    // Get info
    axios.get(`http://${SERVER_URL}/location-page/${id}`)
    .then(response => {
      const data = response.data;
      setLocation(data.location);
      setComments(data.comments);
      if (user.favoriteVenueID.includes(data.location.ID)) {
        setIsFavorite(true)
      }
      setIsFetching(false);
    })
    .catch(error => {
      console.log('Error fetching location list:', error);
      setIsFetching(false);
      noMatchedLocationID();
    });
  }, [id]);

  if (isFetching) {
    return <div>Loading...</div>
  } else {
    const location_map = location.info.latitude + ',' + location.info.longitude
    // console.log(location_map)
    return (
      <div className='main-container'>
        <div id='hider' className='hider'>
          <div style={{width: '98vw', height: '20vh'}}></div>
        </div>
        <MapContainer position={location_map}/>
        <div id='location-info-container' className='location-info-container'>
          <div id='location-button-line-container' className='location-button-line-container-start'>
            {isFavorite ?
            <button onClick={addToFavorite}>Remove from favorite</button> :
            <button onClick={addToFavorite}>Add to favorite</button>}
            <button onClick={showEvents}>Events</button>
            <button onClick={showComments}>Comments</button>
          </div>
          <div id='location-info-body-container' className='location-info-body-container-start'>
            {shownContainer === 'events' ? <EventContainer location={location} /> : undefined}
            {shownContainer === 'comments' ? <CommentContainer user={user} location={location} comments={comments} setComments={setComments} /> : undefined}
          </div>
        </div>
      </div>
    )
  }
}

function MapContainer(props) {
  useEffect(() => {
    const handleScroll = () => {
      const mapContainer = document.getElementById('location-map-container')
      const infoContainer = document.getElementById('location-info-container')
      const buttonContainer = document.getElementById('location-button-line-container')
      const secondLineContainer = document.getElementById('location-second-line-container')
      const infoBodyContainer = document.getElementById('location-info-body-container')
      const hider = document.getElementById('hider')
      const cunningMargin = document.getElementById('a-cunning-margin')

      const scrollYPercentage = window.scrollY / window.innerHeight * 100

      hider.style.top = scrollYPercentage + 'vh'
      
      if (scrollYPercentage >= 0 && scrollYPercentage <= 60) {
        mapContainer.classList.remove('location-map-container-end')
        mapContainer.classList.add('location-map-container-start')
        mapContainer.style.width = 80 - scrollYPercentage + 'vw'
        mapContainer.style.height = 80 - scrollYPercentage + 'vh'
        mapContainer.style.top = scrollYPercentage + 'vh'

        infoContainer.style.top = scrollYPercentage + 'vh'

        buttonContainer.classList.remove('location-button-line-container-end')
        buttonContainer.classList.add('location-button-line-container-start')

        secondLineContainer.classList.remove('location-second-line-container-end')
        secondLineContainer.classList.add('location-second-line-container-start')

        infoBodyContainer.classList.remove('location-info-body-container-end')
        infoBodyContainer.classList.add('location-info-body-container-start')

        hider.style.visibility = 'hidden'

        cunningMargin.style.visibility = 'hidden'
      } else if (scrollYPercentage > 60) {
        mapContainer.classList.add('location-map-container-end')
        mapContainer.classList.remove('location-map-container-start')
        mapContainer.style.width = 20 + 'vw'
        mapContainer.style.height = 20 + 'vh'
        mapContainer.style.top = 9 + 'vh'

        infoContainer.style.top = 80 + 'vh'

        buttonContainer.classList.remove('location-button-line-container-start')
        buttonContainer.classList.add('location-button-line-container-end')
        
        secondLineContainer.classList.remove('location-second-line-container-start')
        secondLineContainer.classList.add('location-second-line-container-end')

        infoBodyContainer.classList.remove('location-info-body-container-start')
        infoBodyContainer.classList.add('location-info-body-container-end')

        hider.style.visibility = 'visible'

        cunningMargin.style.visibility = 'visible'
      
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="location-map-container-start" id="location-map-container">
      {/* <gmp-map center="22.416889190673828,114.21018981933594" zoom="14" map-id="DEMO_MAP_ID">
        <gmp-advanced-marker position="22.416889190673828,114.21018981933594" title="My location">
        </gmp-advanced-marker>
      </gmp-map> */}
      <gmp-map center={props.position} zoom="14" map-id="DEMO_MAP_ID">
        <gmp-advanced-marker position={props.position} title="Venue location">
        </gmp-advanced-marker>
      </gmp-map>
    </div>
  );
};

function EventContainer({location}) {
  const [highestPrice, setHighestPrice] = useState(0)
  const [shownEvents, setShownEvents] = useState([])
  const events = location.events

  const filterHighestPrice = () => {
    setShownEvents(events.filter(event => event.price <= highestPrice))
  }

  const resetHighestPrice = () => {
    setHighestPrice(0)
    setShownEvents(events)
  }

  useEffect(() => {
    setShownEvents(events)
  }, [])

  return (
    <div>
      <div id='location-second-line-container' className='location-second-line-container-start'>
        <input id='price-filter' type='number' min={0} step={1} value={highestPrice} onChange={e => setHighestPrice(e.target.value)}></input>
        <button onClick={filterHighestPrice}>Filter</button>
        <button onClick={resetHighestPrice}>Reset</button>
      </div>
      {shownEvents.map(event => (
        <div key={event.ID} style={{border: '2px, black, solid'}}>
          <div>{event.time}</div>
          <div>{event.description}</div>
          <div>{event.presenter}</div>
          <div>{event.price}</div>
        </div>
      ))}
    </div>
  )
}

function CommentContainer({user, location, comments, setComments}) {
  const [newComment, setNewComment] = useState('')

  async function submitNewComment() {
    try {
      const response = await axios.post(`http://${SERVER_URL}/api/add-comment`, {
        locationID: location.ID,
        username: user.username,  
        text: newComment
      })
      setComments(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div id='location-second-line-container' className='location-second-line-container-start'>
        <textarea id='new-comment' value={newComment} onChange={e => setNewComment(e.target.value)} /><br/>
        <button id='send' type='submit' onClick={e => submitNewComment(e)}>Send</button>
      </div>
      {comments.map((comment, index) => (
        <div key={index} style={{border: '2px, black, solid'}}>
          <div style={{fontWeight: 'bold'}}>{comment.username}</div>
          <div>{comment.text}</div>
        </div>
      ))}
    </div>
  )
}

export default LocationPage;