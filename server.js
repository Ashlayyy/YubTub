const express = require('express')
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));

app.get('/', function(req, res) {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/js', express.static('./js'));
app.use('/data', express.static('./data'));
app.use('/css', express.static('./css'));
app.use('/images', express.static('./images'));
app.use('/videos', express.static('./videos'));

app.listen(8001, () => {
  console.log(`App listening on port 8001`)
});