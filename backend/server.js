const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5555
let LOCATION_LIST = []
let USER_LIST = []

/* Initialize the whole requested data */
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

const venueInfoPath = './public/testVenueInfo.json';
const userInfoPath = './public/testUserInfo.json';

readFileAsync(venueInfoPath)
.then((data) => {
  LOCATION_LIST = data;
})
.catch((err) => {
  console.error('Error reading venue file:', err);
});

readFileAsync(userInfoPath)
.then((data) => {
  USER_LIST = data;
})
.catch((err) => {
  console.error('Error reading user file:', err);
});

/* Initialize the whole requested data */

// Visit the home page
app.get('/location-list', (req, res) => {
  try {
    const modifiedList = LOCATION_LIST.map(item => {return {ID: item.ID, info: item.info}});
    res.json(modifiedList);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Visit any location page
app.get('/location-page/:locationID', (req, res) => {
  const locationID = req.params.locationID
  try {
    res.json(LOCATION_LIST[locationID]);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Log in
app.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;
  // Authenticate user with email and password
  for (let i = 0; i < USER_LIST.length; i++) {
    const user = USER_LIST[i];
    if (user.userName === userName) {
      if (user.password === password) {
        return res.status(200).json({user/*, idToken*/});
      } else {
        res.status(401).json({ message: 'Authentication failed. Please try again.' });
        return;
      }
    } else {
      continue;
    }
  }
  res.status(401).json({ message: 'No user credential found. Please sign up.' });
});

// Sign up
app.post('/api/signup', async (req, res) => {
  // 往数据库里添加信息你们写吧
  // 记得检测有无同名
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
