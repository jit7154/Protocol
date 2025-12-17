import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req,res)=>{
 try {
    const loggedInUserID = req.user._id;
    //now filtering out all the users except loggedIn user
    const filteredUsers = await User.find({_id:{$ne:loggedInUserID}}).select("-password");
    //its a better practice to not send password 

    res.status(200).json({filteredUsers});

 } catch (error) {
    console.log("Error in getUserSidebar controller ",error.message)
     res.status(500).json({message:"Internal Server Error"})
 }
}
export const getMessages = async (req,res)=>{
    try {
        //here this fn is to fetch all messages involving 
        // me as sender/reciever with user of id passed in url as params
        //bascially messages bw me and other user 
        const {id:userToChatId}= req.params
        const myId =  req.user._id; 
      
        const messages = await Message.find({
            $or:[
                {senderId:myId,recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        })
       res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessages controller ",error.message)
        res.status(500).json({message:"Internal Server Error"})   
    }
}
export const sendMessage = async (req,res) =>{
try {
    const {text,image} = req.body
    const {id:recieverId} = req.params
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        //Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url
    }
    const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image:imageUrl,
    })
    // console.log("New message before save:", newMessage);
     await newMessage.save();
    console.log("New message after save:", newMessage);

    //todo: realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(recieverId);
    console.log("Receiver Socket ID:", receiverSocketId); // Added console.log

    if(receiverSocketId){
        //one-o-one chat
        io.to(receiverSocketId).emit("newMessage",newMessage); //.to() is used to update the message in real time only to reciever user 
    }

    // if (receiverSocketId) {
    //     console.log("Emitting message to:", receiverSocketId, "Message:", newMessage); // Debugging 7
    //     io.to(receiverSocketId).emit("newMessage", newMessage);
    //     console.log(`Emitting message to ${receiverSocketId}`); // Debugging 8
    //   } else {
    //     console.log(`Receiver socket ${newMessage.recieverId.toString()} not found.`); // Debugging 9
    //   }

    res.status(201).json(newMessage)

} catch (error) {
    console.log("Error in sendMessage controller ",error.message)
     res.status(500).json({message:"Internal Server Error"})   
   
}
}


