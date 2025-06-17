// index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import connectDB from './db/db.js';
import userroutes from './routes/userroutes.js';
import projectroutes from './routes/projectroutes.js';
import aiRoutes from './routes/ai.routes.js';
import { main} from './ai/ai.js'; // Import AI utility function
// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create server for HTTP + WebSockets

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/user', userroutes);
app.use('/project', projectroutes);
app.use('/ai', aiRoutes);
// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Middleware for token auth (optional: replace with real validation)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('❌ Connection rejected: no token');
    return next(new Error('Authentication error: no token'));
  }

  // TODO: Replace with JWT validation if needed
  //console.log(`🔐 Received token from socket ${socket.id}: ${token}`);
  next();
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('joinRoom', (project_id) => {
    if (project_id) {
      console.log(`📦 Socket ${socket.id} joining room: ${project_id}`);
      socket.join(project_id);
    } else {
      console.log(`⚠️ No project_id provided by socket ${socket.id}`);
    }
  });

  // Example: Listen for a message and emit to the room
  socket.on('sendMessageToRoom', async ({ project_id, message ,sender}) => {


         
        

        const aiIsPresentInMessage = message.includes('@ai');
        if (aiIsPresentInMessage) {


            const prompt = message.replace('@ai', '');

            const result = await main(prompt);

          //  console.log(`AI Response: ${result}`);
            io.to(project_id).emit('receiveMessage', {
                message: result,
                sender: 'AI',
            });


            return;
        }

    if (project_id && message) {
     // console.log(`💬 Message to ${project_id}: ${message} : ${sender}`);
      socket.to(project_id).emit('receiveMessage', { message, sender });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
 // console.log(`✅ Server listening on http://localhost:${PORT}`);
});
