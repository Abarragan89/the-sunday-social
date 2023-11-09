const express = require('express');
const path = require('path');

const app = express();

const api = require('./api')
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', api)



if (process.env.NODE_ENV === 'production') {
  // server react app when in production
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}


app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`)
})