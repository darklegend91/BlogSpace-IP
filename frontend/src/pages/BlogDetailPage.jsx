import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { ThemeToggle } from "../components/ThemeToggle"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function BlogDetailPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/blogs/${id}`)
        setBlog(res.data.blog || res.data)
        setAuthor(res.data.author);
        setIsFollowing(
          res.data.author && Array.isArray(res.data.author.followers) && userId
            ? res.data.author.followers.includes(userId)
            : false
        );
      } catch (err) {
        console.error("Error fetching blog:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleFollowToggle = async () => {
    if (!author) return; // safety check
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to follow users");

    try {
      const url = `${BACKEND_URL}/users/follow-toggle/${author._id}`;
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Update local state
      setIsFollowing(!isFollowing);

      // Optional: update author followers count locally
      setAuthor((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f !== userId) // remove userId on unfollow
          : [...prev.followers, userId], // add userId on follow
      }));
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!blog) return <div className="text-center py-20">Blog not found</div>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">BlogSpace</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-muted-foreground">
              Home
            </Link>
            <Link to="/create" className="text-foreground hover:text-muted-foreground">
              Write
            </Link>
            <Link to="/profile" className="text-foreground hover:text-muted-foreground">
              Profile
            </Link>
            <div className="w-px h-6 bg-border"></div>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article>
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  to={`/profile/${blog.author?._id}`}
                  className="hover:text-foreground transition-colors font-medium"
                >
                  {blog.author?.firstName} {blog.author?.lastName}
                </Link>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Follow / Unfollow Button */}
              {author && author._id.toString() !== userId && (
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  size="sm"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}

            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">{blog.title}</h1>

            <div className="w-24 h-px bg-foreground mb-6"></div>

            {/* Tags */}
            {blog.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="aspect-video bg-muted overflow-hidden rounded-lg mb-8">
                <img
                  src={`${BACKEND_URL}${blog.featuredImage}`}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>


          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-foreground leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </main>
    </div>
  )
}
