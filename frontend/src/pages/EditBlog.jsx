import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    featuredImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch blog details and prefill fields
  useEffect(() => {
    const fetchBlog = async () => {
      try {
  const res = await axios.get(`${BACKEND_URL}/blogs/${id}`);
        const data = res.data.blog || res.data;

        setBlog({
          title: data.title || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          tags: data.tags ? data.tags.join(", ") : "",
          featuredImage: data.featuredImage || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("excerpt", blog.excerpt);
      formData.append("content", blog.content);
      formData.append("tags", blog.tags);
      if (imageFile) formData.append("featuredImage", imageFile);

  await axios.put(`${BACKEND_URL}/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Blog</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Card className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Title</label>
              <Input
                name="title"
                value={blog.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Excerpt</label>
              <Input
                name="excerpt"
                value={blog.excerpt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Content</label>
              <Textarea
                name="content"
                value={blog.content}
                onChange={handleChange}
                rows="8"
                required
                placeholder="Write your story..."
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Tags (comma separated)
              </label>
              <Input
                name="tags"
                value={blog.tags}
                onChange={handleChange}
                placeholder="e.g. travel, tech, life"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Upload New Image</label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {blog.featuredImage && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                  <img
                    src={`${BACKEND_URL}${blog.featuredImage}`}
                    alt="Blog"
                    className="rounded-lg max-h-48 object-cover border border-border"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
