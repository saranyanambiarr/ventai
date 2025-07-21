import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists',
      });
    }

    // Create new user
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          points: 0,
        },
      },
    });

    if (error) throw error;

    // Generate token
    const token = generateToken(user.user!.id);

    res.status(201).json({
      user: {
        id: user.user!.id,
        username,
        email,
        points: 0,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Sign in user
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, points')
      .eq('id', user!.id)
      .single();

    // Generate token
    const token = generateToken(user!.id);

    res.json({
      user: {
        id: user!.id,
        username: profile?.username,
        email: user!.email,
        points: profile?.points || 0,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Error logging in' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ error: 'Error fetching profile' });
  }
};

export const updatePoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { points } = req.body;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ points: supabase.rpc('increment_points', { points }) })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ points: profile.points });
  } catch (error) {
    console.error('Points update error:', error);
    res.status(400).json({ error: 'Error updating points' });
  }
}; 