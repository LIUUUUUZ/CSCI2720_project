import './App.css';
import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation,
  } from 'react-router-dom';

const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg" data-bs-theme="dark" style={{backgroundColor: colorSet.CUHKPurple, marginBottom: "3vh"}}>
        <div className="container-fluid">
          <div className="col-6">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="navbar-brand" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="navbar-brand" to="/favorites">Favorites</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

// Home page
const Home = () => {
  return (
    <div className='main-container'>
      <LocationList />
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

  componentDidMount() {
    // Get info
    const url = 'localhost:5000'
    fetch(`http://${url}/location-list`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          originalLocationList: data,
          shownLocationList: data,
          isFetching: false
        });
      })
      .catch(error => {
        console.log('Error fetching location list:', error);
        this.setState({ isFetching: false });
      });
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

  // For user task 3, search locations
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
              Event Numbers
            </button>
          </ul>

          {shownLocationList.map(location => (
            <ul key={location.ID} className="list-group list-group-horizontal-lg margin-bot">
              <button type="button" className="list-group-item list-group-item-action flex-fill">{location.info.locationName}</button>
              <button type="button" className="list-group-item list-group-item-action flex-fill">{location.info.eventNum}</button>
            </ul>
          ))}
        </div>
      );
    }
  }
}

// 'My favorites' page
const Favorites = () => {
  return <h1>This is a Favorites page.</h1>
}

// Location information page
class LocationPage extends React.Component {
  render() {
    return <h1>This is a location page.</h1>
  }
}

// No matched link
const NoMatch = () => {
  const location = useLocation()
  return (
      <h3>
          No Match for <code>{location.pathname}</code>
      </h3>
  )
}

export default App;
