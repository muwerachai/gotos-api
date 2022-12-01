require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRouter = require('./routes/authRoute');
const placeRouter = require('./routes/placeRoute');

const notFoundMiddleware = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authenticateMiddleware = require("./middlewares/authenticate");

// const { sequelize } = require('./models');
// sequelize.sync({ force:true});
const app = express();
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/auth',authRouter);
app.use("/place", placeRouter);


app.use(notFoundMiddleware);
app.use(errorMiddleware);



const port = process.env.PORT || 8000;

app.listen(port, () => console.log('server running on port: ' + port ));