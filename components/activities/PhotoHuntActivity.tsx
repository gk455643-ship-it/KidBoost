import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Send, Check, Loader2 } from 'lucide-react';
import { uploadPhoto } from '../../lib/supabase';
import { useStore } from '../../store';
import { ParentGate } from '../ParentGate';
import { playSound } from '../../lib/sounds';

interface PhotoHuntActivityProps {
  config: { target: string; icon: string };
  onComplete: (success: boolean) => void;
}

export const PhotoHuntActivity: React.FC<PhotoHuntActivityProps> = ({ config, onComplete }) => {
  const currentChild = useStore(state => state.currentChild);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showParentGate, setShowParentGate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Start Camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
      try {
          const s = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'environment' } 
          });
          setStream(s);
          if (videoRef.current) {
              videoRef.current.srcObject = s;
          }
      } catch (err) {
          setError("Need camera permission!");
          console.error(err);
      }
  };

  const stopCamera = () => {
      if (stream) {
          stream.getTracks().forEach(t => t.stop());
          setStream(null);
      }
  };

  const triggerCapture = () => {
      setCountdown(3);
  };

  useEffect(() => {
      if (countdown === null) return;
      
      if (countdown > 0) {
          playSound('pop');
          const timer = setTimeout(() => setCountdown(c => c! - 1), 1000);
          return () => clearTimeout(timer);
      } else {
          takePhoto();
          setCountdown(null);
      }
  }, [countdown]);

  const takePhoto = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(dataUrl);
          playSound('click'); // Camera shutter sound substitute
      }
  };

  const retake = () => {
      setCapturedImage(null);
      startCamera(); // Ensure stream is active
  };

  const handleSend = () => {
      // Open Parent Gate to "Verify" the photo before upload
      setShowParentGate(true);
  };

  const onGateSuccess = async () => {
      setShowParentGate(false);
      if (!capturedImage || !currentChild) return;

      setUploading(true);
      try {
          // Convert DataURL to Blob
          const res = await fetch(capturedImage);
          const blob = await res.blob();
          
          await uploadPhoto(currentChild.id, blob);
          playSound('success');
          onComplete(true);
      } catch (err) {
          console.error("Upload failed", err);
          setError("Upload failed. Try again.");
          setUploading(false);
      }
  };

  if (error) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Camera Error</h2>
              <p className="text-slate-500 mb-8">{error}</p>
              <button onClick={() => onComplete(true)} className="px-6 py-3 bg-slate-200 rounded-xl font-bold text-slate-600">Skip Activity</button>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-black relative">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 bg-gradient-to-b from-black/80 to-transparent text-white pointer-events-none">
            <div className="flex flex-col items-center">
                <div className="text-4xl mb-2 drop-shadow-lg">{config.icon}</div>
                <h2 className="text-2xl font-black shadow-black drop-shadow-md text-center">Find: {config.target}</h2>
            </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
            {!capturedImage ? (
                <>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Viewfinder Overlay */}
                    <div className="absolute inset-0 border-[32px] border-black/30 pointer-events-none">
                        <div className="w-full h-full border-2 border-white/50 relative">
                             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                        </div>
                    </div>
                </>
            ) : (
                <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-contain bg-black" />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Countdown Overlay */}
            {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-sm">
                    <div className="text-9xl font-black text-white animate-ping">{countdown}</div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="bg-white p-6 pb-10 rounded-t-[2rem] flex justify-center items-center gap-12 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            {!capturedImage ? (
                <button 
                    onClick={triggerCapture}
                    className="w-24 h-24 rounded-full bg-white border-8 border-slate-100 shadow-xl flex items-center justify-center active:scale-95 transition-transform relative group"
                >
                    <div className="w-16 h-16 bg-red-500 rounded-full group-hover:scale-105 transition-transform" />
                    <Camera className="absolute text-white/50 w-8 h-8" />
                </button>
            ) : (
                <>
                    <button 
                        onClick={retake}
                        disabled={uploading}
                        className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold uppercase">Retake</span>
                    </button>
                    
                    <button 
                        onClick={handleSend}
                        disabled={uploading}
                        className="flex flex-col items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors"
                    >
                         <div className="w-20 h-20 rounded-full bg-green-500 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform">
                            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Check className="w-10 h-10" />}
                        </div>
                        <span className="text-xs font-bold uppercase">Keep It</span>
                    </button>
                </>
            )}
        </div>

        {showParentGate && (
            <ParentGate onUnlock={onGateSuccess} onCancel={() => setShowParentGate(false)} />
        )}
    </div>
  );
};