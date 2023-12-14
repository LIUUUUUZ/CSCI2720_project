import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate
} from 'react-router-dom';
import LocationPage from './components/LocationPage';
import LoginComponent from './components/LoginComponent';
import SignupComponent from './components/SignupComponent';
import AdminPage from './components/AdminPage';

const SERVER_URL = 'localhost:5555'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function App() {
  const [user, setUser] = useState({});
  const [locations, setLocations] = useState([])
  const [isUserNameHovered, setIsUserNameHovered] = useState(false);
  // emergency logout
  // localStorage.removeItem('user')
  // setUser({})
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      console.log('User logged in:', user);
    }
  }, [])

  function onMouseEnterUserName() {
    setIsUserNameHovered(true);
  }

  function onMouseLeaveUserName() {
    setIsUserNameHovered(false);
  }

  function setUserAfterLogin (user) {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  function logout() {
    localStorage.removeItem('user')
    setUser({})
    window.location.href = '/login'
  }

  return (
    <BrowserRouter>
      <nav>
        <div className='width-50 flex' style={{height: '100%'}}>
          <div className='nav-cell left'>
            <Link to="/">Home</Link>
          </div>
          <div className='nav-cell left'>
            <Link to='/admin-page'>Admin</Link>
          </div>
        </div>
        <div className='width-50 flex' style={{height: '100%', flexDirection: 'row-reverse'}}>
          <div className='nav-cell right' onMouseEnter={user.username ? onMouseEnterUserName : undefined} onMouseLeave={user.username ? onMouseLeaveUserName : undefined}>
            {user && user.username ?
            <div className='user-name'>{user.username.length > 10 ? user.username.substring(0, 8) + '...' : user.username}</div> :
            <Link to='/login' className='user-name' style={{cursor: 'pointer'}}>Login</Link>}
          </div>
          <div className='dropdown' style={{display: isUserNameHovered ? 'flex' : 'none'}} onMouseEnter={onMouseEnterUserName} onMouseLeave={onMouseLeaveUserName}>
            <Link className='dropdown-cell' to='favorites'> My favorites</Link>
            <div className='dropdown-cell' onClick={logout}>Log out</div>
          </div>
        </div>
      </nav>
      <div id='a-cunning-margin' className='a-cunning-margin'>
        <div style={{width: '100vw'}}></div>
      </div>

      <Routes>
        <Route path="/" element={ user.userName ? <Home setLocations={setLocations} /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={ user.userName ? <Favorites user={user} locations={locations} /> : <Navigate to="/login" />} />
        <Route path="/location-page/:id" element={ user.userName ? <LocationPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/login" element={ user.userName ? <Navigate to="/" /> : <LoginComponent onLogin={setUserAfterLogin} />} />
        <Route path='/signup' element={ user.userName ? <Navigate to="/" /> : <SignupComponent onSignup={setUserAfterLogin}/>} />
        <Route path='/admin-page/*' element={<AdminPage user={user} />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

// Home page
const Home = ({setLocations}) => {
  return (
    <div className='main-container'>
      <LocationList setLocations={setLocations} />
    </div>
  )
}

// Location list component in Home page
class LocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalLocationList: [],
      shownLocationList: [],
      isFetching: true,
      sortingStatus: false,
      searchText: "",
    };
  }

  async componentDidMount() {
    // Get info
    try {
      const response = await axios.get(`http://${SERVER_URL}/location-list`);
      const data = response.data;
      this.setState({
        originalLocationList: data,
        shownLocationList: data,
        isFetching: false
      });
      this.props.setLocations(data)
    } catch (error) {
      console.log('Error fetching location list:', error);
      this.setState({ isFetching: false });
    }
  }

  // For User task 1, sort the list
  sortList = () => {
    let list = this.state.shownLocationList
    if (this.state.sortingStatus) {
      list.reverse()
      this.setState({
        shownLocationList: list
      })
    } else {
      let len = list.length;
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (list[j].info.eventNum > list[j+1].info.eventNum) {
            let temp = list[j+1];
            list[j+1] = list[j];
            list[j] = temp;
          }
        }
      }
      this.setState({
        shownLocationList: list,
        sortingStatus: true
      })
    }
  }

  // For User task 3, search locations
  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  searchLocations = (e) => {
    e.preventDefault()
    let text = this.state.searchText
    let list = this.state.originalLocationList
    list = list.filter((location) => location.info.locationName.toLowerCase().includes(text.toLowerCase()))
    console.log(list)
    this.setState({shownLocationList: list})
  }

  render() {
    const { shownLocationList, isFetching } = this.state;

    if (isFetching) {
      return <div>Getting data...</div>;
    } else {
      return (
        <div>
          <div className="location-map-container-start" id="home-map-container">
            {<gmp-map center="114.16,22.38" zoom="14" map-id="HOME_MAP">
            <gmp-advanced-marker position="114.16,22.38" title="Venue location"></gmp-advanced-marker>
            </gmp-map>}
          </div>
          <br />

          <form className="d-flex" role="search" style={{marginBottom: '2vh'}}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={this.state.searchText} onChange={event => this.handleSearchChange(event)} />
            <button className="btn btn-outline-success" type="submit" onClick={this.searchLocations}>Search</button>
          </form>

          <ul className="list-group list-group-horizontal-lg margin-bot">
            <button className="list-group-item list-group-item-action flex-fill"
            disabled
            style={{backgroundColor: colorSet.CUHKPurple, color: "white"}}>
              Venue
            </button>
            <button className="list-group-item list-group-item-action flex-fill"
            style={{backgroundColor: colorSet.CUHKPurple, color: "white"}}
            onClick={this.sortList}>
              Total Events
            </button>
          </ul>

          {shownLocationList.map(location => (
            <ul key={location.ID} className="list-group list-group-horizontal-lg margin-bot">
              <Link to={`/location-page/${location.ID}`} className="list-group-item list-group-item-action flex-fill">{location.info.locationName}</Link>
              <Link to={`/location-page/${location.ID}`} className="list-group-item list-group-item-action flex-fill">{location.info.eventNum}</Link>
            </ul>
          ))}

          <br />
        </div>
      );
    }
  }
}

// 'My favorites' page
const Favorites = ({user, locations}) => {
  useEffect(() => {
    
  }, [])

  return (
    <div className='main-container'>
      {locations.map(location => (<div key={location.ID}>{
        user.favoriteVenueID.includes(location.ID) ?
        <div key={location.id}>{location.info.locationName}</div> : undefined
      }</div>)
    )}
    </div>
  )
}

// No matched link
const NoMatch = () => {
  const location = useLocation()
  return (
    <div className='main-container'>
      <h3>
          No Match for <code>{location.pathname}</code>!<br />
          Redirecting to login
      </h3>

    </div>
  )
}

export default App;
