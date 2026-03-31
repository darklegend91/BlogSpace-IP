import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import cors from 'cors';
import blogRoutes from "./routes/blog.js";
import path from "path";
import { fileURLToPath } from "url";
import authenticate from "./middleware/authenticate.js";
import User from "./models/user.js";
import Blog from "./models/blogs.js";

const app = express();
env.config();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
mongoose.connect(process.env.MONGO_URL)
.then(() =>
{
    app.listen(process.env.PORT , () =>
    {
        console.log(`Server running on port ${process.env.PORT}`)
    });
}).catch(err => console.log(err));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

// Root route returns server condition
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
app.use("/blogs", blogRoutes);

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({user:user, blogs: blogs});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/users/:id", authenticate, async (req,res)=>{
  try{
    const {id} = req.params
    const {firstName, lastName,bio} = req.body;
    const user = await User.findByIdAndUpdate(id, {firstName,lastName,bio}, {new:true});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.json({message: "User updated successfully",user:user});
  }
  catch(error){
    res.status(500).json({message: "Server error" });
  }
})