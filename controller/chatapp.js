const User=require('../model/user');
const Message=require('../model/chat');

const {Op}=require('sequelize')


const postMesage = async (req, res, next) => {
    const { message, groupId } = req.body;
    const file = req.file; // Assuming you use 'file' as the field name for the uploaded image
  
    console.log(message, groupId);
    try {
      const newMessageData = {
        message,
        name: req.user.name,
        userId: req.user.id,
        groupId,
        text: 'text'
      };
  
      if (file) {
        // Save the file details to the database if needed
        newMessageData.fileName = file.originalname;
        newMessageData.filePath = file.path;
        newMessageData.fileMimeType = file.mimetype;
      }
  
      // Create a new message document including the file details, if provided
      await Message.create(newMessageData);
  
      const newMessage = {
        message,
        name: req.user.name,
        userId: req.user.id
      };
  
      res.status(200).json({ newMessage, msg: 'Successfully sent', success: true });
  
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(500).json({ error });
    }
  };
//   app.post("/api/postMessage", upload.single("file"), postMesage);



const getMessages=async(req,res,next)=>{
        const groupId=req.params.groupId;
        console.log('>>>>groupid',groupId);
   try {
         const data=await Message.findAll({where:{groupId}})
         console.log(data);
         res.status(202).json({allGroupMessages:data,success:true})
   } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Something wrong Unable to get the Chat',error})
   }

}








module.exports={postMesage,getMessages}