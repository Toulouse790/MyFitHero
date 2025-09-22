// src/features/social/hooks/useSocialModals.ts
import { useState } from 'react';
import { CreatePostData, CreateChallengeData } from '@/features/social/types';

export interface UseSocialModalsReturn {
  // Modal states
  showCreatePost: boolean;
  showCreateChallenge: boolean;
  showComments: string | null;
  
  // Form data
  newPost: CreatePostData;
  newChallenge: CreateChallengeData;
  newComment: string;
  
  // Modal actions
  openCreatePost: () => void;
  closeCreatePost: () => void;
  openCreateChallenge: () => void;
  closeCreateChallenge: () => void;
  openComments: (postId: string) => void;
  closeComments: () => void;
  
  // Form actions
  updateNewPost: (data: Partial<CreatePostData>) => void;
  updateNewChallenge: (data: Partial<CreateChallengeData>) => void;
  setNewComment: (comment: string) => void;
  resetForms: () => void;
  
  // Submit actions
  submitPost: () => Promise<void>;
  submitChallenge: () => Promise<void>;
  submitComment: () => Promise<void>;
}

export const useSocialModals = (): UseSocialModalsReturn => {
  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  
  // Form states
  const [newPost, setNewPost] = useState<CreatePostData>({
    content: '',
    post_type: 'general',
    media_files: [],
    achievements: [],
    location: '',
  });

  const [newChallenge, setNewChallenge] = useState<CreateChallengeData>({
    title: '',
    description: '',
    pillar: 'workout',
    challenge_type: 'community',
    target_value: 0,
    target_unit: '',
    duration_days: 7,
    difficulty: 'medium',
    reward_points: 100,
  });

  const [newComment, setNewComment] = useState('');

  // Modal actions
  const openCreatePost = () => setShowCreatePost(true);
  const closeCreatePost = () => {
    setShowCreatePost(false);
    resetPostForm();
  };

  const openCreateChallenge = () => setShowCreateChallenge(true);
  const closeCreateChallenge = () => {
    setShowCreateChallenge(false);
    resetChallengeForm();
  };

  const openComments = (postId: string) => setShowComments(postId);
  const closeComments = () => {
    setShowComments(null);
    setNewComment('');
  };

  // Form actions
  const updateNewPost = (data: Partial<CreatePostData>) => {
    setNewPost(prev => ({ ...prev, ...data }));
  };

  const updateNewChallenge = (data: Partial<CreateChallengeData>) => {
    setNewChallenge(prev => ({ ...prev, ...data }));
  };

  const resetPostForm = () => {
    setNewPost({
      content: '',
      post_type: 'general',
      media_files: [],
      achievements: [],
      location: '',
    });
  };

  const resetChallengeForm = () => {
    setNewChallenge({
      title: '',
      description: '',
      pillar: 'workout',
      challenge_type: 'community',
      target_value: 0,
      target_unit: '',
      duration_days: 7,
      difficulty: 'medium',
      reward_points: 100,
    });
  };

  const resetForms = () => {
    resetPostForm();
    resetChallengeForm();
    setNewComment('');
  };

  // Submit actions
  const submitPost = async () => {
    try {
      // Mock API call
      console.log('Creating post:', newPost);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      closeCreatePost();
      
      // You would typically call a refresh function here
      // to reload the posts with the new post
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const submitChallenge = async () => {
    try {
      // Mock API call
      console.log('Creating challenge:', newChallenge);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      closeCreateChallenge();
      
      // You would typically call a refresh function here
      // to reload the challenges with the new challenge
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !showComments) return;

    try {
      // Mock API call
      console.log('Creating comment:', {
        postId: showComments,
        content: newComment,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset comment
      setNewComment('');
      
      // You would typically call a refresh function here
      // to reload the post comments
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  };

  return {
    // Modal states
    showCreatePost,
    showCreateChallenge,
    showComments,
    
    // Form data
    newPost,
    newChallenge,
    newComment,
    
    // Modal actions
    openCreatePost,
    closeCreatePost,
    openCreateChallenge,
    closeCreateChallenge,
    openComments,
    closeComments,
    
    // Form actions
    updateNewPost,
    updateNewChallenge,
    setNewComment,
    resetForms,
    
    // Submit actions
    submitPost,
    submitChallenge,
    submitComment,
  };
};