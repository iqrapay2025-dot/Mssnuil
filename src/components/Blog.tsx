import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Calendar, User, ArrowLeft, Tag, Eye, BookOpen, Share2, Facebook, Twitter, Linkedin, MessageCircle, Send, Heart, Mail } from 'lucide-react';
import { toast } from 'sonner';
import logoImage from 'figma:asset/fbc52c4cf3ddc1eecd0ce430195ad1b2888e1b5e.png';
import { ShareButtons } from './ShareButtons';
import { Comments } from './Comments';
import { NewsletterSubscription } from './NewsletterSubscription';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
  isDraft?: boolean;
  views?: number;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

interface BlogProps {
  onNavigateHome: () => void;
}

export function Blog({ onNavigateHome }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const storedPosts = localStorage.getItem('mssnBlogPosts');
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      // Only show published posts (not drafts)
      const publishedPosts = allPosts.filter((post: BlogPost) => !post.isDraft);
      setPosts(publishedPosts);
    } else {
      // Default posts if none exist
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: 'MSSN UNILORIN Hosts Annual Islamic Week 2025',
          content: `<p>The Muslim Students' Society of Nigeria (MSSN) University of Ilorin branch successfully hosted its Annual Islamic Week from January 15-21, 2025. The week-long event featured enlightening lectures, spiritual sessions, and community outreach programs.</p>

<p>The theme for this year was "Building Tomorrow's Ummah Today" and featured renowned Islamic scholars from across Nigeria. Over 2,000 students participated in various activities including Qur'an recitation competitions, Islamic quiz competitions, and charity drives.</p>

<p>The event concluded with a grand finale that brought together Muslim students from different faculties to celebrate faith, unity, and knowledge. The organizing committee expressed gratitude to all participants and sponsors who made the event a success.</p>

<h3>Highlights included:</h3>
<ul>
  <li>Daily Tafsir sessions</li>
  <li>Academic excellence seminars</li>
  <li>Charity distribution to less privileged students</li>
  <li>Career development workshops</li>
  <li>Inter-faculty Islamic quiz competition</li>
</ul>

<p>The society looks forward to making next year's event even more impactful, continuing its mission to nurture spiritually and academically excellent Muslim students.</p>`,
          author: 'Abdullahi Ibrahim',
          date: '2025-01-22',
          image: 'https://images.unsplash.com/photo-1650799733482-4ad0f06a3d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwbW9zcXVlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTc3NjM2MXww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Events',
          excerpt: 'A week-long celebration of faith, knowledge, and community service featuring lectures, competitions, and charity drives.',
          isDraft: false,
          views: 0
        },
        {
          id: '2',
          title: 'MSSN Launches Academic Support Program for New Students',
          content: `<p>In a bid to support academic excellence among Muslim students, MSSN UNILORIN has launched a comprehensive Academic Support Program designed to help freshmen transition smoothly into university life.</p>

<p>The program, which kicked off this semester, offers free tutorials across various faculties including Engineering, Sciences, Arts, and Management Sciences. Experienced senior students and MSSN alumni serve as tutors and mentors.</p>

<p><strong>"We understand that the transition from secondary school to university can be challenging,"</strong> said the Ameer of MSSN UNILORIN. <em>"This program ensures that no Muslim student is left behind academically while maintaining their spiritual growth."</em></p>

<h3>The initiative includes:</h3>
<ul>
  <li>Weekly tutorial sessions</li>
  <li>Peer mentorship programs</li>
  <li>Study groups for core courses</li>
  <li>Past questions and study materials</li>
  <li>Career guidance counseling</li>
</ul>

<p>Students interested in joining the program can register at the MSSN secretariat or contact the Academic Affairs unit. The society remains committed to producing graduates who excel both academically and spiritually.</p>`,
          author: 'Fatimah Yusuf',
          date: '2025-01-18',
          image: 'https://images.unsplash.com/photo-1590720485412-fc0322a7acb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdXJhbiUyMG9wZW4lMjBib29rfGVufDF8fHx8MTc2MTg0ODg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Academic',
          excerpt: 'Free tutorial program launched to support Muslim students achieve academic excellence while maintaining spiritual growth.',
          isDraft: false,
          views: 0
        },
        {
          id: '3',
          title: 'Community Outreach: MSSN Distributes Relief Materials',
          content: `<p>As part of its commitment to humanitarian service, MSSN UNILORIN conducted a massive charity drive distributing food items and essential supplies to underprivileged students and neighboring communities.</p>

<p>The welfare program, held last weekend, saw the distribution of over 500 bags of foodstuff including rice, beans, garri, and vegetable oil to students facing financial hardship and community members in need.</p>

<p><strong>"Islam teaches us to care for one another,"</strong> explained the Welfare Coordinator. <em>"This initiative reflects our commitment to putting faith into action through service to humanity."</em></p>

<h3>The outreach program also included:</h3>
<ul>
  <li>Free medical screening</li>
  <li>Educational materials for primary school students</li>
  <li>Clothing donations</li>
  <li>Financial assistance to struggling students</li>
</ul>

<p>The society expressed appreciation to donors and volunteers who made the program possible. MSSN UNILORIN continues to demonstrate that faith and service go hand in hand, making a tangible difference in the lives of students and community members.</p>`,
          author: 'Muhammad Aliyu',
          date: '2025-01-15',
          image: 'https://images.unsplash.com/photo-1733740615104-0d3d624f7557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwY2FsbGlncmFwaHklMjBhcnR8ZW58MXx8fHwxNzYxODA0Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Welfare',
          excerpt: 'MSSN distributes foodstuff and essential supplies to over 500 students and community members in need.',
          isDraft: false,
          views: 0
        }
      ];
      localStorage.setItem('mssnBlogPosts', JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleReadPost = (post: BlogPost) => {
    // Increment view count
    const storedPosts = localStorage.getItem('mssnBlogPosts');
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      const updatedPosts = allPosts.map((p: BlogPost) => {
        if (p.id === post.id) {
          return { ...p, views: (p.views || 0) + 1 };
        }
        return p;
      });
      localStorage.setItem('mssnBlogPosts', JSON.stringify(updatedPosts));
      
      // Update local state
      const updatedPost = { ...post, views: (post.views || 0) + 1 };
      setSelectedPost(updatedPost);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
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
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => {
                    setSelectedPost(null);
                    loadPosts(); // Reload to get updated view counts
                  }}
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Blog
                </Button>
                <Button 
                  onClick={onNavigateHome}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(selectedPost.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{selectedPost.views || 0} views</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-8">
                <User className="w-4 h-4" />
                <span>By {selectedPost.author}</span>
              </div>
            </div>

            <div className="mb-8 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-96 object-cover"
              />
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
            
            <Separator className="my-8" />
            
            <div className="mt-8">
              <ShareButtons 
                title={selectedPost.title}
                url={`https://mssnunilorin.org/blog/${selectedPost.id}/${selectedPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              />
            </div>
            
            <Separator className="my-8" />
            
            <div className="mt-8">
              <Comments postId={selectedPost.id} />
            </div>
            
            <Separator className="my-8" />
            
            <div className="mt-8">
              <NewsletterSubscription />
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            </div>
            <Button 
              onClick={onNavigateHome}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6">MSSN UNILORIN Blog</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Stay updated with the latest news, events, and insights from the Muslim Students' Society
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl text-gray-600 mb-2">No posts yet</h3>
              <p className="text-gray-500">Check back soon for updates from MSSN UNILORIN</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views || 0}
                      </span>
                    </div>
                    
                    <h3 className="text-xl text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleReadPost(post)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <BookOpen className="mr-2 w-4 h-4" />
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Subscription Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  );
}