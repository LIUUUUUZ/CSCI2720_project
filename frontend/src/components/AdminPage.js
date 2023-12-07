import '../App.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = 'localhost:5555'

function AdminPage({user}) {
  useEffect(() => {
    console.log("miemie")
  }, [])

  const [niumo, setNiumo] = useState('choubin')
  return (
    <div className='main-container'>
      <div>{niumo}</div>
      <div>{user.userName}</div>
    </div>
  )
}

export default AdminPage;