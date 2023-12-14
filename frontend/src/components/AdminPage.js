import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, Routes, Route, useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = 'localhost:5555/admin'

// User Modification Component
const ModifyUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ username: '', password: '', isAdmin: false, favoriteVenueID: [] });

  const fetchUsers = () => {
    // Replace with actual API call
    axios.get(`http://${SERVER_URL}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  };

  useEffect(() => {
    fetchUsers();
    
  }, []);

  const handleUserSelect = (username) => {
    const user = users.find(u => u.username === username);
    setSelectedUser(user || { username: '', password: '', isAdmin: false, favoriteVenueID: [] });
  };

  const handleChange = (e) => {
    let value = e.target.value;

    // Special handling for favoriteVenueID
    if (e.target.name === 'favoriteVenueID') {
      // Split by comma and trim spaces to convert string back to array
      value = value.split(',').map(item => item.trim());
    }

    setSelectedUser({ ...selectedUser, [e.target.name]: value });
  };

  const handleRadioChange = (e) => {
    setSelectedUser({ ...selectedUser, isAdmin: e.target.value === 'true' });
  };

  const handleSubmit = (action) => {
    let promise;

    if (action === 'create') {
      promise = axios.post(`http://${SERVER_URL}/users`, selectedUser);
    } else if (action === 'update') {
      promise = axios.patch(`http://${SERVER_URL}/users/${selectedUser.username}`, selectedUser);
    } else if (action === 'delete') {
      promise = axios.delete(`http://${SERVER_URL}/users/${selectedUser.username}`);
    }

    if (promise) {
      promise
        .then(response => {
          alert(`Success: ${response.data.message}`); // Customize this message based on your API response
          fetchUsers(); // Refresh user data
        })
        .catch(error => {
          alert(`Error: ${error.response.data.message}`); // Customize this message based on your API response
          fetchUsers(); // Refresh user data
        });
    }
  };

  return (
    <div>
      <h2>Modify User</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.username} onClick={() => handleUserSelect(user.username)}>
              <td>{user.username}</td>
              <td><button  className='btn btn-light' onClick={() => handleUserSelect(user.username)}>Select</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <form>
        <div className='mb-3'><label className='form-label' for='username'>Username:</label>
          <input className='form-control' type="text" name="username" value={selectedUser.username} onChange={handleChange} placeholder="Username" required={true} />
        </div>
        <div className='mb-3'><label className='form-label' for='password'>Password:</label>
          <input className='form-control' type="text" name="password" value={selectedUser.password} onChange={handleChange} placeholder="Password" required={true} />
        </div>
        <div className='mb-3'>
          <label className='form-label' for='favoriteVenueID'>Favorite Venue ID</label>
          <input  className='form-control'type="text" name="favoriteVenueID" value={selectedUser.favoriteVenueID.join(', ')} onChange={handleChange} placeholder="Favorite Venue ID" />
        </div>
        <div className='form-check'>
          <label className='form-check-label'><input className='form-check-input' type="radio" name="isAdmin" value="true" checked={selectedUser.isAdmin === true} onChange={handleRadioChange} /> Set as administrator</label>
        </div>
        <div className='form-check'>
        <label className='form-check-label'><input className='form-check-input' type="radio" name="isAdmin" value="false" checked={selectedUser.isAdmin === false} onChange={handleRadioChange} /> Set as normal user</label>
        </div>
        <button className='btn btn-primary' type="button" onClick={() => handleSubmit('create')}>Create User</button>
        <button className='btn btn-success' type="button" onClick={() => handleSubmit('update')}>Update User</button>
        <button className='btn btn-warning' type="button" onClick={() => handleSubmit('delete')}>Delete User</button>
      </form>
      <div className='border-div' style={{height: "0", margin: "10px 0"}}></div>
      <div id='instruction'><h3>IMPORTANT! Read the instructions carefully.</h3><p>To create a user, type all the credentials on the below form.</p>
        <p>To modify or delete a user, click to select the user you want to modify or delete.</p>
        <p>Warning: DO NOT MODIFY USERNAME, or the modification could be unsuccessful or resulting in unexpected behaviors.</p>
        <p>To change a user's username, change the username, choose Create User, and delete the previous one.</p></div>
    </div>
  );
};

// Event Modification Component
const ModifyEvent = () => {
  const [venues, setVenues] = useState([]);
  const [venueInfo, setVenueInfo] = useState({ locationName: '', latitude: 0, longitude: 0, eventNum: 0 });
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({ ID: '', time: '', description: '', presenter: '', price: 0 });

  const fetchVenueData = () => {
    axios.get(`http://${SERVER_URL}/venues`)
      .then(response => setVenues(response.data))
      // To refresh everything
      .then(() => {if(selectedVenue){let originalID = selectedVenue.ID; handleVenueSelect(selectedVenue.ID - 1); handleVenueSelect(originalID)}})
      .catch(error => console.error('Error fetching venues', error));
  };

  useEffect(() => {
    fetchVenueData();
    fetchVenueData();
  }, []);

  const handleVenueSelect = (venueID) => {
    if (venueID === -1) venueID = 1;
    const venue = venues.find(v => v.ID === venueID);
    setSelectedVenue(venue || null);
    setVenueInfo(venue ? venue.info : { locationName: '', latitude: 0, longitude: 0, eventNum: 0 });
    setEvents(venue ? venue.events : []); // Assuming each venue has an 'events' array}
  };

  const handleEventSelect = (eventId) => {
    const event = events.find(e => e.ID === eventId);
    setCurrentEvent(event || { ID: '', time: '', description: '', presenter: '', price: 0 });
  };

  const handleChange = (e) => {
    setCurrentEvent({ ...currentEvent, [e.target.name]: e.target.value });
  };

  const resetFormAndSwitchToCreateMode = () => {
    setCurrentEvent({ ID: '', time: '', description: '', presenter: '', price: 0 });
  };

  const handleVenueInfoChange = (e) => {
    setVenueInfo({ ...venueInfo, [e.target.name]: e.target.value });
  };

  const handleVenueFormSubmit = (action, venueId = selectedVenue.ID) => {
    let promise;
    const url = `http://${SERVER_URL}/venues`;

    let isPatch = 0;
    if (action === 'create') {
      promise = axios.post(url, venueInfo);
    } else if (action === 'update') {
      promise = axios.patch(`${url}/${selectedVenue.ID}`, venueInfo);
      isPatch = 1;
    } else if (action === 'delete') {
      promise = axios.delete(`${url}/${venueId}`);
    }

    if (promise) {
      promise
        .then(response => {
          alert(`Venue ${action} success: ${response.data.message}`);
          resetFormAndSwitchToCreateMode();
          fetchVenueData(isPatch); // Refresh venue data
        })
        .catch(error => {
          alert(`Venue ${action} error: ${error.response.data.message}`);
        });
    }
  };

  const handleSubmit = (action, eventId = currentEvent.ID) => {
    let promise;
    const url = `http://${SERVER_URL}/venues/${selectedVenue.ID}/events`;

    if (action === 'create') {
      promise = axios.post(url, currentEvent);
    } else if (action === 'update') {
      promise = axios.patch(`${url}/${eventId}`, currentEvent);
    } else if (action === 'delete') {
      promise = axios.delete(`${url}/${eventId}`);
    }

    if (promise) {
      promise
        .then(response => {
          alert(`Success: ${response.data.message}. Please click "Edit" of this venue again, or refresh the page, to see the updated event list.`);
          resetFormAndSwitchToCreateMode();
        }).then(() => fetchVenueData())
        .catch(error => {
          alert(`Error: ${error.response.data.message}`);
          fetchVenueData();
        });
    }
  };

  return (
    <div>
      <h2>Venue List</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Venue ID</th>
            <th>Location Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map(venue => (
            <tr key={venue.ID}>
              <td>{venue.ID}</td>
              <td>{venue.info.locationName}</td>
              <td>
                <button className='btn btn-primary' onClick={() => handleVenueSelect(venue.ID)}>Edit</button>
                <button className='btn btn-secondary' onClick={() => handleVenueFormSubmit('delete', venue.ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVenue && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginRight: '10px' }}>Modify Event and Venue</h2>
            <button  className='btn btn-dark' onClick={resetFormAndSwitchToCreateMode}>Switch to Create Mode</button>
          </div>

          <div>
            <h4>{'Edit Venue or Create New Venue'}</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleVenueFormSubmit('update') }}>
              <input type="hidden" name="ID" value={selectedVenue.ID} />
              <div className='mb-3'><label className='form-label'>Location Name:<input className='form-control' type="text" name="locationName" value={venueInfo.locationName} onChange={handleVenueInfoChange} /></label></div>
              <div className='mb-3'><label className='form-label'>Latitude:<input className='form-control' type="number" name="latitude" value={venueInfo.latitude} onChange={handleVenueInfoChange} /></label></div>
              <div className='mb-3'><label className='form-label'>Longitude:<input className='form-control' type="number" name="longitude" value={venueInfo.longitude} onChange={handleVenueInfoChange} /></label></div>
              <div className='mb-3'><label className='form-label'>Event count:<input className='form-control' type="text" name="eventNum" value={venueInfo.eventNum} onChange={handleVenueInfoChange} readOnly='true' /></label></div>

              <div><button className='btn btn-success' type="submit">Update Venue</button>

                <button className='btn btn-warning' type="button" onClick={() => handleVenueFormSubmit('delete')}>Delete Venue</button>
                <button className='btn btn-danger' type="button" onClick={() => handleVenueFormSubmit('create')}>USE WITH CAUTION: Create Venue</button></div>
              

            </form>
          </div>
        <div className='border-div' style={{height: "0", margin: "10px 0"}}></div>
          <h4 >Events at this Venue</h4>

          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Description</th>
                <th>Presenter</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.ID}>
                  <td>{event.ID}</td>
                  <td>{event.time}</td>
                  <td>{event.description}</td>
                  <td>{event.presenter}</td>
                  <td>{event.price}</td>
                  <td>
                    <button  className='btn btn-light' onClick={() => handleEventSelect(event.ID)}>Select</button>
                    <button  className='btn btn-light' onClick={() => {handleSubmit('delete', event.ID)}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



          <h4>{currentEvent.ID ? 'Edit Event' : 'Create New Event'}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(currentEvent.ID ? 'update' : 'create'); }}>
            <input type="hidden" name="ID" value={currentEvent.ID} />
            <div className='mb-3'><label className='form-label'>Time:<input className='form-control' type="text" name="time" value={currentEvent.time} onChange={handleChange} required={true} /></label></div>
            <div className='mb-3'><label className='form-label'>Description:<input className='form-control' type="text" name="description" value={currentEvent.description} onChange={handleChange} required={true} /></label></div>
            <div className='mb-3'><label className='form-label'>Presenter:<input className='form-control' type="text" name="presenter" value={currentEvent.presenter} onChange={handleChange} required={true} /></label></div>
            <div className='mb-3'><label className='form-label'>Price:<input className='form-control' type="number" name="price" value={currentEvent.price} onChange={handleChange} required={true} /></label></div>

            <button className='btn btn-success' type="submit">{currentEvent.ID ? 'Update Event' : 'Create Event'}</button>
          </form>
        </div>
      )}
      <div className='border-div' style={{height: "0", margin: "10px 0"}}></div>
      <div id='instruction'><h3>IMPORTANT! Read the instructions carefully.</h3><p>Click the Edit button to edit venue info and access all the events in the location. To create a new venue, you should also click any Edit first.</p>
        <p>Then, to modify or delete a venue, modify the contents and click "update event". Event ID is not modifiable.</p>
        <p>To modify or delete an event in a venue, click the buttons beside the event you want to modify or delete.</p>
        <p>To add a new event in a venue, ONLY do it when the current function is Create New Event. If the current function is Edit Event, click the Switch to Create Mode button.</p>
        <p>Note that event ID cannot be designated manually. The system automatically allocate an ID.</p>
        <p>ADD venue should be performed with caution. First, enter the info of new venue, then click "USE WITH CAUTION: Create Venue" button. You MUST then edit this venue by clicking the Edit button beside this newly created venue. A placeholder venue is set. Please initiate one event in this venue by editing it to make sure everything works properly in the app.</p></div>
    </div>
  );
};
function AdminPage({ user, killCunningMargin }) {
  const navigate = useNavigate();

  useEffect(() => {
    killCunningMargin()
  }, [])

  return (
    <div className='main-container'>
      <h1>Admin Page</h1>
      <p>Logged in as: {user.username}</p>
      <button className='btn btn-light' onClick={() => navigate('/admin-page')}>Admin Home</button>
      <button className='btn btn-light' onClick={() => navigate('/admin-page/modify-user')}>Modify User</button>
      <button className='btn btn-light' onClick={() => navigate('/admin-page/modify-event')}>Modify Event</button>

      <Routes>
        <Route index element={<div><p>Welcome to the Admin Page. Select to modify user or modify events.</p></div>} />
        <Route path="modify-user" element={<ModifyUser />} />
        <Route path="modify-event" element={<ModifyEvent />} />
      </Routes>
    </div>
  );
}

export default AdminPage;
