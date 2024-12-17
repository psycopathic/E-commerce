import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModels.js';


export const authenticate = asyncHandler(async(req,res,next)=>{
    let token;

    //extraction of jwt token from cookie
    token = req.cookies?.jwt;


    if(token){
        try{

            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        }catch(error){
            res.status(404)
            .json({
                message:"Invalid token (mai middleware se bol rha hu 11)"
            })
        }
    }else{
        res.status(404)
        .json({
            message:"No token found (mai middleware se bol rha hu 22)"
        })
    }

});

export const authorizeAdmin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send("Not authorized as an admin");
    }
}


