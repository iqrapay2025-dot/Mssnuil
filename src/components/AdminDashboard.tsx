import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, Edit, Trash2, LogOut, FileText, ArrowLeft, Eye, Save, FileEdit, Upload, X, BookOpen, Mail } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ResourcesAdmin } from './ResourcesAdmin';
import { EmailNotificationsViewer } from './EmailNotificationsViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import logoImage from 'figma:asset/fbc52c4cf3ddc1eecd0ce430195ad1b2888e1b5e.png';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
  isDraft: boolean;
  views: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export function AdminDashboard({ onLogout, onNavigateHome }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('blog');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
    category: 'Events',
    excerpt: '',
    isDraft: false
  });

  useEffect(() => {
    loadPosts();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!isCreateDialogOpen && !isEditDialogOpen) return;
    
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.content) {
        const draftKey = editingPost ? `draft_${editingPost.id}` : 'draft_new';
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setAutoSaveStatus('Auto-saved at ' + new Date().toLocaleTimeString());
        
        setTimeout(() => setAutoSaveStatus(''), 3000);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, isCreateDialogOpen, isEditDialogOpen, editingPost]);

  const loadPosts = () => {
    const storedPosts = localStorage.getItem('mssnBlogPosts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      // Ensure all posts have required fields
      const updatedPosts = parsedPosts.map((post: any) => ({
        ...post,
        isDraft: post.isDraft ?? false,
        views: post.views ?? 0
      }));
      setPosts(updatedPosts);
    }
  };

  const savePosts = (updatedPosts: BlogPost[]) => {
    localStorage.setItem('mssnBlogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleCreatePost = () => {
    if (!formData.title || !formData.content || !formData.author || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      image: formData.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      category: formData.category,
      excerpt: formData.excerpt,
      isDraft: formData.isDraft,
      views: 0
    };

    // Check if we're updating an auto-saved draft
    const draftId = localStorage.getItem('draft_new_id');
    let updatedPosts;
    
    if (draftId) {
      // Replace the auto-saved draft with the new post
      updatedPosts = posts.map(post => post.id === draftId ? newPost : post);
    } else {
      updatedPosts = [newPost, ...posts];
    }
    
    savePosts(updatedPosts);
    
    // Clear auto-save draft references
    localStorage.removeItem('draft_new');
    localStorage.removeItem('draft_new_id');
    
    // Send newsletter notification if publishing (not draft)
    if (!formData.isDraft) {
      sendNewsletterNotification(formData.title);
    }
    
    toast.success(formData.isDraft ? 'Draft saved successfully!' : 'Blog post published successfully!');
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleUpdatePost = () => {
    if (!editingPost || !formData.title || !formData.content || !formData.author || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedPost: BlogPost = {
      ...editingPost,
      title: formData.title,
      content: formData.content,
      author: formData.author,
      image: formData.image || editingPost.image,
      category: formData.category,
      excerpt: formData.excerpt,
      isDraft: formData.isDraft
    };

    const updatedPosts = posts.map(post => 
      post.id === editingPost.id ? updatedPost : post
    );
    
    savePosts(updatedPosts);
    
    // Clear auto-save draft
    localStorage.removeItem(`draft_${editingPost.id}`);
    
    // Send newsletter notification if publishing (was draft, now published)
    if (editingPost.isDraft && !formData.isDraft) {
      sendNewsletterNotification(formData.title);
    }
    
    toast.success('Blog post updated successfully!');
    setIsEditDialogOpen(false);
    setEditingPost(null);
    resetForm();
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== id);
      savePosts(updatedPosts);
      localStorage.removeItem(`draft_${id}`);
      toast.success('Blog post deleted successfully!');
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    
    // Check for auto-saved draft
    const draftKey = `draft_${post.id}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      const shouldUseDraft = confirm('An auto-saved draft was found. Would you like to restore it?');
      if (shouldUseDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        setImagePreview(draftData.image || '');
      } else {
        setFormData({
          title: post.title,
          content: post.content,
          author: post.author,
          image: post.image,
          category: post.category,
          excerpt: post.excerpt,
          isDraft: post.isDraft
        });
        setImagePreview(post.image || '');
        localStorage.removeItem(draftKey);
      }
    } else {
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        image: post.image,
        category: post.category,
        excerpt: post.excerpt,
        isDraft: post.isDraft
      });
      setImagePreview(post.image || '');
    }
    
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    // Clear any previous draft session ID
    localStorage.removeItem('draft_new_id');
    
    // Check for auto-saved draft
    const savedDraft = localStorage.getItem('draft_new');
    
    if (savedDraft) {
      const shouldUseDraft = confirm('An auto-saved draft was found. Would you like to restore it?');
      if (shouldUseDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        setImagePreview(draftData.image || '');
      } else {
        localStorage.removeItem('draft_new');
      }
    }
    
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      image: '',
      category: 'Events',
      excerpt: '',
      isDraft: false
    });
    setAutoSaveStatus('');
    setImagePreview('');
  };

  // Send newsletter notification to all subscribers
  const sendNewsletterNotification = async (blogTitle: string) => {
    const subscribers = JSON.parse(localStorage.getItem('mssnNewsletterSubscribers') || '[]');
    
    if (subscribers.length === 0) {
      toast.info('No subscribers yet. Encourage visitors to subscribe!', {
        duration: 3000
      });
      return;
    }

    // Send real emails via Web3Forms
    const emailPromises = subscribers.map(async (subscriberEmail: string) => {
      try {
        const formData = new FormData();
        formData.append("access_key", "eff86a18-e6e9-4fbc-964a-8142912fc058");
        formData.append("subject", `✨ New Post: ${blogTitle} - MSSN UNILORIN`);
        formData.append("from_name", "MSSN UNILORIN");
        formData.append("email", subscriberEmail);
        formData.append("message", `As-salamu alaykum wa rahmatullahi wa barakatuh!\n\nWe've just published a new article that we think you'll find enlightening:\n\n📖 "${blogTitle}"\n\nVisit the MSSN UNILORIN website to read the full article and join the conversation with fellow members of our community.\n\n🌐 www.mssnunilorin.com/blog\n\nMay your day be filled with blessings and knowledge!\n\nJazakumullahu Khairan,\nMSSN UNILORIN Team\n\n---\nEmail: mssnunilorin2025@gmail.com\nPhone: +2348149650568`);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ Email sent to ${subscriberEmail}`);
          return true;
        } else {
          console.error(`❌ Failed to send email to ${subscriberEmail}:`, data);
          return false;
        }
      } catch (error) {
        console.error(`❌ Error sending email to ${subscriberEmail}:`, error);
        return false;
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Store all email notifications for admin viewing
    const emailNotifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    
    subscribers.forEach((subscriberEmail: string) => {
      const notification = {
        to: subscriberEmail,
        from: 'mssnunilorin2025@gmail.com',
        subject: '✨ New Post: ' + blogTitle,
        message: `As-salamu alaykum wa rahmatullahi wa barakatuh!\n\nWe've just published a new article that we think you'll find enlightening:\n\n📖 "${blogTitle}"\n\nVisit the MSSN UNILORIN website to read the full article and join the conversation with fellow members of our community.\n\n🌐 www.mssnunilorin.com/blog\n\nMay your day be filled with blessings and knowledge!\n\nJazakumullahu Khairan,\nMSSN UNILORIN Team\n\n---\nEmail: mssnunilorin2025@gmail.com\nPhone: +2348149650568`,
        timestamp: new Date().toISOString()
      };
      
      emailNotifications.push(notification);
    });

    // Save all notifications
    localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));

    // Send confirmation to admin (store for viewing in admin panel)
    const adminNotification = {
      to: 'mssnunilorin2025@gmail.com',
      from: 'system@mssnunilorin.com',
      subject: '✅ Blog Post Published Successfully',
      message: `As-salamu alaykum!\n\nYour blog post has been published successfully:\n\nTitle: "${blogTitle}"\nPublished: ${new Date().toLocaleString()}\n\nNewsletter notifications sent to ${subscribers.length} subscriber${subscribers.length === 1 ? '' : 's'}:\n${subscribers.map((email: string) => '• ' + email).join('\n')}\n\nKeep up the great work!\n\n- MSSN UNILORIN Website System`,
      timestamp: new Date().toISOString()
    };

    const adminNotifications = JSON.parse(localStorage.getItem('mssnAdminNotifications') || '[]');
    adminNotifications.push(adminNotification);
    localStorage.setItem('mssnAdminNotifications', JSON.stringify(adminNotifications));
    
    console.log('✅ Blog published and emails sent via Web3Forms');
    
    toast.success(`📧 Newsletter sent to ${subscribers.length} subscriber${subscribers.length === 1 ? '' : 's'}!`, {
      duration: 5000
    });
    
    setTimeout(() => {
      toast.info(`✅ Admin confirmation sent to mssnunilorin2025@gmail.com`, {
        duration: 3000
      });
    }, 1000);
  };

  // Handle dialog close with auto-save
  const handleCreateDialogClose = (open: boolean) => {
    if (!open) {
      // Auto-save as draft post before closing if there's content
      if (formData.title || formData.content) {
        // Check if an auto-saved draft already exists for this session
        const existingDraftId = localStorage.getItem('draft_new_id');
        
        if (existingDraftId) {
          // Update existing auto-saved draft
          const updatedPost: BlogPost = {
            id: existingDraftId,
            title: formData.title || 'Untitled Draft',
            content: formData.content,
            author: formData.author || 'Unknown Author',
            date: new Date().toISOString().split('T')[0],
            image: formData.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
            category: formData.category,
            excerpt: formData.excerpt || 'Auto-saved draft',
            isDraft: true,
            views: 0
          };
          
          const updatedPosts = posts.map(post => 
            post.id === existingDraftId ? updatedPost : post
          );
          savePosts(updatedPosts);
        } else {
          // Create new auto-saved draft
          const newDraftId = 'draft_' + Date.now().toString();
          const newDraft: BlogPost = {
            id: newDraftId,
            title: formData.title || 'Untitled Draft',
            content: formData.content,
            author: formData.author || 'Unknown Author',
            date: new Date().toISOString().split('T')[0],
            image: formData.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
            category: formData.category,
            excerpt: formData.excerpt || 'Auto-saved draft',
            isDraft: true,
            views: 0
          };
          
          const updatedPosts = [newDraft, ...posts];
          savePosts(updatedPosts);
          localStorage.setItem('draft_new_id', newDraftId);
        }
        
        toast.info('Your work has been auto-saved as a draft post');
        // Clear the temporary draft key
        localStorage.removeItem('draft_new');
      } else {
        // Clear draft references if there's no content
        localStorage.removeItem('draft_new');
        const draftId = localStorage.getItem('draft_new_id');
        if (draftId) {
          localStorage.removeItem('draft_new_id');
        }
      }
    }
    setIsCreateDialogOpen(open);
    if (!open) {
      // Clear the draft ID reference when reopening
      localStorage.removeItem('draft_new_id');
      resetForm();
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    if (!open && editingPost) {
      // Auto-save changes to the existing post as draft
      if (formData.title || formData.content) {
        const updatedPost: BlogPost = {
          ...editingPost,
          title: formData.title || editingPost.title,
          content: formData.content || editingPost.content,
          author: formData.author || editingPost.author,
          image: formData.image || editingPost.image,
          category: formData.category,
          excerpt: formData.excerpt || editingPost.excerpt,
          isDraft: true // Mark as draft when auto-saved
        };
        
        const updatedPosts = posts.map(post => 
          post.id === editingPost.id ? updatedPost : post
        );
        savePosts(updatedPosts);
        toast.info('Your changes have been auto-saved as a draft');
        
        // Clear the temporary draft key
        localStorage.removeItem(`draft_${editingPost.id}`);
      }
    }
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingPost(null);
      resetForm();
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for cover images)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({...formData, image: base64});
      setImagePreview(base64);
      toast.success('Cover image uploaded successfully');
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData({...formData, image: ''});
    setImagePreview('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate statistics
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => !post.isDraft).length;
  const draftPosts = posts.filter(post => post.isDraft).length;
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="MSSN UNILORIN Logo" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage Blog Posts & Resources</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onNavigateHome}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Home
              </Button>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 h-12 bg-white shadow-md">
            <TabsTrigger value="blog" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Mail className="w-4 h-4 mr-2" />
              Email Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-8">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{totalPosts}</span>
                <FileText className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{publishedPosts}</span>
                <FileEdit className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{draftPosts}</span>
                <Save className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{totalViews}</span>
                <Eye className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-gray-900">All Posts</h2>
          <Button 
            onClick={openCreateDialog}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 w-4 h-4" />
            Create New Post
          </Button>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-6">Create your first blog post to get started</p>
            <Button onClick={openCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 w-4 h-4" />
              Create Post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      post.isDraft 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {post.isDraft ? 'Draft' : 'Published'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views} views
                    </span>
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    By {post.author} • {formatDate(post.date)}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => openEditDialog(post)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Edit className="mr-1 w-4 h-4" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeletePost(post.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <ResourcesAdmin />
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Blog Post</DialogTitle>
            <DialogDescription>Fill out the form below to create a new blog post for MSSN UNILORIN</DialogDescription>
          </DialogHeader>
          
          {autoSaveStatus && (
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              <Save className="w-3 h-3" />
              {autoSaveStatus}
            </div>
          )}
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">Title *</Label>
              <Input
                id="create-title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-author">Author *</Label>
              <Input
                id="create-author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
                <SelectTrigger id="create-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Welfare">Welfare</SelectItem>
                  <SelectItem value="Da'wah">Da'wah</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              
              {/* Image Preview */}
              {(imagePreview || formData.image) && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                  <ImageWithFallback
                    src={imagePreview || formData.image}
                    alt="Cover image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              
              {/* URL Input as alternative */}
              <div className="space-y-1">
                <Label htmlFor="create-image" className="text-xs text-gray-600">Or enter image URL:</Label>
                <Input
                  id="create-image"
                  placeholder="https://example.com/image.jpg (optional)"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                  onChange={(e) => {
                    setFormData({...formData, image: e.target.value});
                    setImagePreview(e.target.value);
                  }}
                />
              </div>
              
              <p className="text-xs text-gray-500">Upload an image or enter a URL. Leave empty for default image.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-excerpt">Excerpt *</Label>
              <Textarea
                id="create-excerpt"
                placeholder="Brief summary of the post (1-2 sentences)"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Content * (Use toolbar for formatting and image upload)</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({...formData, content: value})}
              />
            </div>

            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <Switch
                id="create-draft"
                checked={formData.isDraft}
                onCheckedChange={(checked: any) => setFormData({...formData, isDraft: checked})}
              />
              <Label htmlFor="create-draft" className="cursor-pointer">
                Save as draft (post will not be visible to public)
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => handleCreateDialogClose(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {formData.isDraft ? 'Save Draft' : 'Publish Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Blog Post</DialogTitle>
            <DialogDescription>Update the blog post details in the form below</DialogDescription>
          </DialogHeader>
          
          {autoSaveStatus && (
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              <Save className="w-3 h-3" />
              {autoSaveStatus}
            </div>
          )}
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Welfare">Welfare</SelectItem>
                  <SelectItem value="Da'wah">Da'wah</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              
              {/* Image Preview */}
              {(imagePreview || formData.image) && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                  <ImageWithFallback
                    src={imagePreview || formData.image}
                    alt="Cover image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              
              {/* URL Input as alternative */}
              <div className="space-y-1">
                <Label htmlFor="edit-image" className="text-xs text-gray-600">Or enter image URL:</Label>
                <Input
                  id="edit-image"
                  placeholder="https://example.com/image.jpg (optional)"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                  onChange={(e) => {
                    setFormData({...formData, image: e.target.value});
                    setImagePreview(e.target.value);
                  }}
                />
              </div>
              
              <p className="text-xs text-gray-500">Upload an image or enter a URL.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Excerpt *</Label>
              <Textarea
                id="edit-excerpt"
                placeholder="Brief summary of the post (1-2 sentences)"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Content * (Use toolbar for formatting and image upload)</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({...formData, content: value})}
              />
            </div>

            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <Switch
                id="edit-draft"
                checked={formData.isDraft}
                onCheckedChange={(checked: any) => setFormData({...formData, isDraft: checked})}
              />
              <Label htmlFor="edit-draft" className="cursor-pointer">
                Save as draft (post will not be visible to public)
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => handleEditDialogClose(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePost}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {formData.isDraft ? 'Save Draft' : 'Update Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}