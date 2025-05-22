const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();1
const locationRoutes = require('./routes/locationRoutes');
const attendanceRoutes = require('./routes/attendance')

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/employeeRoutes'))
app.use('/api/locations', locationRoutes);
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/attendance', attendanceRoutes)



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
