import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { RootState } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import { generateMultipleUsernames } from '../utils/usernameGenerator';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [usernameOptions, setUsernameOptions] = useState<string[]>([]);
  const [customUsername, setCustomUsername] = useState('');
  const [isCustomUsername, setIsCustomUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    // Generate initial username options
    setUsernameOptions(generateMultipleUsernames(3));
  }, []);

  useEffect(() => {
    // Auto-select first username option
    if (usernameOptions.length > 0 && !formData.username && !isCustomUsername) {
      setFormData(prev => ({ ...prev, username: usernameOptions[0] }));
    }
  }, [usernameOptions, formData.username, isCustomUsername]);

  // Debounced username availability check
  useEffect(() => {
    if (!customUsername || customUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        // TODO: Replace with actual API call to check username availability
        const response = await fetch(`http://localhost:3001/api/auth/check-username/${encodeURIComponent(customUsername)}`);
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error('Error checking username availability:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [customUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUsername = e.target.value;
    
    if (selectedUsername === 'custom') {
      setIsCustomUsername(true);
      setFormData(prev => ({ ...prev, username: customUsername }));
    } else {
      setIsCustomUsername(false);
      setFormData(prev => ({ ...prev, username: selectedUsername }));
      setCustomUsername('');
      setUsernameAvailable(null);
    }
    setValidationError('');
  };

  const handleCustomUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomUsername(value);
    setFormData(prev => ({ ...prev, username: value }));
    setValidationError('');
  };

  const refreshUsernames = () => {
    const newOptions = generateMultipleUsernames(3);
    setUsernameOptions(newOptions);
    if (!isCustomUsername) {
      setFormData(prev => ({ ...prev, username: newOptions[0] }));
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.username) {
      setValidationError('Please select or enter a username');
      return false;
    }
    if (isCustomUsername && customUsername.length < 3) {
      setValidationError('Username must be at least 3 characters long');
      return false;
    }
    if (isCustomUsername && usernameAvailable === false) {
      setValidationError('Username is not available');
      return false;
    }
    if (isCustomUsername && usernameAvailable === null && customUsername.length >= 3) {
      setValidationError('Please wait for username availability check');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(loginStart());
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      dispatch(loginSuccess(data));
      dispatch(showNotification({
        message: 'Registration successful!',
        type: 'success',
      }));
      navigate('/');
    } catch (error) {
      dispatch(loginFailure('Registration failed'));
      dispatch(showNotification({
        message: 'Registration failed',
        type: 'error',
      }));
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        Create an Account
      </Typography>

      {(error || validationError) && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {validationError || error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormLabel component="legend">Choose Your Anonymous Username</FormLabel>
            <Tooltip title="Generate new usernames">
              <IconButton onClick={refreshUsernames} size="small" sx={{ ml: 1 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <RadioGroup
            value={isCustomUsername ? 'custom' : formData.username}
            onChange={handleUsernameChange}
            name="username"
          >
            {usernameOptions.map((username) => (
              <FormControlLabel
                key={username}
                value={username}
                control={<Radio />}
                label={username}
                disabled={loading}
              />
            ))}
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="Create my own username"
              disabled={loading}
            />
          </RadioGroup>
          
          {isCustomUsername && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <TextField
                fullWidth
                label="Custom Username"
                value={customUsername}
                onChange={handleCustomUsernameChange}
                disabled={loading}
                placeholder="Enter your custom username"
                helperText={
                  checkingUsername
                    ? "Checking availability..."
                    : customUsername.length >= 3
                    ? usernameAvailable === true
                      ? "✓ Username is available"
                      : usernameAvailable === false
                      ? "✗ Username is not available"
                      : ""
                    : customUsername.length > 0
                    ? "Username must be at least 3 characters"
                    : "Enter a username to check availability"
                }
                error={customUsername.length >= 3 && usernameAvailable === false}
                sx={{
                  '& .MuiFormHelperText-root': {
                    color: checkingUsername
                      ? 'text.secondary'
                      : usernameAvailable === true
                      ? 'success.main'
                      : usernameAvailable === false
                      ? 'error.main'
                      : 'text.secondary',
                  },
                }}
              />
            </Box>
          )}
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        <Box textAlign="center">
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign In
          </Link>
        </Box>
      </form>
    </Paper>
  );
};

export default Register;