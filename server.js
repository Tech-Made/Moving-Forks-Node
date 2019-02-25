require('dotenv').config();
const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.set('views', path.join(__dirname, 'views'));
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: require("handlebars-helpers")()
}));
app.set('view engine', 'hbs');

require('./data/moving-forks-db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const checkAuth = require('./middleware/checkAuth');

// Create routers for every route in app
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const projectRouter = require('./routes/project');

app.use(checkAuth);
app.use(userRouter);
app.use(projectRouter);
app.use(adminRouter);

const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;