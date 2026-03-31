import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"
import axios from "axios"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function HomePage() {
  const [blogs, setBlogs] = useState([])
  const user = localStorage.getItem("userId")
  useEffect(() => {
  const fetchBlogs = async () => {
    try {
  const res = await axios.get(`${BACKEND_URL}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  fetchBlogs();
}, []);

  return (
    <div className="min-h-screen bg-background">
      
      <header className="border-b border-border">
  <div className="max-w-6xl mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">BlogSpace</h1>
        <div className="w-12 h-px bg-foreground mt-1"></div>
      </div>
      <nav className="flex items-center gap-6">
        <Link to="/" className="text-foreground hover:text-muted-foreground transition-colors">
          Home
        </Link>
        <Link to="/create" className="text-foreground hover:text-muted-foreground transition-colors">
          Write
        </Link>
        <Link to="/profile" className="text-foreground hover:text-muted-foreground transition-colors">
          Profile
        </Link>
        <div className="w-px h-6 bg-border"></div>
        <ThemeToggle />

        {!user && (
          <Link to="/auth/signin">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </div>
  </div>
</header>

      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Share Your Stories with the World</h2>
            <div className="w-24 h-px bg-foreground mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              A minimalist platform for writers and readers. Create, share, and discover compelling stories in a clean,
              distraction-free environment.
            </p>
            <Link to="/create">
              <Button size="lg" className="mr-4">
                Start Writing
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Explore Stories
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Latest Stories</h3>
            <div className="w-16 h-px bg-foreground mt-2"></div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Card
                key={blog._id}
                className="group cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <Link to={`/blog/${blog._id}`} className="flex flex-col h-full">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={`${BACKEND_URL}${blog.featuredImage}`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
                      <span>{blog.author?.firstName} {blog.author?.lastName}</span>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors text-balance">
                      {blog.title}
                    </h4>
                    <div className="w-8 h-px bg-border mb-3"></div>
                    <p className="text-muted-foreground text-sm line-clamp-2 break-words">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No blogs yet. Be the first to write one!</p>
          )}
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">© 2024 BlogSpace. A minimalist blogging platform.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
