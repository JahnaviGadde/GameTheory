const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
dotenv.config();


// Import routes
const AdminRoute = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const BookingRoute = require('./routes/BookingRoute');
const CentreRoute = require('./routes/CentreRoute');
const CourtsRoute = require('./routes/CourtsRoute');
const SportsRoute = require('./routes/SportsRoute');

app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

async function connectDB() {
    try {
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB!');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1); // Exit the process if the connection fails
    }
  }
  
connectDB();

app.use(helmet());
app.use(morgan("common"));

app.use('/api/user', UserRoute);
app.use('/api/admin', AdminRoute);
app.use('/api/booking', BookingRoute);
app.use('/api/court', CourtsRoute);
app.use('/api/centre', CentreRoute);
app.use('/api/sports', SportsRoute);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});



const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
