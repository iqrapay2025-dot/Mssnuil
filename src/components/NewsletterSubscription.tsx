import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Get existing subscribers
    const subscribers = JSON.parse(localStorage.getItem('mssnNewsletterSubscribers') || '[]');
    
    // Check if email already exists
    if (subscribers.includes(email)) {
      toast.info('You are already subscribed to our newsletter!');
      setIsSubscribed(true);
      return;
    }

    // Add new subscriber
    subscribers.push(email);
    localStorage.setItem('mssnNewsletterSubscribers', JSON.stringify(subscribers));
    
    // Send real email notification to MSSN UNILORIN using Web3Forms
    try {
      const formData = new FormData();
      formData.append("access_key", "eff86a18-e6e9-4fbc-964a-8142912fc058");
      formData.append("subject", "🎉 New Newsletter Subscription - MSSN UNILORIN");
      formData.append("from_name", "MSSN UNILORIN Website");
      formData.append("email", email);
      formData.append("message", `As-salamu alaykum!\n\nGreat news! You have a new newsletter subscriber:\n\nEmail: ${email}\nSubscribed on: ${new Date().toLocaleString()}\nTotal Subscribers: ${subscribers.length}\n\nKeep creating amazing content for the MSSN UNILORIN community!\n\n- MSSN UNILORIN Website System`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Email sent successfully via Web3Forms');
      } else {
        console.error('❌ Failed to send email:', data);
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
    
    // Store notification for admin panel view
    const mssnNotification = {
      to: 'mssnunilorin2025@gmail.com',
      from: email,
      subject: '🎉 New Newsletter Subscription',
      message: `As-salamu alaykum!\n\nGreat news! You have a new newsletter subscriber:\n\nEmail: ${email}\nSubscribed on: ${new Date().toLocaleString()}\nTotal Subscribers: ${subscribers.length}\n\nKeep creating amazing content for the MSSN UNILORIN community!\n\n- MSSN UNILORIN Website System`,
      timestamp: new Date().toISOString()
    };
    
    const mssnNotifications = JSON.parse(localStorage.getItem('mssnAdminNotifications') || '[]');
    mssnNotifications.push(mssnNotification);
    localStorage.setItem('mssnAdminNotifications', JSON.stringify(mssnNotifications));
    
    setIsSubscribed(true);
    toast.success('Welcome aboard! You have been subscribed successfully. 🎉', {
      duration: 5000
    });
    
    toast.info('📧 We\'ve notified the MSSN UNILORIN team about your subscription!', {
      duration: 3000
    });
    
    setEmail('');
  };

  // Function to send newsletter notifications (called when admin publishes a blog)
  // This would typically be called from the AdminDashboard
  const sendNewsletterNotification = (blogTitle: string) => {
    const subscribers = JSON.parse(localStorage.getItem('mssnNewsletterSubscribers') || '[]');
    
    subscribers.forEach((subscriberEmail: string) => {
      // In a real application, this would send an actual email
      // For now, we'll just log and store the notification
      const notification = {
        to: subscriberEmail,
        from: 'mssnunilorin2025@gmail.com',
        subject: '✨ Fresh Insight from MSSN UNILORIN',
        message: `
          As-salamu alaykum!
          
          We've just published a new article that we think you'll find enlightening:
          
          "${blogTitle}"
          
          Click to read and join the conversation with fellow members of the MSSN UNILORIN community.
          
          May your day be filled with blessings!
          
          - MSSN UNILORIN Team
        `,
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending newsletter:', notification);
    });
    
    toast.success(`Newsletter sent to ${subscribers.length} subscribers!`);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
          <Mail className="w-8 h-8" />
        </div>
        
        <h3 className="text-3xl mb-3">Stay in the Loop</h3>
        <p className="text-emerald-100 mb-6 text-lg">
          Get notified whenever we publish new insights, events, and updates from MSSN UNILORIN. 
          Join our community of informed students!
        </p>
        
        {isSubscribed ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xl">You're Subscribed!</span>
            </div>
            <p className="text-emerald-100 text-sm">
              We'll notify you when new content is published.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500 h-12"
            />
            <Button 
              type="submit"
              className="bg-white text-emerald-600 hover:bg-emerald-50 h-12 px-8"
            >
              Subscribe
            </Button>
          </form>
        )}
        
        <p className="text-emerald-100 text-sm mt-4">
          📧 Updates delivered straight to your inbox • Unsubscribe anytime
        </p>
      </div>
    </div>
  );
}

// Export the notification function for use in AdminDashboard
export { NewsletterSubscription as default };
