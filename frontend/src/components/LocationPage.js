import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = 'localhost:5555'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001",
  iconGrey: "#888888"
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
    console.log(1)
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
    if (scrollYPercentage > 0) {
      window.scrollTo(0, 0);
    }
  }

  function showEvents() {
    setShownContainer('events')
    const scrollYPercentage = window.scrollY / window.innerHeight * 100
    if (scrollYPercentage > 0) {
      window.scrollTo(0, 0);
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
          <div id='location-button-line-container' className='location-button-line-container location-button-line-container-start'>
            
            {isFavorite ?
            <div className='location-button' onClick={addToFavorite}>
              <div className='location-button-border' style={{borderColor: colorSet.CUHKPurple}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={colorSet.CUHKPurple} className="bi bi-calendar-week" viewBox="0 0 16 16" style={{position: "relative", top: "2px"}}>
                  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                </svg>
              </div>
              <p className='description'>Remove</p>
            </div> :
            <div className='location-button' onClick={addToFavorite}>
              <div className='location-button-border'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={colorSet.iconGrey} className="bi bi-calendar-week" viewBox="0 0 16 16" style={{position: "relative", top: "2px"}}>
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
              </svg>
            </div>
            <p className='description'>Favorite</p>
          </div>}
            <div className='border-div' style={{height: '7vh'}}></div>
            <div className='location-button' onClick={showEvents}>
              <div className='location-button-border' style={shownContainer === 'comments' ? {} : { borderColor: colorSet.CUHKPurple }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={shownContainer === 'comments' ? colorSet.iconGrey : colorSet.CUHKPurple} className="bi bi-calendar-week" viewBox="0 0 16 16">
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
              </div>
              <p className='description'>Events</p>
            </div>
            <div className='border-div' style={{height: '7vh'}}></div>
            <div className='location-button' onClick={showComments}>
              <div className='location-button-border' style={shownContainer === 'events' ? {} : { borderColor: colorSet.CUHKPurple }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={shownContainer === 'events' ? colorSet.iconGrey : colorSet.CUHKPurple} className="bi bi-calendar-week" viewBox="0 0 16 16" style={{position: "relative", top: "1px",}}>
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </div>
              <p className='description'>Comments</p>
            </div>
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
  const [highestPrice, setHighestPrice] = useState(9999999)
  const [shownEvents, setShownEvents] = useState([])
  const events = location.events

  const filterHighestPrice = () => {
    setShownEvents(events.filter(event => event.price <= highestPrice))
  }

  const resetHighestPrice = () => {
    document.getElementById("price-search").value = ""
    setHighestPrice(9999999)
    setShownEvents(events)
  }

  useEffect(() => {
    setShownEvents(events)
  }, [])

  return (
    <div>
      <div id='location-second-line-container' className='location-second-line-container location-second-line-container-start'>
        <input id='price-search' className="form-control me-2" style={{width: "40vw", }} type="search" placeholder="Set a price, then filter the events with lower price..." aria-label="Search" onChange={e => setHighestPrice(e.target.value)} />
        <div className='second-button' onClick={filterHighestPrice}>
          <div className='second-button-border'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={colorSet.iconGrey} className="bi bi-calendar-week" viewBox="0 0 16 16" style={{position: "relative", top: "2px"}}>
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
            </svg>
          </div>
        </div>
        <div className='second-button' onClick={resetHighestPrice}>
          <div className='second-button-border'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={colorSet.iconGrey} className="bi bi-calendar-week" viewBox="0 0 16 16" style={{position: "relative", top: "2px"}}>
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg>
          </div>
        </div>
      </div>
      <div className='event-list-container'>
        {shownEvents.map(event => (
          <div key={event.ID} className='event-item-cell'>
            <div className='event-item-presenter'>{event.presenter}</div>
            <div className='event-item-price'><span style={{fontWeight: 'bold'}}>{event.price}</span> HKD</div>
            <div className="event-item-timeslots-container">
              <div className="event-item-timeslots-number">{event.time.length}</div>
              <div className="event-item-timeslots-text">Timeslots</div>
            </div>
            <div className='event-item-description'>{event.description.length > 110 ? event.description.substring(0, 108) + '...' : event.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommentContainer({user, location, comments, setComments}) {
  const [newComment, setNewComment] = useState('')

  async function submitNewComment(e) {
    if (newComment !== '') {
      e.preventDefault();
      setNewComment('')
      try {
        const response = await axios.post(`http://${SERVER_URL}/api/add-comment`, {
          locationID: location.ID,
          username: user.username,  
          text: newComment
        })
        setComments(response.data)
        window.scrollTo(0, 99999999)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div>
      <div id='location-second-line-container' className='location-second-line-container location-second-line-container-start'>
        <input id='new-comment' className="form-control me-2" style={{width: "50vw", }} type="text" placeholder="Your comment to this location..." value={newComment} onChange={e => setNewComment(e.target.value)} />
        <button className="btn btn-outline-success" type="submit" onClick={e => submitNewComment(e)}>Send</button>
      </div>
      <div className='event-list-container'>
      {comments.map((comment, index) => (
          <div key={index} className='comment-item-cell'>
            <div style={{fontWeight: 'bold', position: 'relative', top: '1vh', left: '2vh'}}>{comment.username}</div>
            <div className='border-div' style={{width: '55vw', position: 'relative', top: '1vh', marginBottom: '0.5vh'}}></div>
            <div style={{position: 'relative', top: '1vh', left: '2vh', marginBottom: '1.5vh'}}>{comment.text}</div>
          </div>
      ))}
      </div>
    </div>
  )
}

export default LocationPage;