// import User from "../models/userModels";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check for required fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return; // Stop further execution
    }
  
    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return; // Stop further execution
    }
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
  
    // Save the new user to the database
    try {
      await newUser.save();
      createToken(res, newUser._id);


      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //LOGIN ROUTE........
  
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    createToken(res, user._id);

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
    });
});

const logoutUser = asyncHandler(async(req,res)=>{

  //  console.log("hi i am here")
    res.cookie("jwt",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict"
    })

    res.status(200).json({message:"successfully logged out"})
})



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id);

   if(user){
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    })
   }else{
    res.status(404).json({message:"User not found"})
   }
})

const updateCurrentUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updatedUser = await user.save()
      
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      })
    }else{
      res.status(404).json({message:"User not found"})
    }
})

const deleteUserById = asyncHandler(async(req,res)=>{
   
  const user = await User.findById(req.params.id);
  if(user){
    if(user.isAdmin){
      res.status(400).json({message:"Cannot delete admin"})
    }

    await User.deleteOne({_id:user._id});
    res.json({message:"User deleted successfully"})
  }else{
    res.status(404).json({message:"User not found"})
  }

})

const getUserById = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id);
  if(user){
    res.json(user)
  }else{
    res.status(404).json({message:"User not found"})
  }
})

const updateUserById = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id);
  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;


    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
  }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  }else{
    res.status(404).json({message:"User not found"})
  }
})
    


export { 
  createUser , 
  loginUser, 
  logoutUser, 
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById
};