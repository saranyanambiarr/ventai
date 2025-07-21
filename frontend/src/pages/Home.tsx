import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import type { RootState } from '../store';
import {
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostsStart,
} from '../store/slices/postsSlice';
import { showNotification } from '../store/slices/uiSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(fetchPostsStart());
        // TODO: Replace with actual API call
        const response = await fetch('http://localhost:3002/api/posts');
        const data = await response.json();
        dispatch(fetchPostsSuccess(data));
      } catch (error) {
        dispatch(fetchPostsFailure('Failed to fetch posts'));
        dispatch(showNotification({
          message: 'Failed to fetch posts',
          type: 'error',
        }));
      }
    };

    fetchPosts();
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.author.username}
                </Typography>
                <Typography
                  variant="body1"
                  color={post.isDeleted ? 'error' : 'text.primary'}
                >
                  {post.isDeleted
                    ? `[DELETED] ${post.deletionReason}`
                    : post.content}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Sarcasm Score: {post.sarcasmScore}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {posts.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              No posts yet. Be the first to vent!
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home; 