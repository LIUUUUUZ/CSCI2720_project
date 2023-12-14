import '../App.css'
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SERVER_URL = 'localhost:5555'

function LoginComponent({onLogin}) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function login (e) {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${SERVER_URL}/api/login`, {
        username: username,
        password: password
      });
      const { user } = response.data;
      onLogin(user)
      navigate('/');
    } catch (error) {
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      setPassword('')
    }
  };

  return (
    <div className='login-form'>
      <h1>Log in</h1>
      <form onSubmit={login}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <label htmlFor="user-name" className='lb'>User Name</label>
          <input
            className="form-control me-2"
            style={{width: "30vw", }}
            type="text"
            id="user-name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            autoComplete='on'
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <label htmlFor="password" className='lb'>Password</label>
          <input
            type="password"
            id="password"
            className="form-control me-2"
            style={{width: "30vw", }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='on'
          />
        </div>
        <button type="submit" id='send' className="btn btn-outline-success">Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Link to="/signup">Don't have an account? Sign up</Link>
    </div>
  );
}

export default LoginComponent;