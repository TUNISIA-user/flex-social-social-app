import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import  QUESTION from "./dbModelQuestion.js"
import Admin from "./dbAdminSchema.js"
import User from "./dbModel1.js"
import ChatSession from "./dbChatMessages.js"
import ChatTalking  from "./dbTalking.js"
import postBluskyg from "./dbCurrentPost.js"
import cors from "cors"
import multer from 'multer';
import path from "path"
import dotenv from 'dotenv';
import { Console } from 'console';

dotenv.config();


const app = express();
const PORT = 9000 ;
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:CIsVjyXyoO8MjjAs@cluster0.de4vi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('MongoDB connected'); 
})

app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:5000","http://localhost:5001","http://192.168.1.17:3000","http://192.168.1.17:9000"],                  
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));






const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

 
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Increase as needed
});
 


 
 
 



















 



app.post("/postQuestion", async (req, res) => {
    try {
   

     

        const SectionQustion = new QUESTION(req.body);
        await SectionQustion.save();
        res.status(201).send(SectionQustion);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
});
app.get("/getQuestion",async(req,res)=>{
    try{ 

        const SectionQustion =  await  QUESTION.find();
        const DataSorted = SectionQustion.sort((a,b)=>b.creVIatedAt-a.createdAt)
        res.status(201).send(DataSorted)
    }
    catch(eroor){
        res.status(404).json({message : eroor})
        console.log(`this eroor  by ${eroor}`)
    }
})
app.post('/setUserWithAnswer', upload.single('imgUser'), async (req, res) => {
    
      try {
        // Create a new user with the uploaded file data and other form data
        const formattedFilePath =  req.file.path.replace(/\\/g, '/');
    

        const setAnswer = new User({
          ...req.body,
          imgUser: formattedFilePath 

        });
      
        await setAnswer.save();
        res.status(200).json(setAnswer);
      } catch (error) {
        res.status(404).json({ message: error.message });
        console.error(`The error: ${error}`);
      }
    });
app.post("/setAdmin",async(req,res)=>{
    try{
     const setAdmin = new Admin(req.body)
     await setAdmin.save()
     res.status(200).json(setAdmin)
    }catch(eror){
        res.status(404).json({message : eror})
        console.log(`the error by ${eror}`)
    }
})
 app.put('/Admins/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const newComments = req.body.commentsFromAdmin;
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).send('Admin not found')}
        admin.commentsFromAdmin.push(...newComments);
        await admin.save();
        res.send('Comments added successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});
app.put('/setAdminstoUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const newComments = req.body.receiveMessages;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Admin not found')
        
        }
        user.receiveMessages.push(...newComments);
        await user.save();
        res.send('Comments added successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});
app.put('/putComment/:id', upload.single('image'), async (req, res) => {
    try {
        // Find the specific question by ID
        const UserCommentData = await QUESTION.findById(req.params.id);

        if (!UserCommentData) {
            return res.status(404).json({ message: "We did not find the question, we're sorry about that." });
        }

        // Add comments to the question
        if (req.body.Comment) {
            // Assuming req.body.Comment is an array of comment objects
            const comments = req.body.Comment
            UserCommentData.Comment.push(...comments);
        }

        // Handle image if it's uploaded
        if (req.file) {
            // Save image details (like path) to your database if necessary
            UserCommentData.images = UserCommentData.images || []; // Initialize if not present
            UserCommentData.images.push(req.file.path); // Store the image path
        }

        // Save updated data
        await UserCommentData.save();

        res.status(200).json({ message: "Updated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/callComments/:id", async (req, res) => {
    try {
        // Find the specific question by ID
        const CallAllComment = await QUESTION.findById(req.params.id);
        if (!CallAllComment) {
            return res.status(404).json({ message: "We don't have anything for this ID" });
        }

        // Find all documents in the QUESTION collection
        const allQuestions = CallAllComment.Comment.sort((a,b)=>b.createdAt-a.createdAt)
       
            
        // Return all the extracted comments
        res.status(200).json(allQuestions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/DashbordAdmin",async(req,res)=>{
    try{ 

        const AdminDashbord =  await  Admin.find();
        const res1 = AdminDashbord.map((b)=>b.commentsFromAdmin).flat()

        res.status(201).send(res1)
    }
    catch(eroor){
        res.status(404).json({message : eroor})
        console.log(`this eroor  by ${eroor}`)
    }
})
app.get("/allUsers",async(req,res)=>{
    try{
        const data = await User.find()
        res.status(200).json(data)
    }catch(eroor){
        console.log(`this eroor by ${eroor}`)
        res.status(402).json({message : eroor})
    }
})
app.post('/test-upload/:id', upload.single('image'), async (req, res) => {
    try {
        // Find the question by ID
        const UserCommentData = await QUESTION.findById(req.params.id);
        if (!UserCommentData) {
            return res.status(404).json({ message: "We did not find the question, we're sorry about that." });
        }

        // Create a new comment object
        const newComment = {
            id: req.body.id, // User ID
            comment: req.body.CommentText, // Comment text
            UsernameComment: req.body.UsernameComment, // Username
            ProfileImg : req.body.ProfileImg
        };

        // Add image path if an image was uploaded
        if (req.file) {
            newComment.imgComment = req.file.path; // Image path
        }

        // Add the comment to the question
        UserCommentData.Comment.push(newComment);

        // Save the updated question data
        await UserCommentData.save();

        res.status(200).json({ message: 'Comment uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});
app.post("/ChatSession", async (req, res) => {
    try {
        const { idSession, PrivateSession } = req.body;

        // Log the request body to inspect the data
        console.log("Request Body:", req.body);

        if (!idSession || !Array.isArray(PrivateSession)) {
            return res.status(400).json({ message: "idSession and PrivateSession are required." });
        }

        // Create a new ChatSession object with multiple messages in the PrivateSession array
        const newChatSession = new ChatSession(req.body);

        // Log the newly created ChatSession object
        console.log("New ChatSession:", newChatSession);

        // Save the new chat session to the database
        await newChatSession.save();

        // Respond with a success message
        res.status(201).json({ message: "Chat session created successfully", session: newChatSession });
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
app.get("/getChatPostForAdmin",async(req,res)=>{
    try{
        const responseId = await ChatSession.find()
        res.status(200).json(responseId)

    }
    catch(index){
        console.log(index)
        res.status(404).json({message : index})
    }
})
app.put("/ChatSession/:idSession", async (req, res) => {
    try {
        const { idSession } = req.params;
        const { PrivateSession } = req.body; // Array of new messages

        if (!Array.isArray(PrivateSession)) {
            return res.status(400).json({ message: "PrivateSession should be an array of messages." });
        }

        // Find the session by idSession and push the new messages into the PrivateSession array
        const updatedSession = await ChatSession.findOneAndUpdate(
            { idSession },
            { $push: { PrivateSession: { $each: PrivateSession } } }, // Push each new message into the array
            { new: true } // Return the updated document
        );

        if (!updatedSession) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        res.status(200).json({ message: "Messages added successfully", session: updatedSession });
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
app.get("/getChat/:userid",async(req,res)=>{
    try{
     const reponseGetData  = await ChatSession.find({idSession:req.params.userid})
     res.status(200).json(reponseGetData[0].PrivateSession) // and this should be Handel This Data 
     
    }
    catch(eroor){
        console.log(`this eroor by ${eroor}`)
        res.status(404).json({message :  "this user not found in this data base check other data bases"})
        res.status(405).json({message : eroor})
    }
})
app.get("/auth/:email",async(req,res)=>{
    try{
     const response = await User.find({email:req.params.email})
     res.status(202).json(response)
    }
    catch(eroor){
        console.log(`this eroor by ${eroor}`)
        res.status(404).json({message : eroor})
    }
})
app.put("/check/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            {chatWithAdmin1:true},
            {new : true}
        );
        if (!user) {
            return res.status(404).json({ message: "This user does not exist" });
        }
        // inside  the user their chalo bame chatWithadmin i wanna chang this ture 
        res.status(200).json(user);
    } catch (error) {
        console.log(`This error caused: ${error}`);
        res.status(500).json({ message: error });
    }
});
app.post("/pushMyBasket/:id", async (req, res) => {
    try {
        const Document = req.body;
         
        const testUser = await User.findById(req.params.id);
        
        if (!testUser) {
            return res.status(404).json({ message: "This user does not exist" });
        }

        const existingPost = testUser.SaveMyPost.find(post => post.text === Document.text);
        
        if (existingPost) {
            return res.status(400).json({ message: "This question is already in your basket." });
        }  


        testUser.SaveMyPost.push(Document);
        await testUser.save(); // Save the updated user document

        res.status(200).json({ message: "Document successfully added", SaveMyPost: testUser.SaveMyPost });

    

    } catch (error) {
        console.log(`This error: ${error}`);
        res.status(500).json({ message: "An error occurred" });
    }
});
app.get("/getProfile/:id",async(req,res)=>{
    try{
       const response = await User.findById(req.params.id)
       
       if(!response){
        res.status(400).json({message : "this id not here exist"})
       }
       res.status(200).json(response.SaveMyPost)
    }catch(eroor){
        console.log(`this eroor by ${eroor}`)
        res.status(404).json({message :eroor})
    }
})
app.post("/postVies/:id",async(req,res)=>{
    try{
        const {userIdJoin} = req.body

     const  userQuestion = await QUESTION.findById(req.params.id)
     const  testIdUser = await User.find({_id:userIdJoin})
     if(!testIdUser){
        res.status(404).json({msssage : "ops this user ddens not here"})
     }
     
     if(!userQuestion){
        res.status(404).json({message :" we dont find the user here "})
     }
    const CheckQuestion = userQuestion.view.filter((b)=>b===userIdJoin)
     if(CheckQuestion.length>0){
          res.status(400).json({message :"This id already here"})
}
else{
    const UpdateOne = await QUESTION.findOneAndUpdate(
        {_id:req.params.id},
        {$push :{view : req.body.userIdJoin}},
        {new:true}
     )
     res.status(202).json(UpdateOne)

}
   

    }
    catch(eroor){
        console.log(`This Eroor by ${eroor}`)
        res.status(404).json({message : eroor})
    }
})
app.get("/viewLen/:id",async(req,res)=>{
    try{
      const View =  await QUESTION.findById(req.params.id)
     
     
      res.status(200).send(View.view)
    }
    catch(eroor){
        console.log(`this eroor by ${eroor}`)
        res.status(404).json({message :eroor})
    }
})
 app.post("/deltevi/:id",async(req,res)=>{
     try{
      
      const  userQuestion = await QUESTION.findById(req.params.id)

      if(!userQuestion){
         res.status(404).json({message :" we dont find the user here "})
      }
 
      const UpdateOne = await QUESTION.findOneAndUpdate(
         {_id:req.params.id},
         {$pull :{view : req.body.userIdJoin}},
         {new:true}
      )
      res.status(202).json(UpdateOne)
      

     }
     catch(eroor){
         console.log(`This Eroor by ${eroor}`)
         res.status(404).json({message : eroor})
     }
 })

app.post("/deltePosts/:id",async(req,res)=>{
    try{
    const {userPost} = req.body
     const Data = await User.findById(req.params.id)
     if(!Data){
        res.status(404).json("This Post Does Not Exist")
     }
   
      

     const UpdateOne = await User.findOneAndUpdate(
        {_id:req.params.id},
        {$pull :{SaveMyPost : {_id:userPost}}},
        {new:true}
     )

    res.status(200).json(UpdateOne)


    }catch(eroor){
        res.status(404).json({message : eroor})
    }
}) // and this data goona be dlet it 

// -----------------------section Chat app------------------------------------------------------------
app.post("/accesMessage/:id", async (req, res) => {
    try {
        const { userId, txt ,imgUser} = req.body; 
 
        let isChat = await ChatTalking.findOne({
            $and: [
                { users: { $elemMatch: { $eq: req.params.id } } }, 
                { users: { $elemMatch: { $eq: userId } } }  
            ]
        });

        if (isChat) {
          
            isChat.messages.push({
                imgUser : imgUser,
                senderId: userId,  
                content: txt,  
                timestamp: new Date() 
            });
            await isChat.save(); 
            return res.json(isChat);  
        } else {
             
            const newChat = new ChatTalking({
                users: [req.params.id, userId],  
                messages: []
            });
            await newChat.save(); // Save the new chat
            return res.json(newChat); // Return the new chat
        }

    } catch (error) {
        console.log(`This Error by ${error}`); // Log the error
        res.status(404).json({ message: error }); // Send a 404 response with the error message
    }
});
app.post("/get/access/message/:id",async(req,res)=>{

try{

    const { userId } = req.body; 
 
    let isChat = await ChatTalking.findOne({
        $and: [
            { users: { $elemMatch: { $eq: req.params.id } } }, 
            { users: { $elemMatch: { $eq: userId } } }  
        ]
    });
 
    res.status(200).json(isChat)


}catch(eroor){
    res.status(404).json({message : eroor})
}

})



     

 











 

app.get("/get/access/specif/:id", async (req, res) => {
    try {
      // Get the user ID from the URL parameters
      const userId = req.params.id;
  
      // Find all chats that include the specified user
      let chats = await ChatTalking.find({
        users: userId // Check if the user ID is in the users array
      });
  
      if (chats.length > 0) {
        let TalkingWith  = []
        const matchedChat = chats.filter(chat=>chat.users.includes(userId))
        matchedChat.forEach(chat=>{
           
          

            chat.users.forEach(user=>{
                if(user !==userId){
                    TalkingWith.push(user)
                }
            })
        })
        const reallyUnique = TalkingWith.filter((item)=>item!=req.params.id)
      // get operation from data  ----------------------------------------------------------
     
      const userf =  await Promise.all(
        reallyUnique.map((item)=>User.find({_id:item._id})) // in this part give me this eroor
   


      )
      //currentid:req.params.id,data:reallyUnique,
    
    
        res.status(200).json(userf.flat()); 
      } else {
        res.status(404).json({ message: "No chats found for this user" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message }); // Handle server errors
    }
  });
  









app.get("/get/allAuthor",async(req,res)=>{
    try{
           const Users1  = await User.find()
           res.status(200).json(Users1)
    }catch(eroor){
        res.status(404).json({messsage : eroor})
    }
})

app.get("/get/accesUser",async(req,res)=>{
    try{
    
    const keyWord = req.query.search  ? {
        $or : [
            {username : {$regex : req.query.search,$options:'i'}},
            {email : {$regex : req.query.search,$options:'i'}}
        ]
    }: {}

     const funcdata = await User.find(
        {...keyWord,
        _id:{$ne : req.body.currentid}})

     res.status(200).json(funcdata)

    }
    catch(eroor){
        res.status(404).json({message  : eroor.message})
    }
})


//-------------------check server online --------------------------


app.post('/update/user/status/:id',async(req,res)=>{
    try{
            await User.findByIdAndUpdate(
            {_id  : req.params.id},
            {isOnline : "true"},
            {new : true}
          )
          res.status(200).json("we Update status")
    }catch(eroor){
        res.status(404).json({message : eroor})
    }
})


app.post('/update/offline/user/status/:id',async(req,res)=>{
    try{
            await User.findByIdAndUpdate(
            {_id  : req.params.id},
            {isOnline : "false"},
            {new : true}
          )
          res.status(200).json("we Update status false succesfully")
    }catch(eroor){
        res.status(404).json({message : eroor})
    }
})





app.post('/update/offline/user/lastseen/:id',async(req,res)=>{
    try{
           const fata =  await User.findByIdAndUpdate(
            {_id  : req.params.id},
            {LastSeen : req.body.lastseen},
            {new : true}
          )
          res.status(200).json(fata)
    }catch(eroor){
        res.status(404).json({message : eroor})
    }
})



app.get("/get/date/user/:id",async(req,res)=>{
    try{
      const reponse = await User.findById(req.params.id)

  
      res.status(200).json(reponse)
}catch(eroor){
    res.status(404).json({message : eroor})
}
})



// ------------------------------------------------POSTS SECTION ----------------------
 

// so this punlic  posts 
app.post("/post-posts/:id", async (req, res) => {
    try {
        const findUser = await User.findById(req.params.id);
        if (!findUser) {
            return res.status(404).json({ message: "We couldn't find the user" });
        }

        // Create a new post
        const uploadPosts = new postBluskyg({
            userId: findUser._id,  // Reference the user by their ObjectId
            post: req.body.post,
            view: req.body.view,
            vote: req.body.vote,
            Comment: []
       
        });

        await uploadPosts.save();

        // Optionally populate user information
        const populatedPost = await postBluskyg.findById(uploadPosts._id) 

        res.status(200).json(populatedPost);  // Return the created post
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message || "An unknown error occurred" });
    }
});

// post comment 

app.post('/post-comment/:id', async (req, res) => {
    try {
        const { currentUserId, comment, imgComment, UsernameComment, ProfileImg } = req.body; // Destructure necessary fields

        // Find the post by ID
        const post = await postBluskyg.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Create a comment object to push
        const newComment = {
            idUserx: currentUserId, // Ensure currentUserId is an ObjectId
            comment,
            imgComment,
            UsernameComment,
            ProfileImg,
        };

        // Push the new comment into the Comment array
        post.Comment.push(newComment);

        // Save the updated post
        await post.save();  

        res.status(200).json(post); // Return the updated post
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "An error occurred", error });
    }
});
 
app.post('/post-comment/replies/:postId', async (req, res) => {
    try {
        const { currentUserId, comment, imgComment, UsernameComment, ProfileImg, commentId } = req.body;

        // Find the post by ID
        const post = await postBluskyg.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Find the specific comment by its ID inside the post's comments array
        const targetComment = post.Comment.find((com) => com._id.toString() === commentId);
        if (!targetComment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Create the reply object
        const newReply = {
            idUserx: currentUserId,
            comment,
            imgComment,
            UsernameComment,
            ProfileImg,
        };

        // Push the new reply into the replies array of the specific comment
        targetComment.replies.push(newReply);

        // Save the updated post
        await post.save();  

        res.status(200).json(post); // Return the updated post
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "An error occurred", error });
    }
});












// app.delete('/post-comment/replies/:id', async (req, res) => {
//     try {
//         const { commentId, replyId } = req.body;

//         // Check if both commentId and replyId are provided
//         if (!commentId || !replyId) {
//             return res.status(400).json({ message: "Comment ID and Reply ID are required." });
//         }

//         // Find the post by ID
//         const post = await postBluskyg.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: "Post not found." });
//         }

//         // Find the specific comment by its ID inside the post's comments array
//         const targetComment = post.Comment.find((com) => com._id.toString() === commentId);
//         if (!targetComment) {
//             return res.status(404).json({ message: "Comment not found." });
//         }

//         // Check if replies exist in the target comment
//         if (!targetComment.replies) {
//             return res.status(404).json({ message: "No replies found for this comment." });
//         }

//         // Find the specific reply by its ID and remove it
//         targetComment.replies = targetComment.replies.filter(
//             (reply) => reply._id.toString() !== replyId
//         );

//         // Save the updated post
//         await post.save();

//         res.status(200).json(post); // Return the updated post
//     } catch (error) {
//         console.error(error); // Log error for debugging
//         res.status(500).json({ message: "An error occurred", error });
//     }
// });



  app.get('/post-comment/fetch', async (req, res) => {
      console.log("Received request:", req.params);
      try {
          const allComments = await postBluskyg.find()
       
          res.status(200).json(allComments);
      } catch (error) {
          console.error(error); // Log the error
          res.status(500).json({ message: "An error occurred", error });
      }
  });


//-----------------------------------------------------------------------------------

 



// reply section

 

  



app.use('/uploads', express.static('uploads'));



// ---------------Latex--------------



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});