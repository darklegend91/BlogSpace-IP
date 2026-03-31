import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Settings, Edit3, Heart } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // optional: id of the user being visited
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
  await axios.delete(`${BACKEND_URL}/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  const handleFollowToggle = async () => {
    if (!user || user._id === loggedInUserId) return;
    try {
  const url = `${BACKEND_URL}/users/follow-toggle/${user._id}`;
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      setIsFollowing(!isFollowing);
      setUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f !== loggedInUserId)
          : [...prev.followers, loggedInUserId],
      }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      const userIdToFetch = id || loggedInUserId;
      try {
  const res = await axios.get(`${BACKEND_URL}/users/${userIdToFetch}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setBlogs(res.data.blogs || []);

        if (id && id !== loggedInUserId) {
          setIsFollowing(res.data.user.followers.includes(loggedInUserId));
        }
      } catch (err) {
        console.error(err);
        // If fetching fails and it's own profile, clear old localStorage and redirect to login
        if (!id && err.response?.status === 500) {
          localStorage.clear();
          navigate("/auth/signin");
        }
      }
    };
    fetchUser();
  }, [id, token, navigate]);

  if (!user) return <div className="text-center py-20">Loading...</div>;

  const isOwnProfile = user._id === loggedInUserId;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">BlogSpace</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-muted-foreground">Home</Link>
            <Link to="/create" className="text-foreground hover:text-muted-foreground">Write</Link>
            <div className="w-px h-6 bg-border"></div>
            <ThemeToggle />
            {isOwnProfile && (
              <>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="outline" className="bg-red-500" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* PROFILE */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Card className="p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{user.firstName} {user.lastName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                {isOwnProfile ? (
                  <Button className="flex items-center gap-2 self-start" onClick={() => navigate("/edit-profile")}>
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </Button>
                ) : (
                  <Button size="sm" variant={isFollowing ? "secondary" : "default"} onClick={handleFollowToggle}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              <div className="w-16 h-px bg-foreground mb-4"></div>
              <p className="text-foreground mb-6 leading-relaxed">{user.bio || "This user hasn't added a bio yet."}</p>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{blogs.length}</div>
                  <div className="text-sm text-muted-foreground">Stories</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.followers.length}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.following.length}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* TABS */}
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="published">Blogs ({blogs.length})</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-6">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card key={blog._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/blog/${blog._id}`}>
                        <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors">{blog.title}</h3>
                      </Link>
                      <div className="w-8 h-px bg-border mb-3"></div>
                      <p className="text-muted-foreground mb-4 text-pretty">{blog.excerpt}</p>
                    </div>
                    {isOwnProfile && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/edit-blog/${blog._id}`)}>Edit</Button>
                        <Button variant="destructive" onClick={() => handleDelete(blog._id)}>Delete</Button>
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">No blogs found</h3>
                <p className="text-muted-foreground">This user hasn’t published any blogs yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No liked stories yet</h3>
              <p className="text-muted-foreground">Stories liked by this user will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
