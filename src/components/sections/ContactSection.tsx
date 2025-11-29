import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { NewsletterSubscription } from '../NewsletterSubscription';
import { MapPin, Mail, Phone, Globe, Send } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const contactInfo = [
    { icon: MapPin, title: "Address", content: ["MSSN University of Ilorin", "Permanent Site, University of Ilorin", "Kwara State, Nigeria"] },
    { icon: Mail, title: "Email", content: ["mssnunilorin2025@gmail.com"] },
    { icon: Phone, title: "Phone", content: ["+2348149650568"] },
    { icon: Globe, title: "Website", content: ["www.mssnunilorin.org"] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Contact Us</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl text-gray-900 mb-4">{item.title}</h3>
              <div className="space-y-1">
                {item.content.map((line, i) => (
                  <p key={i} className="text-gray-600">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl text-gray-900 mb-8">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Send className="mr-2 w-5 h-5" />
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <NewsletterSubscription />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
