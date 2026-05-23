const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure this exists
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cors = require('cors');


// Load environment variables
dotenv.config();

// 1. RE-ENABLE DATABASE CONNECTION
connectDB();

const app = express();

// Configure CORS for frontend communication
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running... Visit /api-docs for documentation');
});

// Routes
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/projects', require('./routes/projectRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));
app.use('/api/v1/comments', require('./routes/commentRoutes'));
app.use('/api/v1/attachments', require('./routes/attachmentRoutes'));
app.use('/api/v1/workspaces', require('./routes/workspaceRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export app so it can be wrapped by serverless handlers (Vercel)
module.exports = app;

// If this file is run directly (not required by another module), start the server.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}