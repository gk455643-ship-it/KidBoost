import React from 'react';

interface TeacherAvatarProps {
  emotion?: 'happy' | 'waiting' | 'excited' | 'wrong';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ 
  emotion = 'happy', 
  size = 'md',
  className = ''
}) => {
  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  }[size];

  // Simple SVG construction for the face
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className={`${sizeClass} rounded-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden transition-transform duration-300`}>
        {/* Face Container */}
        <div className={`w-full h-full relative ${emotion === 'excited' ? 'animate-bounce-slow' : ''}`}>
          
          {/* Eyes */}
          <div className="absolute top-[35%] left-[25%] w-[15%] h-[15%] bg-black rounded-full transition-all duration-300"
               style={{ height: emotion === 'happy' || emotion === 'excited' ? '15%' : '5%' }}></div>
          <div className="absolute top-[35%] right-[25%] w-[15%] h-[15%] bg-black rounded-full transition-all duration-300"
               style={{ height: emotion === 'happy' || emotion === 'excited' ? '15%' : '5%' }}></div>

          {/* Mouth */}
          <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[40%] h-[10%] bg-transparent border-b-4 border-black rounded-full transition-all duration-300"
               style={{ 
                 borderRadius: emotion === 'wrong' ? '50% 50% 0 0' : '0 0 50% 50%',
                 borderBottomWidth: emotion === 'wrong' ? '0' : '4px',
                 borderTopWidth: emotion === 'wrong' ? '4px' : '0',
                 height: emotion === 'excited' ? '20%' : '10%'
               }}></div>
               
          {/* Cheeks */}
          <div className="absolute top-[45%] left-[15%] w-[10%] h-[10%] bg-pink-300 rounded-full opacity-50"></div>
          <div className="absolute top-[45%] right-[15%] w-[10%] h-[10%] bg-pink-300 rounded-full opacity-50"></div>
        </div>
      </div>
      
      {/* Speech Bubble (Optional Context) */}
      {emotion === 'wrong' && (
        <div className="absolute -top-4 -right-8 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-red-200 animate-pulse">
          Try Again!
        </div>
      )}
       {emotion === 'excited' && (
        <div className="absolute -top-4 -right-8 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-green-200 animate-bounce">
          Great!
        </div>
      )}
    </div>
  );
};
