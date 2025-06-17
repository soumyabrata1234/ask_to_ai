import { Router } from 'express';

import * as usercontroller from '../controllers/projectcontroller.js';
import * as projectcontroller from '../controllers/projectcontroller.js';
import auth from '../middlewares/auth.js';
const router = Router();

// Example route
router.get('/test', (req, res) => {
    res.send('Welcome to the project Route!');
});

router.post('/create',auth, projectcontroller.createProject);
router.get('/get',auth,projectcontroller.getAllProject);
router.put('/update/:projectname',auth,projectcontroller.addUserToProject);
router.put('/add-user',auth, projectcontroller.addUserToProject);
router.get('/get-users/:projectname',auth, projectcontroller.getallusers);
export default router;