import jwt from "jsonwebtoken";



 const authUser = async (req, res, next) => {
    try {
       const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]);
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

       
        const decoded = jwt.verify(token, "hiiamram" );
        
        //console.log(decoded);
       // console.log("Decoded token:", decoded);
        
        req.user = decoded;
        next();
    } catch (error) {

        console.log(error);

        res.status(401).send({ error: 'Unauthorized User' });
    }
}
export default authUser;