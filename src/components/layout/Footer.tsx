import { Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';
import logoImage from 'figma:asset/fbc52c4cf3ddc1eecd0ce430195ad1b2888e1b5e.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-white rounded-full p-6 mb-6 shadow-xl">
            <img 
              src={logoImage} 
              alt="MSSN UNILORIN Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h3 className="text-2xl mb-2">MSSN UNILORIN</h3>
          <p className="text-emerald-400 mb-6">Faith. Knowledge. Service.</p>
          
          {/* Social Media Links */}
          <div className="flex gap-4 mb-8">
            {/* <a 
              href="https://instagram.com/mssnunilorin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a> */}
            <a 
              href="https://twitter.com/mssnunilorin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://facebook.com/mssnunilorin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/2348149650568" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MSSN University of Ilorin. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Building a generation of excellent Muslim leaders.
          </p>
        </div>
      </div>
    </footer>
  );
}
