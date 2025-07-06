import { AuthProvider } from './auth/AuthContext';
import Register from './auth/Register';
import Login from './auth/Login';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import MovieDetails from './MovieDetails';
import Favourites from './Favourites';
import Watchlist from './Watchlist';
import CustomLists from './CustomLists';
import ListDetail from './ListDetail';
import UserProfile from './UserProfile';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/lists" element={<CustomLists />} />
          <Route path="/lists/:listId" element={<ListDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
