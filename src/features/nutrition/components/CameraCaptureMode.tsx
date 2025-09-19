// src/features/nutrition/components/CameraCaptureMode.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface CameraCaptureModeProps {
  isCapturing: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
  onError: (error: { message: string; type: string }) => void;
}

export const CameraCaptureMode: React.FC<CameraCaptureModeProps> = ({
  isCapturing,
  onCapture,
  onCancel,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Détection mobile pour utiliser la caméra arrière
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Démarrer la caméra quand le mode est activé
  useEffect(() => {
    if (isCapturing) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? 'environment' : 'user', // Caméra arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
      onError({
        message: 'Impossible d\'accéder à la caméra',
        type: 'camera'
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Définir les dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image du video sur le canvas
    context.drawImage(video, 0, 0);

    // Convertir en blob et déclencher le callback
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.8);
  };

  if (!isCapturing) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full rounded-lg bg-gray-100"
          autoPlay
          muted
          playsInline
          style={{ maxHeight: '400px' }}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay pour aide visuelle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-white rounded-lg w-48 h-48 opacity-50" />
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button onClick={capturePhoto} size="lg" className="px-8">
          <Camera className="w-5 h-5 mr-2" />
          Capturer
        </Button>
        <Button onClick={onCancel} variant="outline" size="lg">
          <X className="w-5 h-5 mr-2" />
          Annuler
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Centrez l'aliment dans le cadre et appuyez sur Capturer</p>
      </div>
    </div>
  );
};

export default CameraCaptureMode;