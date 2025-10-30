import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const handleShare = (platform: string, shareLink: string) => {
    window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=400');
    toast.success(`Sharing on ${platform}!`);
  };

  const copyToClipboard = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('✓ Link copied to clipboard!', {
          description: 'Share this link with anyone'
        });
      } else {
        // Fallback method for browsers without Clipboard API support
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success('✓ Link copied to clipboard!', {
              description: 'Share this link with anyone'
            });
          } else {
            // If execCommand also fails, show the URL for manual copy
            toast.info('Please copy this link:', { 
              description: url, 
              duration: 10000 
            });
          }
        } catch (err) {
          // Show the URL for manual copy
          toast.info('Please copy this link:', { 
            description: url, 
            duration: 10000 
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      // Final fallback - show the link for manual copy
      toast.info('Please copy this link:', { 
        description: url, 
        duration: 10000 
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gray-700 flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={() => handleShare('Facebook', `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-sky-600 text-sky-600 hover:bg-sky-50"
        onClick={() => handleShare('Twitter', `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`)}
      >
        <Twitter className="w-4 h-4 mr-2" />
        X (Twitter)
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-blue-700 text-blue-700 hover:bg-blue-50"
        onClick={() => handleShare('LinkedIn', `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`)}
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-green-600 text-green-600 hover:bg-green-50"
        onClick={() => handleShare('WhatsApp', `https://wa.me/?text=${shareTitle}%20${shareUrl}`)}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-gray-600 text-gray-600 hover:bg-gray-50"
        onClick={copyToClipboard}
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
}
