const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors')
const path=require('path')
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const socketIO=require('socket.io')
const http =require ("http");
const server = http.createServer(app);
const io= socketIO(server,{ cors : { origin : '*'}});

// const io = require('socket.io')(http,{cors:{origin:"*"}});


io.on("connection",(socket)=>{
    console.log('websocket connected');
    socket.on("message",(msg,userName,groupId,userId)=>{
        socket.broadcast.emit("message",msg,userName,groupId,userId)
    });
    socket.on("file",(message,userName,groupId,userId)=>{
        socket.broadcast.emit("file",message,userName,groupId,userId)

    })
})



require('dotenv').config()



const sequelize=require('./utils/database');
const userRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');
const groupRoutes=require('./routes/group')
const downloadroutes = require('./routes/chat')

const User=require('./model/user');
const Message=require('./model/chat');
const Group=require('./model/group');
const UserGroup=require('./model/usergroup');
// const downloadFile = require('./model/downloadFile');






app.use(express.static('Frontend'));
app.use(cors({
    origin:'*'
}));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);

app.use(groupRoutes);
app.use('/expense', downloadroutes);


app.use((req, res) => {
    console.log('url', req.url);
    res.sendFile(path.join(__dirname, `Frontend/${req.url}`))
})





// //relationship
User.hasMany(Message);
Message.belongsTo(User);



Group.belongsToMany(User,{through:UserGroup});
User.belongsToMany(Group,{through:UserGroup})

Group.hasMany(Message);
Message.belongsTo(Group);








sequelize.sync()
.then((res)=>{
    app.listen(process.env.PORT,()=>console.log('Server starts....'))
})
.catch(err=>console.log(err));












