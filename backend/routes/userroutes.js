import { Router } from 'express';
import usermodel from '../models/user.model.js';
import auth from '../middlewares/auth.js';
import * as usercontroller from '../controllers/usercontroller.js';
const router = Router();

// Example route
router.get('/h', (req, res) => {
    res.send('Welcome to the User Route!');
});

router.post('/login', usercontroller.loginUserController);

router.post('/register',usercontroller.createUserController); ;
router.get('/getall',auth ,async (req, res) => {
    try {
      //  console.log(req.user.email);
         const users = await usermodel.find({
        email: { $ne: req.user.email },
    });
     
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
export default router;