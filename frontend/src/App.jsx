import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import HomePage from "./pages/HomePage"
import BlogDetailPage from "./pages/BlogDetailPage"
import CreateBlogPage from "./pages/CreateBlogPage"
import ProfilePage from "./pages/ProfilePage"
import EditBlog from "./pages/EditBlog"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/create" element={<CreateBlogPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/edit/:id" element={<EditBlog />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
