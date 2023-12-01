// 记得添加访问的id对应的页面不存在时的处理措施
import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SERVER_URL = 'localhost:5000'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function LocationPage()  {
  const [location, setLocation] = useState({})
  const [isFetching, setIsFetching] = useState(true)

  const { id } = useParams();
  const navigate = useNavigate()

  function noMatchedLocationID() {
    /* To be finished*/
    navigate("/")
  };

  useEffect(() => {
    // Get info
    fetch(`http://${SERVER_URL}/location-page/${id}`)
    .then(response => response.json())
    .then(data => {
      setLocation(data)
      setIsFetching(false)  
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
          121312131gidsiufisgfdisgfidsuagufosfguyasguadsyvjyadstyfadsgvjydasvjasdfyvadsjyfvadsjyvfdsayjgv
        </div>
      </div>
    )
  }
}

const MapContainer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const mapContainer = document.getElementById('location-map-container')
      const infoContainer = document.getElementById('location-info-container')
      const hider = document.getElementById('hider')
      const cunningMargin = document.getElementById('a-cunning-margin')

      const scrollYPercentage = window.scrollY / window.innerHeight * 100

      mapContainer.style.top = scrollYPercentage + 'vh'
      hider.style.top = scrollYPercentage + 'vh'
      
      if (scrollYPercentage >= 0 && scrollYPercentage <= 60) {
        mapContainer.style.width = 80 - scrollYPercentage + 'vw'
        mapContainer.style.height = 80 - scrollYPercentage + 'vh'

        infoContainer.style.top = scrollYPercentage + 'vh'

        hider.style.visibility = 'hidden'

        cunningMargin.style.visibility = 'hidden'
      } else if (scrollYPercentage > 60) {
        mapContainer.style.width = 20 + 'vw'
        mapContainer.style.height = 20 + 'vh'

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
    <div className="location-map-container" id="location-map-container">
      This is a mapContainer
    </div>
  );
};

export default LocationPage;