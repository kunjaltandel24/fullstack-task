const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const router = require('./routes');

const app = express();
const port = process.env.PORT || 8000;

require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use('/static',express.static(path.join(__dirname, '../client/build')));

app.use('/api', router);

app.get('/api/health', (req, res) => {
    res.send({success: true});
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
});
