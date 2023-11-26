const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5000

app.get('/location-list', (req, res) => {
  const filePath = './public/testVenueInfo.json'

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const list = JSON.parse(data);
      const modifiedList = list.map(item => {return {ID: item.ID, info: item.info}});

      res.json(modifiedList);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})