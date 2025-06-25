import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './auth/routes/auth.routes.js';
import employerRoutes from './employer/routes/employer.routes.js';
import collegeRoutes from './college/routes/college.routes.js';
import adminRoutes from './admin/routes/admin.routes.js';
import notificationRoutes from './notifications/routes/notification.routes.js';

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'https://teacherjob-portal.onrender.com'], // Allow both local and deployed frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = 4000; // Fixed port to match frontend configuration
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 