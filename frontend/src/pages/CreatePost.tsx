import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { RootState } from '../store';
import {
  createPostStart,
  createPostSuccess,
  createPostFailure,
} from '../store/slices/postsSlice';
import { showNotification } from '../store/slices/uiSlice';

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.posts);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      dispatch(showNotification({
        message: 'Please login to create a post',
        type: 'warning',
      }));
      navigate('/login');
      return;
    }

    try {
      dispatch(createPostStart());
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      dispatch(createPostSuccess(data));
      dispatch(showNotification({
        message: 'Post created successfully!',
        type: 'success',
      }));
      navigate('/');
    } catch (error) {
      dispatch(createPostFailure('Failed to create post'));
      dispatch(showNotification({
        message: 'Failed to create post',
        type: 'error',
      }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    // Check for forbidden words
    const forbiddenWords = ['kill', 'murder', 'suicide'];
    const hasForbiddenWord = forbiddenWords.some(word =>
      newContent.toLowerCase().includes(word)
    );

    if (hasForbiddenWord) {
      dispatch(showNotification({
        message: 'Your post contains forbidden words. Please remove them.',
        type: 'error',
      }));
      return;
    }

    setContent(newContent);
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Vent
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Remember: The more sarcastic, the better! But please keep it safe and respectful.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="What's bothering you?"
            value={content}
            onChange={handleContentChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !content.trim()}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Vent'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost; 