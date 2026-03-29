import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ArrowLeft, Settings, Edit3, Heart, MessageCircle, Calendar, MapPin } from "lucide-react"
import { ThemeToggle } from "../components/ThemeToggle"

// Mock user data
const mockUser = {
  name: "John Doe",
  username: "johndoe",
  bio: "Full-stack developer passionate about creating beautiful web experiences. I write about modern web development, design patterns, and the latest technologies.",
  location: "San Francisco, CA",
  joinDate: "January 2024",
  followers: 1234,
  following: 567,
  posts: 23,
  avatar: null,
}

// Mock user's blog posts
const mockUserPosts = [
  {
    id: 1,
    title: "Getting Started with Modern Web Development",
    excerpt: "Explore the latest trends and best practices in web development, from React to Next.js and beyond.",
    date: "2024-01-15",
    readTime: "5 min read",
    likes: 42,
    comments: 8,
    status: "published",
  },
  {
    id: 2,
    title: "Building Scalable React Applications",
    excerpt: "Learn how to structure and organize your React applications for long-term maintainability.",
    date: "2024-01-10",
    readTime: "7 min read",
    likes: 28,
    comments: 5,
    status: "published",
  },
  {
    id: 3,
    title: "The Future of Web Development",
    excerpt: "A look at emerging technologies and trends that will shape the future of web development.",
    date: "2024-01-08",
    readTime: "4 min read",
    likes: 0,
    comments: 0,
    status: "draft",
  },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-muted-foreground transition-colors">
                Home
              </Link>
              <Link to="/create" className="text-foreground hover:text-muted-foreground transition-colors">
                Write
              </Link>
              <div className="w-px h-6 bg-border"></div>
              <ThemeToggle />
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{mockUser.name}</h1>
                    <p className="text-muted-foreground">@{mockUser.username}</p>
                  </div>
                  <Button className="flex items-center gap-2 self-start">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="w-16 h-px bg-foreground mb-4"></div>

                <p className="text-foreground mb-6 leading-relaxed">{mockUser.bio}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{mockUser.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {mockUser.joinDate}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{mockUser.posts}</div>
                    <div className="text-sm text-muted-foreground">Stories</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{mockUser.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{mockUser.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="published">
              Published ({mockUserPosts.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({mockUserPosts.filter((p) => p.status === "draft").length})
            </TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-6">
            {mockUserPosts
              .filter((post) => post.status === "published")
              .map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{post.date}</span>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>{post.readTime}</span>
                      </div>

                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors text-balance">
                          {post.title}
                        </h3>
                      </Link>

                      <div className="w-8 h-px bg-border mb-3"></div>

                      <p className="text-muted-foreground mb-4 text-pretty">{post.excerpt}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            {mockUserPosts
              .filter((post) => post.status === "draft")
              .map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span className="px-2 py-1 text-xs bg-muted rounded-full">Draft</span>
                        <span>{post.date}</span>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-3 text-balance">{post.title}</h3>

                      <div className="w-8 h-px bg-border mb-3"></div>

                      <p className="text-muted-foreground mb-4 text-pretty">{post.excerpt}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Publish</Button>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No liked stories yet</h3>
              <p className="text-muted-foreground">Stories you like will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}