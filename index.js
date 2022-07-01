const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routers = require('./routers');
const errorHandler = require('./utils/errorMidleware');

require('dotenv').config();

const app = express();

(async () => {

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(cors())
    app.use(express.static('public'));
    app.use(routers);

    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/views/index.html')
    });
    app.use(errorHandler);
})()


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
