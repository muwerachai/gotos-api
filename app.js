require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");


const notFoundMiddleware = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authenticateMiddleware = require("./middlewares/authenticate");

const authRoute = require('./routes/authRoute');
const placeRoute = require('./routes/placeRoute');
const profileRoute = require("./routes/profileRoute");

const { addProvince } = require("./service/provinceService");
const { addCategory } = require("./service/categoryService");

const app = express();

// const { sequelize } = require('./models');
// sequelize.sync({ force:true});
// addProvince();
// addCategory(
//   path.join(__dirname, "/public/img/attraction.jpg"),
//   path.join(__dirname, "/public/img/restaurant.jpg"),
//   path.join(__dirname, "/public/img/streetFood.jpg"),
//   path.join(__dirname, "/public/img/nightLife.jpg")
// );
// console.log(path.join(__dirname, "/public/img/attraction.jpg"));

 app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/auth',authRoute);
app.use("/place", authenticateMiddleware, placeRoute);
app.use("/profile", authenticateMiddleware, profileRoute);


app.use(notFoundMiddleware);
app.use(errorMiddleware);



const port = process.env.PORT || 8000;

app.listen(port, () => console.log('server running on port: ' + port ));