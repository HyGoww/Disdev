import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavbarComponent from './components/Navbar';
import NotFoundPage from './pages/NotFoundPage';
import AuthForm from './components/AuthForm';
import DashboardComponent from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import CategoryPage from './pages/CategoryPage';
import FooterComponent from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <FooterComponent />
      </Router>
    </AuthProvider>
  );
}

export default App;
