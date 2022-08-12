import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try{
        // extract the token from header of http request
        const token = req.header("x-auth-token");
        // validate that the token in header is signed using the same secret key as it was while generating the token
        jwt.verify(token, process.env.secret_key);
        // Only if the token is validated execute the function in the secured/protected API after the middleware
        next();
    }catch(error){
        res.status(401).send({error: error.message})
    }
}