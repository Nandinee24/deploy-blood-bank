const mongoose = require('mongoose');
const colors = require('colors');

// const mongooseOptions = {
//     useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        console.log(`Connected to mondodb database ${mongoose.connection.host}`.bgMagenta.yellow);
    } catch (error) {
        console.log(`Mongodb Databse error ${error}`.bgRed.white);
    };
};

module.exports = connectDB;

/* for opening and accessing mongodb first open mongodb's bin folder in terminal 
and type ./mongod --dbpath C:\Users\vekar\OneDrive\Documents*/