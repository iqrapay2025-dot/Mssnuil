import { motion } from 'motion/react';
import { Download, FileText, BookOpen, Video, FileQuestion } from 'lucide-react';
import { Button } from './ui/button';

interface QuickLink {
  icon: any;
  title: string;
  description: string;
  action: string;
  resourceType?: string;
}

const quickLinks: QuickLink[] = [
  {
    icon: Download,
    title: "MSSN Constitution",
    description: "Download the official MSSN constitution and bylaws",
    action: "Download PDF",
    resourceType: "newsletters"
  },
  {
    icon: FileText,
    title: "Newsletter Archive",
    description: "Access past editions of our monthly newsletters",
    action: "View Archive",
    resourceType: "newsletters"
  },
  {
    icon: BookOpen,
    title: "Islamic Resources",
    description: "Study materials, lecture notes, and Islamic books",
    action: "Browse Library",
    resourceType: "books"
  },
  {
    icon: Video,
    title: "Lecture Recordings",
    description: "Watch recorded Da'wah sessions and seminars",
    action: "Watch Videos",
    resourceType: "lectures"
  },
  {
    icon: FileQuestion,
    title: "FAQs",
    description: "Frequently asked questions about MSSN membership",
    action: "Read FAQs",
    resourceType: "faqs"
  },
  {
    icon: FileText,
    title: "Activity Reports",
    description: "Annual and quarterly activity reports",
    action: "View Reports",
    resourceType: "reports"
  }
];

interface QuickLinksProps {
  onNavigateToResources?: () => void;
}

export function QuickLinks({ onNavigateToResources }: QuickLinksProps) {
  const handleLinkClick = (resourceType?: string) => {
    if (onNavigateToResources) {
      // Store the selected resource type in sessionStorage for the Resources page to pick up
      if (resourceType) {
        sessionStorage.setItem('selectedResourceType', resourceType);
      }
      onNavigateToResources();
    }
  };
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Resources</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Quick Links</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <link.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">{link.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{link.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => handleLinkClick(link.resourceType)}
              >
                {link.action}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
