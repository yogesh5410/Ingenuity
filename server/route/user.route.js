import { Router } from 'express';
import { register, login, forgotPassword, getUserDetails, logout, updateProgress, refreshToken } from '../controllers/user.controller.js';
// import { admin } from '../middleware/admin.js';
import auth from '../middleware/auth.js';

const userRouter = Router();
// Route to register a new user
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/reset-password', forgotPassword);
userRouter.get('/details', auth, getUserDetails);
userRouter.get('/logout', auth, logout); 
userRouter.put('/progress', auth, updateProgress)
userRouter.post('/refresh', refreshToken)
// Route to get user details (protected route, requires authentication)

export default userRouter
