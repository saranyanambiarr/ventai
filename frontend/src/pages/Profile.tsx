import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { RootState } from '../store';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { posts } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const userPosts = posts.filter(post => post.author.id === user.id);
  const totalSarcasmScore = userPosts.reduce((sum, post) => sum + post.sarcasmScore, 0);
  const averageSarcasmScore = userPosts.length > 0
    ? (totalSarcasmScore / userPosts.length).toFixed(1)
    : 0;

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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {user.points}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Points
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {userPosts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Vents
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {averageSarcasmScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Sarcasm Score
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Recent Vents
            </Typography>
            {userPosts.length > 0 ? (
              <List>
                {userPosts.slice(0, 5).map((post) => (
                  <ListItem
                    key={post.id}
                    sx={{
                      bgcolor: 'background.default',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={post.content}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                          {' • '}
                          <Typography
                            component="span"
                            variant="body2"
                            color="primary"
                          >
                            Score: {post.sarcasmScore}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                No vents yet. Start venting to earn points!
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 