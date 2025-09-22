// src/features/landing/components/hero/HeroVideo.tsx
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroVideoProps {
  videoSrc: string;
  thumbnailSrc?: string;
  title: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoSrc,
  thumbnailSrc,
  title,
  autoPlay = false,
  showControls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowVideo(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl">
      {!showVideo && thumbnailSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
          <img
            src={thumbnailSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              size="lg"
              className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white border-2 border-white rounded-full p-6"
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {(showVideo || !thumbnailSrc) && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay={autoPlay}
            muted={isMuted}
            loop
            onEnded={handleVideoEnd}
            poster={thumbnailSrc}
          >
            <source src={videoSrc} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>

          {showControls && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  onClick={togglePlay}
                  size="sm"
                  className="bg-black bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70 text-white rounded-full p-2"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  onClick={toggleMute}
                  size="sm"
                  className="bg-black bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70 text-white rounded-full p-2"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="text-white text-sm bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full">
                {title}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};