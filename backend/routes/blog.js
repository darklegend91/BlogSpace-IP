import express from "express";
import Blog from "../models/blogs.js";
import User from "../models/user.js";
import upload from "../middleware/upload.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", upload.single("featuredImage"), async (req, res) => {
  try {
    const { title, excerpt, content, tags, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const blog = new Blog({
      title,
      excerpt,
      content,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      featuredImage: req.file ? req.file.path : null,
      author: user._id,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", authenticate, upload.single("featuredImage"), async (req, res) => {
  try {
    const { id } = req.params
    const { title, excerpt, content, tags } = req.body
    const updateData = {
      title,
      excerpt,
      content,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      updatedAt: new Date(),
    }
    if(req.file){
      updateData.featuredImage = req.file.path
    }
    const blog = await Blog.findByIdAndUpdate(id,updateData,{new:true})
    if(!blog){
      return res.status(404).json({message: "Blog not found"})
    }
    return res.status(200).json({message:"Blog updaated successfully",blog})
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }})
// blog.js
router.get("/user/:id", async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/:id",async(req,res)=>{
  try{
    const blog = await Blog.findById(req.params.id).populate("author","firstName lastName email")
    if(!blog){
      return res.status(404).json({message: "Blog not found"})
    }
    res.json({blog:blog})
  }
  catch(error){
    res.status(500).json({message:"Server Error"})
  }
})

router.delete("/:id",authenticate, async (req,res)=>{
  try{
    const {id} = req.params
    const blog  = await Blog.findByIdAndDelete(id)
    if(!blog){
      return res.status(404).json({message: "Blog not found"})
    }
    res.json({message: "Blog deleted successfully"})
  }
  catch(error){
    res.status(500).json({message: "Server error"})
  }
})
// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "firstName lastName email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
