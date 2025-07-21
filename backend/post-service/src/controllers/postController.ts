import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { publishToQueue } from '../services/queueService';
import { logger } from '../utils/logger';
import * as natural from 'natural';

// Calculate sarcasm score based on content
const calculateSarcasmScore = (content: string): number => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(content.toLowerCase()) || [];
  const sarcasmKeywords = [
    'obviously', 'clearly', 'brilliant', 'genius', 'fantastic', 'wonderful',
    'amazing', 'perfect', 'exactly', 'sure', 'right', 'totally', 'absolutely',
    'definitely', 'certainly', 'wow', 'great', 'excellent', 'outstanding'
  ];
  
  let sarcasmCount = 0;
  tokens.forEach((token: string) => {
    if (sarcasmKeywords.includes(token)) {
      sarcasmCount++;
    }
  });
  
  // Simple sentiment calculation
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting'];
  
  let sentiment = 0;
  tokens.forEach((token: string) => {
    if (positiveWords.includes(token)) sentiment += 1;
    if (negativeWords.includes(token)) sentiment -= 1;
  });
  
  const sarcasmScore = Math.min((sarcasmCount * 0.3) + Math.abs(sentiment * 0.1), 1);
  
  return Math.round(sarcasmScore * 100) / 100;
};

export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check for forbidden words (violence prevention)
    const forbiddenWords = ['kill', 'murder', 'suicide', 'harm', 'hurt', 'violence', 'weapon'];
    const lowerContent = content.toLowerCase();
    const hasForbiddenWords = forbiddenWords.some(word => lowerContent.includes(word));
    
    if (hasForbiddenWords) {
      return res.status(400).json({ error: 'Content contains prohibited words' });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', req.user.id)
      .single();

    // Calculate sarcasm score
    const sarcasmScore = calculateSarcasmScore(content);

    // Create post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        content,
        author_id: req.user.id,
        author_username: profile?.username || 'Anonymous',
        sarcasm_score: sarcasmScore,
      })
      .select()
      .single();

    if (error) throw error;

    // Publish to notification queue
    await publishToQueue({
      type: 'post.created',
      data: {
        userId: req.user.id,
        message: 'Your post has been created successfully!',
        postId: post.id,
        sarcasmScore,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json(posts || []);
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json(posts || []);
  } catch (error) {
    logger.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { reason } = req.body;

    // Check if post exists and user owns it
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('author_id', req.user.id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    // Mark as deleted
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({
        is_deleted: true,
        deletion_reason: reason || 'Deleted by user',
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Publish to notification queue
    await publishToQueue({
      type: 'post.deleted',
      data: {
        userId: req.user.id,
        message: 'Your post has been deleted',
        postId: id,
        reason: reason || 'Deleted by user',
      },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}; 