import logoImage from 'figma:asset/fbc52c4cf3ddc1eecd0ce430195ad1b2888e1b5e.png';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Logo in White Circle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-8 shadow-2xl animate-pulse">
              <img 
                src={logoImage} 
                alt="MSSN UNILORIN Logo" 
                className="h-32 w-32 object-contain"
              />
            </div>
          </div>
          
          {/* Loading Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading Text */}
          <p className="text-white text-xl mb-2">Loading MSSN UNILORIN</p>
          <p className="text-emerald-200">Faith. Knowledge. Service.</p>
        </div>
      </div>
    </div>
  );
}
