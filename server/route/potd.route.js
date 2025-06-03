import { Router } from 'express';
import {
  getPotdByDate,
  createPotd,
  updatePotdByDate,
  deletePotdByDate,
  getLeaderboard,
  postCheckPotdSolved, 
} from '../controllers/potd.controller.js';

import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const potdRouter = Router();

potdRouter.get('/get/:date', getPotdByDate);
potdRouter.post('/create', auth, admin, createPotd);
potdRouter.put('/update/:date', auth, admin, updatePotdByDate);
potdRouter.delete('/delete/:date', auth, admin, deletePotdByDate);
potdRouter.get('/leaderboard', getLeaderboard);

potdRouter.post('/check-solved', auth, postCheckPotdSolved); 

export default potdRouter;
