const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();
const port = process.env.PORT || 8000;

require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
});
