import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
    const {fullname,email,password} =req.body;
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message:"Please enter all  fields"})
        }
        
        //hash passwords using bcrypt
        if(password.length < 6){
           return  res.status(400).json({message:"Password must be atleast 6 characters long"});
        }

        const user = await User.findOne({email})
        
        if(user) return res.status(400).json({message:"Email already in use"});
       
        // const salt = await bcrypt.genSalt(10)
        // const hashedpassword= await bcrypt.hash(password,salt);

        const hashedpassword = await bcrypt.hash(password, 10);



        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedpassword,
        })

       if(newUser){
        // console.log("newUser._id:", newUser._id);
        // console.log("Type of newUser._id:", typeof newUser._id);

          //now new user is created so 
          //now we have to generate jwt token for it
          generateToken(newUser._id,res)
          await newUser.save();
           
          res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            email:newUser.email,
            profilePic:newUser.profilePic,
          })
       }else{
        return res.status(400).json({message:"Invalid User data"});
       }

    } catch (error) {
           console.log("Error in signup controller", error.message)
           res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = async (req,res)=>{
    
    const {email ,password } = req.body;
    try {
        const user= await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        //now check for password 
        //decrypt it for checking
        const isPassword = await bcrypt.compare(password,user.password)
        if(!isPassword){
            return res.status(400).json({message:"Invalid credentials"})
        }
        
        generateToken(user._id,res)
        
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            password:user.password,
            email:user.email,
            profilePic:user.profilePic,
        })

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout = (req,res)=>{
    
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller ",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
} 

export const updateProfile = async (req,res) =>{
     //now after user authenticated from protectRoute middleware 
     try {
        const {profilePic} = req.body //we are expecting frontend to return profilePic named param in req only (coded accordingly :-)
        //now we can access user from req cause we had added user in req in middlware protectRoute only
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
         }
         //upload profile image in cloudinary 
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
 
        //now update user in database 
        //Its clear that cloudinary is not our database ,its just a bucket for images
        //our database is in mongoDb only

        const updatedUser =  await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}) //set new:true will return updated user in updatedUser instead of oldUser(by default) 

        //uploadResponse.secure_url is a property provided by Cloudinary's upload response that contains the secure (HTTPS) URL of the uploaded file. You would typically use this URL to store it in your MongoDB database, associating it with the relevant data.
       
        res.status(200).json({updatedUser,message:"Profile pic updated successfully "})

     } catch (error) {
        console.log("Error in update profilePic controller ",error.message);
        return res.status(500).json({message:"Internal Server Error"})
     }
}

export const checkAuth = (req,res) =>{
   try{
      res.status(200).json(req.user)
   }catch(error){
     console.log("Error in checkAuth controller ",error.message);
     res.status(500).json({message:"Internal Server Error"})
   }
}