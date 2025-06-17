import  User  from '../models/user.model.js';

export const createUserController =  async (req, res) => {

    
    try {
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
      const user =await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword =  await User.hashPassword(password);
        const no =await User.countDocuments();
        const newUser =   new User({ email, password: hashedPassword,id:no +1});
        newUser.save();
        console.log(newUser);
        const token = await newUser.generateJWT();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({
           newUser,
            token,
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email t and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = await user.generateJWT();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
         // Set the cookie with the token
        res.status(200).json({
            user,
            token,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}   

export const logoutUserController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    

}