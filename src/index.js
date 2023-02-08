const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

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

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})

