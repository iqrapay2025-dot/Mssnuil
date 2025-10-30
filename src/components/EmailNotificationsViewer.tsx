import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Trash2, RefreshCw, Clock, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EmailNotification {
  to: string;
  from: string;
  subject: string;
  message: string;
  timestamp: string;
}

export function EmailNotificationsViewer() {
  const [subscriberEmails, setSubscriberEmails] = useState<EmailNotification[]>([]);
  const [adminEmails, setAdminEmails] = useState<EmailNotification[]>([]);

  const loadEmails = () => {
    const subscriber = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    const admin = JSON.parse(localStorage.getItem('mssnAdminNotifications') || '[]');
    setSubscriberEmails(subscriber);
    setAdminEmails(admin);
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const clearSubscriberEmails = () => {
    if (confirm('Are you sure you want to clear all subscriber email logs?')) {
      localStorage.removeItem('emailNotifications');
      setSubscriberEmails([]);
      toast.success('Subscriber email logs cleared!');
    }
  };

  const clearAdminEmails = () => {
    if (confirm('Are you sure you want to clear all admin email logs?')) {
      localStorage.removeItem('mssnAdminNotifications');
      setAdminEmails([]);
      toast.success('Admin email logs cleared!');
    }
  };

  const EmailCard = ({ email }: { email: EmailNotification }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg">{email.subject}</CardTitle>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span><strong>To:</strong> {email.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span><strong>From:</strong> {email.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(email.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="flex-shrink-0">
            Simulated
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {email.message}
          </pre>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2">📧 Email Notifications Log</h2>
            <p className="text-emerald-100">
              View all simulated email notifications sent by the system. 
              <br />
              <em className="text-sm">Note: These are simulated emails for demonstration purposes. In production, these would be actual emails.</em>
            </p>
          </div>
          <Button
            onClick={loadEmails}
            variant="outline"
            className="border-white text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="subscribers" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white py-3">
            <FileText className="w-4 h-4 mr-2" />
            Subscriber Emails ({subscriberEmails.length})
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white py-3">
            <User className="w-4 h-4 mr-2" />
            Admin Notifications ({adminEmails.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Emails sent to newsletter subscribers when blog posts are published
            </p>
            {subscriberEmails.length > 0 && (
              <Button
                onClick={clearSubscriberEmails}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {subscriberEmails.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No subscriber emails sent yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Emails will appear here when blog posts are published to subscribers
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {subscriberEmails.map((email, index) => (
                <EmailCard key={index} email={email} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              System notifications sent to mssnunilorin2025@gmail.com
            </p>
            {adminEmails.length > 0 && (
              <Button
                onClick={clearAdminEmails}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {adminEmails.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No admin notifications yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Notifications will appear here when subscribers join or posts are published
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {adminEmails.map((email, index) => (
                <EmailCard key={index} email={email} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="text-blue-900 mb-2">About Email Simulation</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                This is a <strong>demonstration system</strong> that simulates email notifications. 
                In a production environment with a proper backend, these would be actual emails sent via services like 
                SendGrid, AWS SES, or similar email providers. For now, all "emails" are logged here for your review.
              </p>
              <p className="text-blue-800 text-sm mt-2">
                <strong>To implement real emails:</strong> You would need to integrate an email service API and configure 
                SMTP settings with proper authentication.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
