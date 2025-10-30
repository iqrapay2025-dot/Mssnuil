import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  Download, 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  Calendar,
  Eye,
  ArrowLeft,
  ExternalLink,
  Music,
  Film,
  Play
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  category: string;
  fileSize?: string;
  views?: number;
  fileType?: 'url' | 'audio' | 'video';
  fileName?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ResourcesProps {
  onBack: () => void;
}

export function Resources({ onBack }: ResourcesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('newsletters');

  // Check for selected resource type from sessionStorage
  useEffect(() => {
    const selectedType = sessionStorage.getItem('selectedResourceType');
    if (selectedType) {
      setActiveTab(selectedType);
      // Clear it after using
      sessionStorage.removeItem('selectedResourceType');
    }
  }, []);

  // Load resources from localStorage
  const newsletters: Resource[] = JSON.parse(localStorage.getItem('newsletters') || '[]');
  const books: Resource[] = JSON.parse(localStorage.getItem('books') || '[]');
  const lectures: Resource[] = JSON.parse(localStorage.getItem('lectures') || '[]');
  const reports: Resource[] = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Initialize default FAQs if none exist in localStorage
  const initializeFAQs = () => {
    const existingFAQs = localStorage.getItem('faqs');
    if (!existingFAQs || JSON.parse(existingFAQs).length === 0) {
      const defaultFAQs: FAQ[] = [
    {
      id: '1',
      question: 'How do I become a member of MSSN UNILORIN?',
      answer: 'All Muslim students of the University of Ilorin are automatically eligible for MSSN membership. Visit the MSSN secretariat during registration periods to complete your membership registration and get your membership card.',
      category: 'Membership'
    },
    {
      id: '2',
      question: 'What are the membership dues?',
      answer: 'Membership dues are minimal and announced at the beginning of each academic session. The fees help support welfare programs, da\'wah activities, and organizational running costs.',
      category: 'Membership'
    },
    {
      id: '3',
      question: 'Can non-Muslim students attend MSSN events?',
      answer: 'Yes! Our da\'wah programs, academic seminars, and some social events are open to all students. We welcome anyone interested in learning about Islam or participating in our community service activities.',
      category: 'Events'
    },
    {
      id: '4',
      question: 'How can I volunteer for MSSN activities?',
      answer: 'You can volunteer by contacting any of our committee heads or visiting the secretariat. We have various units including Da\'wah, Welfare, Editorial, Sports, and Sisters\' Affairs. Choose what aligns with your interests and skills.',
      category: 'Involvement'
    },
    {
      id: '5',
      question: 'Does MSSN provide academic support?',
      answer: 'Yes! We organize study groups, tutorial sessions, and academic seminars. We also have a mentorship program where senior students guide junior colleagues in their studies.',
      category: 'Academic'
    },
    {
      id: '6',
      question: 'What is the MSSN Annual Week?',
      answer: 'MSSN Annual Week is our flagship event held annually. It features Islamic lectures, competitions, cultural displays, charity activities, and culminates in a grand dinner. It\'s a week of spiritual rejuvenation and community bonding.',
      category: 'Events'
    },
    {
      id: '7',
      question: 'How can I get welfare support?',
      answer: 'If you\'re facing financial difficulties or need assistance, contact the Welfare Committee through the secretariat or any MSSN executive member. All requests are handled with confidentiality and compassion.',
      category: 'Welfare'
    },
        {
          id: '8',
          question: 'Where and when are Halaqah sessions held?',
          answer: 'Halaqah sessions are held everyday except Friday at the Central Mosque Unilorin from 7:30 PM to 8:00 PM. Sessions include Qur\'an recitation, Tafsir, Hadith studies, and Islamic discussions.',
          category: 'Programs'
        }
      ];
      localStorage.setItem('faqs', JSON.stringify(defaultFAQs));
      return defaultFAQs;
    }
    return JSON.parse(existingFAQs);
  };

  const faqs: FAQ[] = initializeFAQs();

  const filterResources = (resources: Resource[]) => {
    if (!searchQuery) return resources;
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterFAQs = () => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDownload = (resource: Resource) => {
    // Increment view count
    const storageKey = getStorageKey(resource.category);
    const resources = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedResources = resources.map((r: Resource) => 
      r.id === resource.id ? { ...r, views: (r.views || 0) + 1 } : r
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedResources));
    
    // Handle download based on file type
    if (resource.fileType === 'audio' || resource.fileType === 'video') {
      // For uploaded files (base64), trigger download
      try {
        const link = document.createElement('a');
        link.href = resource.fileUrl;
        link.download = resource.fileName || `${resource.title}.${resource.fileType === 'audio' ? 'mp3' : 'mp4'}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up after a short delay
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      } catch (error) {
        console.error('Download error:', error);
        // Fallback: open in new tab
        window.open(resource.fileUrl, '_blank');
      }
    } else {
      // For URL links, open in new tab
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleDirectDownload = (resource: Resource) => {
    // Increment view count
    const storageKey = getStorageKey(resource.category);
    const resources = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedResources = resources.map((r: Resource) => 
      r.id === resource.id ? { ...r, views: (r.views || 0) + 1 } : r
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedResources));
    
    // Try to force download for URL links
    try {
      // Extract filename from URL or use title
      const urlParts = resource.fileUrl.split('/');
      const fileName = resource.fileName || urlParts[urlParts.length - 1] || resource.title;
      
      // Create invisible link and trigger download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(resource.fileUrl, '_blank');
    }
  };

  const getStorageKey = (category: string): string => {
    const keyMap: { [key: string]: string } = {
      'Newsletter': 'newsletters',
      'Book': 'books',
      'Lecture': 'lectures',
      'Report': 'reports'
    };
    return keyMap[category] || 'resources';
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const isAudio = resource.fileType === 'audio';
    const isVideo = resource.fileType === 'video';
    const isUploadedFile = isAudio || isVideo;

    return (
      <div>
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-600">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {isAudio && <Music className="w-5 h-5 text-emerald-600" />}
                  {isVideo && <Film className="w-5 h-5 text-emerald-600" />}
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
                {isUploadedFile && resource.fileName && (
                  <p className="text-xs text-gray-500 mt-2 italic">File: {resource.fileName}</p>
                )}
              </div>
              <Badge variant="secondary" className="ml-2">
                {resource.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(resource.uploadDate).toLocaleDateString()}
                </span>
                {resource.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {resource.views} views
                  </span>
                )}
                {resource.fileSize && (
                  <span>{resource.fileSize}</span>
                )}
              </div>
            </div>

            {/* Audio Player */}
            {isAudio && (
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                <audio controls className="w-full">
                  <source src={resource.fileUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Video Player */}
            {isVideo && (
              <div className="mb-4 rounded-lg overflow-hidden bg-black">
                <video controls className="w-full">
                  <source src={resource.fileUrl} />
                  Your browser does not support the video element.
                </video>
              </div>
            )}

            {/* Download/Open Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDownload(resource)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isUploadedFile ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download {isAudio ? 'Audio' : 'Video'}
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </>
                )}
              </Button>
              {!isUploadedFile && (
                <Button 
                  onClick={() => handleDirectDownload(resource)}
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl mb-4">Resources Library</h1>
            <p className="text-xl text-emerald-100 max-w-2xl">
              Access newsletters, Islamic books, lecture recordings, activity reports, and answers to frequently asked questions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-white p-2 rounded-lg shadow-md">
            <TabsTrigger value="newsletters" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Newsletters
            </TabsTrigger>
            <TabsTrigger value="books" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
            <TabsTrigger value="lectures" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Video className="w-4 h-4 mr-2" />
              Lectures
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              FAQs
            </TabsTrigger>
          </TabsList>

          {/* Newsletters */}
          <TabsContent value="newsletters" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Newsletter Archive</h2>
              <p className="text-gray-600">Monthly newsletters covering MSSN activities, Islamic articles, and campus news</p>
            </div>
            {filterResources(newsletters).length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No newsletters available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterResources(newsletters).map((newsletter) => (
                  <ResourceCard key={newsletter.id} resource={newsletter} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Books */}
          <TabsContent value="books" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Islamic Library</h2>
              <p className="text-gray-600">Study materials, Islamic books, and educational resources</p>
            </div>
            {filterResources(books).length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No books available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterResources(books).map((book) => (
                  <ResourceCard key={book.id} resource={book} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Lectures */}
          <TabsContent value="lectures" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Lecture Recordings</h2>
              <p className="text-gray-600">Recorded da'wah sessions, seminars, and Islamic lectures</p>
            </div>
            {filterResources(lectures).length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No lecture recordings available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterResources(lectures).map((lecture) => (
                  <ResourceCard key={lecture.id} resource={lecture} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Activity Reports</h2>
              <p className="text-gray-600">Annual and quarterly reports on MSSN activities and achievements</p>
            </div>
            {filterResources(reports).length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No activity reports available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterResources(reports).map((report) => (
                  <ResourceCard key={report.id} resource={report} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faqs" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find answers to common questions about MSSN UNILORIN</p>
            </div>
            {filterFAQs().length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 text-lg">No FAQs match your search</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    {filterFAQs().map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="text-left">
                            <Badge variant="outline" className="mb-2">{faq.category}</Badge>
                            <p className="text-lg">{faq.question}</p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-base pt-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
