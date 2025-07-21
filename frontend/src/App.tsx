import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import { store } from './store';

const AppContent = () => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#FF6B35', // Orange
        light: '#FF8A65',
        dark: '#E64A19',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#20B2AA', // Turquoise
        light: '#4DB6AC',
        dark: '#00695C',
        contrastText: '#FFFFFF',
      },
      background: {
        default: darkMode ? '#121212' : '#FAFAFA',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#333333',
        secondary: darkMode ? '#B0B0B0' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: '#FF6B35',
      },
      h2: {
        fontWeight: 600,
        color: '#20B2AA',
      },
      h3: {
        fontWeight: 600,
        color: '#FF6B35',
      },
      h4: {
        fontWeight: 500,
        color: '#20B2AA',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 25,
            textTransform: 'none',
            fontWeight: 600,
          },
          contained: {
            background: 'linear-gradient(45deg, #FF6B35 30%, #20B2AA 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 107, 53, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #E64A19 30%, #00695C 90%)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(45deg, #FF6B35 30%, #20B2AA 90%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 15,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Landing page doesn't use any layout */}
          <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} />

          {/* Public routes use PublicLayout for centering */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/home" />} />
            <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/home" />} />
          </Route>
          
          {/* Protected routes use the main app Layout */}
          <Route path="/home" element={
            isAuthenticated ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/create-post" element={
            isAuthenticated ? (
              <Layout>
                <CreatePost />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/profile" element={
            isAuthenticated ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
