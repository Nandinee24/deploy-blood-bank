const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const path = require(path)


//dot config
dotenv.config();



//rest object
const app = express();

//mongodb connection
connectDB();

//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//routes
//1 test route
app.use('/api/v1/test', require('./routes/testRoutes'));
app.use('/api/v1/auth', require('./routes/authRouts'));
app.use('/api/v1/inventory', require('./routes/inventoryRouts'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

//static folder
app.use(express.static(path.join(__dirname, './client/build')))

//static routes
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//port
const PORT = process.env.PORT || 8080;

// //listen
app.listen(PORT, () => {
    console.log(`Node server running In ${process.env.DEV_MODE} Mode on port ${process.env.PORT}`.bgCyan.white);
});
