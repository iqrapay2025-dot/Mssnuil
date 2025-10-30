import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Avatar } from './ui/avatar';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = () => {
    const storedComments = localStorage.getItem(`mssnComments_${postId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  };

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`mssnComments_${postId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !commentAuthor.trim()) {
      toast.error('Please enter your name and comment');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      author: commentAuthor,
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setNewComment('');
    toast.success('Comment posted successfully!');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyContent.trim() || !commentAuthor.trim()) {
      toast.error('Please enter your name and reply');
      return;
    }

    const reply: Comment = {
      id: Date.now().toString(),
      postId,
      author: commentAuthor,
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyContent('');
    setReplyingTo(null);
    toast.success('Reply posted successfully!');
  };

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    const userId = localStorage.getItem('mssnUserId') || `user_${Date.now()}`;
    localStorage.setItem('mssnUserId', userId);

    const updatedComments = comments.map(comment => {
      if (isReply && parentId && comment.id === parentId) {
        const updatedReplies = comment.replies?.map(reply => {
          if (reply.id === commentId) {
            const hasLiked = reply.likedBy?.includes(userId);
            return {
              ...reply,
              likes: hasLiked ? reply.likes - 1 : reply.likes + 1,
              likedBy: hasLiked 
                ? reply.likedBy.filter(id => id !== userId)
                : [...(reply.likedBy || []), userId]
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      } else if (!isReply && comment.id === commentId) {
        const hasLiked = comment.likedBy?.includes(userId);
        return {
          ...comment,
          likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: hasLiked 
            ? comment.likedBy.filter(id => id !== userId)
            : [...(comment.likedBy || []), userId]
        };
      }
      return comment;
    });

    saveComments(updatedComments);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const userId = localStorage.getItem('mssnUserId') || '';

  return (
    <div className="space-y-6">
      {/* Post Comment Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl mb-4 text-gray-900">Join the conversation</h3>
        <div className="space-y-4">
          <Input
            placeholder="Your name"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            className="border-gray-300"
          />
          <Textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="border-gray-300 resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handlePostComment}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl text-gray-900">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white">
                    {getInitials(comment.author)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-900">{comment.author}</span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{formatDate(comment.date)}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        comment.likedBy?.includes(userId) 
                          ? 'text-red-600' 
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 ${comment.likedBy?.includes(userId) ? 'fill-current' : ''}`} 
                      />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-emerald-600">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                        className="border-gray-300 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePostReply(comment.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Reply
                        </Button>
                        <Button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white text-sm">
                              {getInitials(reply.author)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-900 text-sm">{reply.author}</span>
                              <span className="text-gray-500 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{formatDate(reply.date)}</span>
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{reply.content}</p>
                            
                            <button
                              onClick={() => handleLike(reply.id, true, comment.id)}
                              className={`flex items-center gap-1 transition-colors ${
                                reply.likedBy?.includes(userId) 
                                  ? 'text-red-600' 
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <Heart 
                                className={`w-3 h-3 ${reply.likedBy?.includes(userId) ? 'fill-current' : ''}`} 
                              />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
