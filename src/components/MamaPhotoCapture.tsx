
import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getMamaById } from '@/data/mamas';
import { mamaPhotoAnalysisService } from '@/services/mamaPhotoAnalysisService';
import { PhotoApprovalModal } from './PhotoApprovalModal';

interface MamaPhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  currentStep: number;
  mamaId: string;
  recipeName: string;
}

export const MamaPhotoCapture = ({ 
  isOpen, 
  onClose, 
  recipeId, 
  currentStep, 
  mamaId, 
  recipeName 
}: MamaPhotoCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mama = getMamaById(parseInt(mamaId)) || getMamaById(1);

  React.useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitPhoto = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    
    try {
      const analysisResult = await mamaPhotoAnalysisService.analyzePhoto({
        imageBase64: capturedImage,
        recipeId,
        currentStep,
        mamaId: mama.voiceId,
        recipeName
      });

      setAnalysisResult(analysisResult);
      setShowApprovalModal(true);
    } catch (error) {
      console.error('Error analyzing photo:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprovalClose = () => {
    setShowApprovalModal(false);
    setAnalysisResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-background">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{mama?.emoji}</div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">
                    Show {mama?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep} • {recipeName}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* Camera/Photo Area */}
            <div className="relative aspect-square bg-gray-100">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured cooking progress"
                  className="w-full h-full object-cover"
                />
              ) : hasCamera ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Camera not available</p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Camera overlay */}
              {!capturedImage && hasCamera && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-lg" />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    {mama?.name} wants to see your progress!
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4">
              {capturedImage ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={submitPhoto}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Sparkles size={16} className="mr-2" />
                        Get {mama?.name}'s Approval
                      </>
                    )}
                  </Button>
                </div>
              ) : hasCamera ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    Choose Photo
                  </Button>
                  <Button
                    onClick={capturePhoto}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Camera size={16} className="mr-2" />
                    Capture
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Camera size={16} className="mr-2" />
                  Choose Photo
                </Button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photo Approval Modal */}
      {showApprovalModal && analysisResult && (
        <PhotoApprovalModal
          isOpen={showApprovalModal}
          onClose={handleApprovalClose}
          analysisResult={analysisResult}
          mama={mama}
          photo={capturedImage}
        />
      )}
    </>
  );
};
