// 记得添加访问的id对应的页面不存在时的处理措施
import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = 'localhost:5555'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function LocationPage()  {
  const [location, setLocation] = useState({})
  const [comments, setComments] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [shownContainer, setShownContainer] = useState('events')

  const { id } = useParams();
  const navigate = useNavigate()

  function noMatchedLocationID() {
    /* To be finished*/
    navigate("/")
  };

  function showComments() {
    setShownContainer('comments')
  }

  function showEvents() {
    setShownContainer('events')
  }

  useEffect(() => {
    // Get info
    axios.get(`http://${SERVER_URL}/location-page/${id}`)
    .then(response => {
      const data = response.data;
      setLocation(data.location);
      setComments(data.comments);
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
    return (
      <div className='main-container'>
        <div id='hider' className='hider'>
          <div style={{width: '98vw', height: '20vh'}}></div>
        </div>
        <div>
          <MapContainer />
        </div>
        <div id='location-info-container' className='location-info-container'>
          <div>
            <button onClick={showEvents}>Events</button>
            <button onClick={showComments}>Comments</button>
          </div>
          {shownContainer === 'events' ? <EventContainer location={location} /> : undefined}
          {shownContainer === 'comments' ? <CommentContainer comments={comments} /> : undefined}
        </div>
      </div>
    )
  }
}

function MapContainer() {
  useEffect(() => {
    const handleScroll = () => {
      const mapContainer = document.getElementById('location-map-container')
      const infoContainer = document.getElementById('location-info-container')
      const hider = document.getElementById('hider')
      const cunningMargin = document.getElementById('a-cunning-margin')

      const scrollYPercentage = window.scrollY / window.innerHeight * 100

      hider.style.top = scrollYPercentage + 'vh'
      
      if (scrollYPercentage >= 0 && scrollYPercentage <= 60) {
        mapContainer.classList.remove('location-map-container-end')
        mapContainer.classList.add('location-map-container-begin')
        mapContainer.style.width = 80 - scrollYPercentage + 'vw'
        mapContainer.style.height = 80 - scrollYPercentage + 'vh'
        mapContainer.style.top = scrollYPercentage + 'vh'

        infoContainer.style.top = scrollYPercentage + 'vh'

        hider.style.visibility = 'hidden'

        cunningMargin.style.visibility = 'hidden'
      } else if (scrollYPercentage > 60) {
        mapContainer.classList.add('location-map-container-end')
        mapContainer.classList.remove('location-map-container-begin')
        mapContainer.style.width = 20 + 'vw'
        mapContainer.style.height = 20 + 'vh'
        mapContainer.style.top = 9 + 'vh'

        infoContainer.style.top = 80 + 'vh'

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
      <gmp-map center="22.416889190673828,114.21018981933594" zoom="14" map-id="DEMO_MAP_ID">
        <gmp-advanced-marker position="22.416889190673828,114.21018981933594" title="My location">
        </gmp-advanced-marker>
      </gmp-map>
    </div>
  );
};

function EventContainer({location}) {
  const events = location.events
  return (
    <div>
      {events.map(event => (
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

function CommentContainer({comments}) {
  return (
    <div>
      {comments.map((comment, index) => (
        <div key={index} style={{border: '2px, black, solid'}}>
          <div style={{fontWeight: 'bold'}}>{comment.userName}</div>
          <div>{comment.text}</div>
        </div>
      ))}
    </div>
  )
}

export default LocationPage;