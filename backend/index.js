const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB=require("./config/db");

dotenv.config();
connectDB();

const app=express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/documents",require('./routes/documentRoutes'))


const PORT = process.env.PORT||5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
