import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { DatabaseService } from './services/database.service';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Ensure database is initialized
DatabaseService.getInstance();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});