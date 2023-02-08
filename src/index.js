const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const {createOrder} = require("./controllers/paymentController");
const dotenv = require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.set('port', process.env.PORT || 5000)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

const api = process.env.PAYPAL_API;
console.log(api);
app.get('/', (req, res) => {
    res.render('index', { api });
})

app.post('/create-order', createOrder)

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})

