import {Router} from 'express';
const router = Router();

import * as aicontroller from '../controllers/aicontroller.js';

router.get('/test',aicontroller.test)
router.post('/generate', aicontroller.generateContent);
export default router;