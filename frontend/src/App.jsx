import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import HomePage from "./pages/HomePage"
import BlogDetailPage from "./pages/BlogDetailPage"
import CreateBlogPage from "./pages/CreateBlogPage"
import ProfilePage from "./pages/ProfilePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import "./App.css"

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
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App