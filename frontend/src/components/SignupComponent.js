import '../App.css'
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SERVER_URL = 'localhost:5000'

function SignupComponent({onSignup}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function signup (e) {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${SERVER_URL}/api/signup`, {
        userName: userName,
        password: password
      });
      const { user } = response.data;
      onSignup(user)
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
      <form onSubmit={signup}>
        <div>
          <label htmlFor="user-name" className='lb'>User Name</label>
          <input
            type="text"
            id="user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className='lb'>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" id='send'>Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Link to="/login">Already have an account? Log in</Link>
    </div>
  );
}

export default SignupComponent;