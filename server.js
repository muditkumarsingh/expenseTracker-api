require('dotenv').config()
const express = require("express");
const cors = require("cors")
const path = require('path')
const connectDB = require('./config/db')
const mongoose = require("mongoose")
const authRoutes = require('./routes/authRoutes')
const incomeRoutes= require('./routes/incomeRoutes')
const expenseRoute = require('./routes/expenseRoutes')
const dashboardRoute = require('./routes/dashboardRoutes')

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use(express.json()) 

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));

connectDB();



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoute);
app.use('/api/v1/dashboard', dashboardRoute);

//server upload folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")))


const PORT = process.env.PORT || 5000
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
