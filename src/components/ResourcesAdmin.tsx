import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';
import { 
  FileText, 
  BookOpen, 
  Video, 
  Upload, 
  Trash2, 
  Edit,
  Plus,
  Save,
  X,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Eye,
  Music,
  Film,
  Download
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

type ResourceType = 'newsletters' | 'books' | 'lectures' | 'reports';
type TabType = ResourceType | 'faqs';

export function ResourcesAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('newsletters');
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force re-renders
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileSize: '',
    fileType: 'url' as 'url' | 'audio' | 'video',
    fileName: ''
  });

  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'Membership'
  });

  const getCategoryLabel = (type: ResourceType): string => {
    const labels = {
      newsletters: 'Newsletter',
      books: 'Book',
      lectures: 'Lecture',
      reports: 'Report'
    };
    return labels[type];
  };

  const loadResources = (type: ResourceType): Resource[] => {
    return JSON.parse(localStorage.getItem(type) || '[]');
  };

  const saveResources = (type: ResourceType, resources: Resource[]) => {
    localStorage.setItem(type, JSON.stringify(resources));
    setRefreshKey(prev => prev + 1); // Trigger refresh after save
  };

  const loadFAQs = (): FAQ[] => {
    return JSON.parse(localStorage.getItem('faqs') || '[]');
  };

  const saveFAQs = (faqs: FAQ[]) => {
    localStorage.setItem('faqs', JSON.stringify(faqs));
    setRefreshKey(prev => prev + 1); // Trigger refresh after save
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type for lectures
    const audioFormats = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'opus'];
    const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm4v', 'mpeg', 'mpg', '3gp'];
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isAudio = audioFormats.includes(fileExtension);
    const isVideo = videoFormats.includes(fileExtension);

    if (!isAudio && !isVideo) {
      toast.error('Please upload an audio or video file', {
        description: `Supported formats: ${audioFormats.join(', ')}, ${videoFormats.join(', ')}`
      });
      return;
    }

    // Check file size (warn if > 50MB for localStorage)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      toast.error('File too large for local storage', {
        description: 'Please use files under 50MB or upload to Google Drive/YouTube and use the URL method'
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setResourceForm(prev => ({
        ...prev,
        fileUrl: base64,
        fileSize: `${fileSizeMB.toFixed(2)} MB`,
        fileType: isAudio ? 'audio' : 'video',
        fileName: file.name
      }));
      setIsUploading(false);
      toast.success('File loaded successfully!', {
        description: `${file.name} (${fileSizeMB.toFixed(2)} MB)`
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleAddResource = (type: ResourceType) => {
    if (!resourceForm.title || !resourceForm.description || !resourceForm.fileUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resources = loadResources(type);

    if (editingResource) {
      // Update existing resource
      const updated = resources.map(resource => 
        resource.id === editingResource.id 
          ? { 
              ...resource, 
              title: resourceForm.title,
              description: resourceForm.description,
              fileUrl: resourceForm.fileUrl,
              fileSize: resourceForm.fileSize,
              fileType: resourceForm.fileType,
              fileName: resourceForm.fileName
            }
          : resource
      );
      saveResources(type, updated);
      toast.success(`✅ ${getCategoryLabel(type)} Updated Successfully!`, {
        description: 'The changes have been saved and are now live'
      });
      setEditingResource(null);
    } else {
      // Add new resource
      const newResource: Resource = {
        id: Date.now().toString(),
        title: resourceForm.title,
        description: resourceForm.description,
        fileUrl: resourceForm.fileUrl,
        fileSize: resourceForm.fileSize,
        uploadDate: new Date().toISOString(),
        category: getCategoryLabel(type),
        views: 0,
        fileType: resourceForm.fileType,
        fileName: resourceForm.fileName
      };

      resources.unshift(newResource);
      saveResources(type, resources);

      // Send email notification to all newsletter subscribers
      sendResourceNotificationToSubscribers(newResource);

      toast.success(`🎉 ${getCategoryLabel(type)} Published Successfully!`, {
        description: 'The resource is now live and visible to all students on the Resources page'
      });
    }

    setResourceForm({ title: '', description: '', fileUrl: '', fileSize: '', fileType: 'url', fileName: '' });
    setUploadMethod('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send email notification to subscribers when a new resource is uploaded
  const sendResourceNotificationToSubscribers = async (resource: Resource) => {
    const subscribers = JSON.parse(localStorage.getItem('mssnNewsletterSubscribers') || '[]');
    
    if (subscribers.length === 0) {
      return;
    }

    // Send real emails via Web3Forms
    const emailPromises = subscribers.map(async (subscriberEmail: string) => {
      try {
        const formData = new FormData();
        formData.append("access_key", "eff86a18-e6e9-4fbc-964a-8142912fc058");
        formData.append("subject", `📚 New ${resource.category} Available - MSSN UNILORIN`);
        formData.append("from_name", "MSSN UNILORIN");
        formData.append("email", subscriberEmail);
        formData.append("message", `As-salamu alaykum!\n\nWe're excited to share a new resource with you:\n\n📖 ${resource.title}\n\n${resource.description}\n\nCategory: ${resource.category}\n${resource.fileSize ? `Size: ${resource.fileSize}` : ''}\n\nVisit the Resources page on our website to access this content and explore more materials for your spiritual and academic growth.\n\nMay this knowledge benefit you in this life and the Hereafter!\n\nBarakallahu feekum,\n- MSSN UNILORIN Team\n\nWebsite: MSSN UNILORIN\nEmail: mssnunilorin2025@gmail.com\nPhone: +2348149650568`);

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
    
    setTimeout(() => {
      toast.success(`📧 Email notifications sent to ${subscribers.length} subscriber${subscribers.length === 1 ? '' : 's'}!`, {
        duration: 4000
      });
    }, 500);
  };

  const addSampleResource = (type: ResourceType) => {
    const samples = {
      newsletters: {
        title: 'MSSN Monthly Newsletter - October 2024',
        description: 'This month\'s newsletter features updates on the Annual Week preparations, spiritual programs, and academic support initiatives.',
        fileUrl: 'https://drive.google.com/file/d/sample',
        fileSize: '2.3 MB',
        fileType: 'url' as const,
        fileName: ''
      },
      books: {
        title: 'The Book of Tawheed - Muhammad ibn Abdul Wahhab',
        description: 'A fundamental text explaining the concept of Islamic monotheism with evidence from the Quran and Sunnah.',
        fileUrl: 'https://drive.google.com/file/d/sample',
        fileSize: '5.8 MB',
        fileType: 'url' as const,
        fileName: ''
      },
      lectures: {
        title: 'Understanding Prayer - Sheikh Muhammad Hassan',
        description: 'A comprehensive lecture on the importance, prerequisites, and proper performance of Salah delivered during Ramadan 2024.',
        fileUrl: 'https://www.youtube.com/watch?v=sample',
        fileSize: '250 MB',
        fileType: 'url' as const,
        fileName: ''
      },
      reports: {
        title: 'MSSN Annual Report 2023/2024',
        description: 'Comprehensive report covering all activities, achievements, challenges, and financial summary for the academic year.',
        fileUrl: 'https://drive.google.com/file/d/sample',
        fileSize: '4.1 MB',
        fileType: 'url' as const,
        fileName: ''
      }
    };

    setResourceForm(samples[type]);
    toast.info('Sample data loaded! You can edit it and add your real link.');
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      fileUrl: resource.fileUrl,
      fileSize: resource.fileSize || '',
      fileType: resource.fileType || 'url',
      fileName: resource.fileName || ''
    });
    setUploadMethod(resource.fileType && resource.fileType !== 'url' ? 'file' : 'url');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
    setResourceForm({ title: '', description: '', fileUrl: '', fileSize: '', fileType: 'url', fileName: '' });
    setUploadMethod('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreviewDownload = (resource: Resource) => {
    // For uploaded files (base64), trigger download
    if (resource.fileType === 'audio' || resource.fileType === 'video') {
      try {
        const link = document.createElement('a');
        link.href = resource.fileUrl;
        link.download = resource.fileName || `${resource.title}.${resource.fileType === 'audio' ? 'mp3' : 'mp4'}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      } catch (error) {
        console.error('Download error:', error);
        window.open(resource.fileUrl, '_blank');
      }
    } else {
      // For URL links, open in new tab
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleDeleteResource = (type: ResourceType, id: string) => {
    const resources = loadResources(type);
    const filtered = resources.filter(r => r.id !== id);
    saveResources(type, filtered);
    toast.success('Resource deleted successfully');
  };

  const handleAddFAQ = () => {
    if (!faqForm.question || !faqForm.answer) {
      toast.error('Please fill in all fields');
      return;
    }

    const faqs = loadFAQs();
    
    if (editingFAQ) {
      // Update existing FAQ
      const updated = faqs.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...faq, ...faqForm }
          : faq
      );
      saveFAQs(updated);
      toast.success('FAQ updated successfully');
      setEditingFAQ(null);
    } else {
      // Add new FAQ
      const newFAQ: FAQ = {
        id: Date.now().toString(),
        ...faqForm
      };
      faqs.push(newFAQ);
      saveFAQs(faqs);
      toast.success('FAQ added successfully');
    }

    setFaqForm({ question: '', answer: '', category: 'Membership' });
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
  };

  const handleDeleteFAQ = (id: string) => {
    const faqs = loadFAQs();
    const filtered = faqs.filter(faq => faq.id !== id);
    saveFAQs(filtered);
    toast.success('FAQ deleted successfully');
  };

  const getPlaceholders = (type: ResourceType) => {
    const placeholders = {
      newsletters: {
        title: 'e.g., MSSN Monthly Bulletin - October 2024',
        description: 'Monthly newsletter covering campus activities, Islamic articles, and event highlights',
        url: 'https://drive.google.com/file/d/1abc...'
      },
      books: {
        title: 'e.g., Tafsir Ibn Kathir - Juz Amma',
        description: 'Detailed commentary on the last portion of the Quran by Ibn Kathir',
        url: 'https://drive.google.com/file/d/1abc...'
      },
      lectures: {
        title: 'e.g., Understanding Tawheed - Sheikh Abdullah',
        description: 'Comprehensive lecture on the concept of Islamic monotheism delivered at MSSN Annual Week 2024',
        url: 'https://www.youtube.com/watch?v=...'
      },
      reports: {
        title: 'e.g., MSSN Annual Report 2023/2024',
        description: 'Comprehensive report covering activities, achievements, and financial summary for the academic session',
        url: 'https://drive.google.com/file/d/1abc...'
      }
    };
    return placeholders[type];
  };

  // Input change handlers with proper typing
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResourceForm(prev => ({ ...prev, title: value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResourceForm(prev => ({ ...prev, description: value }));
  }, []);

  const handleFileUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResourceForm(prev => ({ ...prev, fileUrl: value, fileType: 'url' }));
  }, []);

  const handleFileSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResourceForm(prev => ({ ...prev, fileSize: value }));
  }, []);

  const handleFaqQuestionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFaqForm(prev => ({ ...prev, question: value }));
  }, []);

  const handleFaqAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFaqForm(prev => ({ ...prev, answer: value }));
  }, []);

  const ResourceUploadForm = ({ type }: { type: ResourceType }) => {
    const placeholders = getPlaceholders(type);
    const isLecture = type === 'lectures';
    
    return (
      <Card className="border-2 border-emerald-100">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {editingResource ? (
                  <><Edit className="w-5 h-5 text-emerald-600" /> Edit {getCategoryLabel(type)}</>
                ) : (
                  <><Upload className="w-5 h-5 text-emerald-600" /> Add New {getCategoryLabel(type)}</>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {editingResource ? (
                  'Update the details below to modify this resource'
                ) : (
                  isLecture 
                    ? 'Upload audio/video files directly or paste a link from YouTube/Google Drive'
                    : 'Fill in the details below and paste a shareable link from Google Drive, YouTube, or Dropbox'
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {editingResource && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-xs"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
              {!editingResource && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSampleResource(type)}
                  className="text-xs"
                >
                  Load Sample
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {isLecture && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setUploadMethod('url');
                  setResourceForm(prev => ({ ...prev, fileUrl: '', fileType: 'url', fileName: '' }));
                }}
                className={uploadMethod === 'url' ? 'flex-1 bg-white shadow-sm' : 'flex-1'}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                URL Link
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setUploadMethod('file');
                  setResourceForm(prev => ({ ...prev, fileUrl: '', fileType: 'audio', fileName: '' }));
                }}
                className={uploadMethod === 'file' ? 'flex-1 bg-white shadow-sm' : 'flex-1'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          )}
          <div>
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={placeholders.title}
              value={resourceForm.title}
              onChange={handleTitleChange}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a clear, descriptive title that helps users understand the content
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={placeholders.description}
              value={resourceForm.description}
              onChange={handleDescriptionChange}
              rows={3}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide details about the content, target audience, or topics covered
            </p>
          </div>

          {isLecture && uploadMethod === 'file' ? (
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                Upload Audio/Video File <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma,.opus,.mp4,.webm,.mov,.avi,.mkv,.flv,.wmv,.m4v,.mpeg,.mpg,.3gp"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="lecture-file-upload"
                />
                <label htmlFor="lecture-file-upload">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    resourceForm.fileUrl ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}>
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-600">Uploading file...</p>
                      </div>
                    ) : resourceForm.fileUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        {resourceForm.fileType === 'audio' ? (
                          <Music className="w-12 h-12 text-emerald-600" />
                        ) : (
                          <Film className="w-12 h-12 text-emerald-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-emerald-700">{resourceForm.fileName}</p>
                          <p className="text-xs text-gray-600 mt-1">{resourceForm.fileSize}</p>
                        </div>
                        <p className="text-xs text-emerald-600 mt-2">✓ File uploaded successfully! Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Click to upload audio or video file</p>
                          <p className="text-xs text-gray-500 mt-1">Max size: 50MB for local storage</p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Supported formats:</strong>
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  <strong>Audio:</strong> MP3, WAV, OGG, M4A, AAC, FLAC, WMA, OPUS<br/>
                  <strong>Video:</strong> MP4, WEBM, MOV, AVI, MKV, FLV, WMV, M4V, MPEG, 3GP
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  💡 For files larger than 50MB, use the URL method with Google Drive or YouTube
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="fileUrl" className="text-sm font-medium flex items-center gap-1">
                File URL <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="fileUrl"
                  placeholder={placeholders.url}
                  value={resourceForm.fileUrl}
                  onChange={handleFileUrlChange}
                  className="pr-10"
                />
                <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Steps:</strong>
                </p>
                <ol className="text-xs text-blue-700 ml-4 mt-1 space-y-0.5 list-decimal">
                  <li>Upload file to Google Drive/Dropbox/YouTube</li>
                  <li>Set sharing to "Anyone with link can view"</li>
                  <li>Copy the shareable link and paste it here</li>
                </ol>
              </div>
            </div>
          )}

          {(!isLecture || uploadMethod === 'url') && (
            <div>
              <Label htmlFor="fileSize" className="text-sm font-medium">
                File Size <span className="text-gray-400 text-xs">(optional)</span>
              </Label>
              <Input
                id="fileSize"
                placeholder="e.g., 2.5 MB, 15.3 MB, 120 MB"
                value={resourceForm.fileSize}
                onChange={handleFileSizeChange}
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Helps users with limited data know the file size before downloading
              </p>
            </div>
          )}

          <div className="pt-2 space-y-2">
            {resourceForm.fileUrl && resourceForm.fileType === 'url' && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => window.open(resourceForm.fileUrl, '_blank')}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Link (Opens in New Tab)
              </Button>
            )}
            {resourceForm.fileUrl && (resourceForm.fileType === 'audio' || resourceForm.fileType === 'video') && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  File ready to publish: <strong>{resourceForm.fileName}</strong>
                </p>
              </div>
            )}
            <Button 
              onClick={() => handleAddResource(type)}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11"
            >
              {editingResource ? (
                <><Save className="w-4 h-4 mr-2" /> Update {getCategoryLabel(type)}</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" /> Publish {getCategoryLabel(type)}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ResourcesList = ({ type }: { type: ResourceType }) => {
    const resources = loadResources(type);

    return (
      <Card key={refreshKey}>
        <CardHeader>
          <CardTitle>Manage {getCategoryLabel(type)}s</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No {type} uploaded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{resource.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.views || 0} views</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePreviewDownload(resource)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Preview/Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditResource(resource)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteResource(type, resource.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };

  const UploadGuide = () => (
    <Collapsible open={showGuide} onOpenChange={setShowGuide}>
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg">How to Upload Resources</CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`w-4 h-4 transition-transform ${showGuide ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Quick Overview */}
            <div className="bg-white p-4 rounded-lg border border-emerald-100">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-emerald-900">📚 Quick Start Guide</h4>
                <Badge className="bg-emerald-600">4 Simple Steps</Badge>
              </div>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-emerald-600 font-semibold">1.</span> Upload your file to Google Drive, Dropbox, or YouTube</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-semibold">2.</span> Get a shareable link (make sure it's public or "Anyone with link")</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-semibold">3.</span> Fill in the form with title, description, and paste the link</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-semibold">4.</span> Click "Add" to publish the resource</li>
              </ol>
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-800">
                  💡 <strong>First time?</strong> Use the "Load Sample" button on any upload form to see example data, then replace it with your actual information.
                </p>
              </div>
            </div>

            {/* Detailed Instructions by Platform */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Google Drive */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Google Drive (PDFs, Documents)
                </h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Upload file to Google Drive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Right-click → Share → Change to "Anyone with link"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Copy link and paste it in the File URL field</span>
                  </li>
                </ol>
              </div>

              {/* YouTube */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-600" />
                  YouTube (Lecture Videos)
                </h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Upload video to YouTube</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Set visibility to Public or Unlisted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Copy the video URL and paste it here</span>
                  </li>
                </ol>
              </div>

              {/* Dropbox */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-700" />
                  Dropbox (Files & Documents)
                </h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Upload file to Dropbox</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Click Share → Create link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Copy the link and use it in the form</span>
                  </li>
                </ol>
              </div>

              {/* OneDrive */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  OneDrive (Documents)
                </h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Upload to OneDrive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Share → Anyone with link can view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Copy and paste the link here</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Tips and Best Practices */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">💡 Tips & Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Always test your links before publishing to ensure they work correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Use descriptive titles that clearly indicate the content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Include file size information to help students with limited data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>For lectures, you can directly upload small audio/video files (under 50MB)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-gray-900">Resources Management</h2>
          <p className="text-gray-600 mt-1">Upload and manage newsletters, books, lectures, reports, and FAQs</p>
        </div>
      </div>

      {/* Upload Guide */}
      <UploadGuide />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="newsletters">
            <FileText className="w-4 h-4 mr-2" />
            Newsletters
          </TabsTrigger>
          <TabsTrigger value="books">
            <BookOpen className="w-4 h-4 mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="lectures">
            <Video className="w-4 h-4 mr-2" />
            Lectures
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQs
          </TabsTrigger>
        </TabsList>

        {(['newsletters', 'books', 'lectures', 'reports'] as ResourceType[]).map((type) => (
          <TabsContent key={type} value={type} className="space-y-6">
            <ResourceUploadForm type={type} />
            <ResourcesList type={type} />
          </TabsContent>
        ))}

        <TabsContent value="faqs" className="space-y-6">
          <Card className="border-2 border-emerald-100">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                {editingFAQ ? (
                  <><Edit className="w-5 h-5 text-emerald-600" /> Edit FAQ</>
                ) : (
                  <><Plus className="w-5 h-5 text-emerald-600" /> Add New FAQ</>
                )}
              </CardTitle>
              <CardDescription>
                {editingFAQ ? 'Update the FAQ below' : 'Create frequently asked questions to help students'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="faq-category">Category</Label>
                <Select 
                  value={faqForm.category} 
                  onValueChange={(value) => setFaqForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Membership">Membership</SelectItem>
                    <SelectItem value="Programs">Programs</SelectItem>
                    <SelectItem value="Resources">Resources</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="faq-question">Question</Label>
                <Input
                  id="faq-question"
                  placeholder="e.g., How can I become a member of MSSN?"
                  value={faqForm.question}
                  onChange={handleFaqQuestionChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="faq-answer">Answer</Label>
                <Textarea
                  id="faq-answer"
                  placeholder="Provide a detailed answer to the question..."
                  value={faqForm.answer}
                  onChange={handleFaqAnswerChange}
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddFAQ}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {editingFAQ ? (
                    <><Save className="w-4 h-4 mr-2" /> Update FAQ</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Add FAQ</>
                  )}
                </Button>
                {editingFAQ && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditingFAQ(null);
                      setFaqForm({ question: '', answer: '', category: 'Membership' });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card key={refreshKey}>
            <CardHeader>
              <CardTitle>Manage FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              {loadFAQs().length === 0 ? (
                <p className="text-center text-gray-500 py-8">No FAQs added yet</p>
              ) : (
                <div className="space-y-4">
                  {loadFAQs().map((faq) => (
                    <Card key={faq.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{faq.category}</Badge>
                            </div>
                            <p className="font-medium text-gray-900 mb-2">{faq.question}</p>
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFAQ(faq)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this FAQ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteFAQ(faq.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
