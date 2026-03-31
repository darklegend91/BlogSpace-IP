import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { ArrowLeft, Upload, Eye, Save } from "lucide-react"
import { ThemeToggle } from "../components/ThemeToggle"
import { useNavigate } from "react-router-dom"
import axios from "axios"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateBlogPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()
  const handlePublish = async () => {
    const userId = localStorage.getItem("userId") // set this after login
    if (!userId) {
      alert("You must be logged in to publish a blog");
      return;
    }
    const formData = new FormData()
    formData.append("title", title)
    formData.append("excerpt", excerpt)
    formData.append("content", content)
    formData.append("tags", tags)
    formData.append("userId", userId)
    if (selectedFile) {
      formData.append("featuredImage", selectedFile)
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // important for FormData
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if auth needed
        },
      });

      console.log("Blog created:", res.data);
      alert("Blog published successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-semibold">BlogSpace</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <ThemeToggle />
              {/* Publish button now calls handlePublish */}
              <Button size="sm" onClick={handlePublish}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!isPreview ? (
          /* Editor Mode */
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Story</h1>
              <div className="w-16 h-px bg-foreground mb-6"></div>
              <p className="text-muted-foreground">Share your thoughts with the world</p>
            </div>

            <Card className="p-8">
              <form className="space-y-8">
                {/* Featured Image Upload */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">Featured Image</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground transition-colors cursor-pointer"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    {selectedFile && (
                      <p className="text-sm mt-2 text-foreground">{selectedFile.name}</p>
                    )}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter your story title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-foreground font-medium">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief description of your story..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    This will appear in the blog list and social media previews
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-foreground font-medium">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Tell your story..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="resize-none font-mono text-sm leading-relaxed"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    You can use Markdown formatting for rich text
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-foreground font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="web development, react, javascript (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add up to 5 tags to help readers discover your story
                  </p>
                </div>
              </form>
            </Card>
          </div>
        ) : (
          /* Preview Mode */
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Preview</h1>
              <div className="w-16 h-px bg-foreground mb-6"></div>
              <p className="text-muted-foreground">This is how your story will appear to readers</p>
            </div>

            <Card className="p-8">
              <article>
                <header className="mb-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>Your Name</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span>{new Date().toLocaleDateString()}</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span>5 min read</span>
                  </div>

                  <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
                    {title || "Your Story Title"}
                  </h1>

                  <div className="w-24 h-px bg-foreground mb-6"></div>

                  {tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Show preview image if selected */}
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="aspect-video rounded-lg mb-8"
                    />
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg mb-8 flex items-center justify-center">
                      <span className="text-muted-foreground">Featured Image</span>
                    </div>
                  )}
                </header>

                <div className="prose prose-lg max-w-none">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {content || "Your story content will appear here..."}
                  </div>
                </div>
              </article>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
