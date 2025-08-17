import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, FileText, CheckCircle, AlertCircle, RotateCw, Zap, Smartphone, Eye, Download, Share2, Edit, Trash2 } from 'lucide-react';

const MobileCVScanner = ({ onCVProcessed, onClose }) => {
  const [scanMode, setScanMode] = useState('choose'); // choose, camera, upload, processing, result
  const [scannedPages, setScannedPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    detectDeviceCapabilities();
    return () => {
      stopCamera();
    };
  }, []);

  const detectDeviceCapabilities = async () => {
    const capabilities = {
      hasCamera: false,
      hasMultipleCamera: false,
      supportsFileAPI: !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio || 1
      },
      isLowEnd: false,
      connectionSpeed: 'unknown'
    };

    // Detect camera capabilities
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      capabilities.hasCamera = videoDevices.length > 0;
      capabilities.hasMultipleCamera = videoDevices.length > 1;
    } catch (err) {
      console.log('Camera detection failed:', err);
    }

    // Detect if it's a low-end device (common in SA market)
    const memory = navigator.deviceMemory || 2; // Default to 2GB if unknown
    const cores = navigator.hardwareConcurrency || 4;
    capabilities.isLowEnd = memory <= 2 || cores <= 2;

    // Detect connection speed
    if ('connection' in navigator) {
      capabilities.connectionSpeed = navigator.connection.effectiveType || 'unknown';
    }

    setDeviceCapabilities(capabilities);
  };

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode: 'environment', // Back camera preferred for document scanning
          width: { ideal: deviceCapabilities?.isLowEnd ? 1280 : 1920 },
          height: { ideal: deviceCapabilities?.isLowEnd ? 720 : 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanMode('camera');
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions or use file upload instead.');
      setScanMode('choose');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size based on video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob and add to scanned pages
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setScannedPages(prev => [...prev, {
        id: Date.now(),
        imageUrl,
        blob,
        timestamp: new Date().toISOString()
      }]);
    }, 'image/jpeg', deviceCapabilities?.isLowEnd ? 0.8 : 0.9);
  }, [deviceCapabilities]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setScannedPages(prev => [...prev, {
            id: Date.now() + index,
            imageUrl: e.target.result,
            file,
            timestamp: new Date().toISOString(),
            type: file.type
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const processCV = async () => {
    if (scannedPages.length === 0) return;

    setIsProcessing(true);
    setScanMode('processing');
    
    try {
      // Simulate CV processing (replace with actual OCR/AI service)
      const formData = new FormData();
      
      scannedPages.forEach((page, index) => {
        if (page.blob) {
          formData.append(`page_${index}`, page.blob, `cv_page_${index}.jpg`);
        } else if (page.file) {
          formData.append(`page_${index}`, page.file);
        }
      });

      // Mock processing delay based on device capabilities
      const processingDelay = deviceCapabilities?.isLowEnd ? 5000 : 3000;
      await new Promise(resolve => setTimeout(resolve, processingDelay));

      // Mock extracted data (replace with actual AI response)
      const mockExtractedData = {
        personal: {
          name: 'Thabo Mthembu',
          email: 'thabo.mthembu@example.com',
          phone: '+27 82 123 4567',
          address: 'Cape Town, South Africa',
          linkedIn: 'linkedin.com/in/thabo-mthembu'
        },
        summary: 'Experienced React Developer with 5+ years in building scalable web applications. Passionate about clean code and user experience.',
        experience: [
          {
            title: 'Senior React Developer',
            company: 'TechFlow SA',
            duration: '2022 - Present',
            description: 'Led frontend development for fintech applications, mentored junior developers, improved app performance by 40%.'
          },
          {
            title: 'Full Stack Developer',
            company: 'Innovation Labs',
            duration: '2020 - 2022',
            description: 'Built scalable web applications using React and Node.js, collaborated with cross-functional teams.'
          }
        ],
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Git'],
        education: [
          {
            degree: 'BSc Computer Science',
            institution: 'University of Cape Town',
            year: '2020',
            honors: 'Cum Laude'
          }
        ],
        confidence: 0.92,
        suggestions: [
          'Consider adding more quantifiable achievements',
          'Include relevant certifications',
          'Add portfolio links or GitHub projects'
        ]
      };

      setExtractedData(mockExtractedData);
      setScanMode('result');
      
      if (onCVProcessed) {
        onCVProcessed(mockExtractedData);
      }
    } catch (error) {
      setError('Failed to process CV. Please try again or upload a clearer image.');
      setScanMode('choose');
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePage = (pageId) => {
    setScannedPages(prev => prev.filter(page => page.id !== pageId));
  };

  const ChooseMode = () => (
    <div className="space-y-4">
      <div className="text-center">
        <FileText className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Your CV</h3>
        <p className="text-gray-600 text-sm">
          Upload your CV or take photos with your camera for instant analysis
        </p>
      </div>

      <div className="space-y-3">
        {deviceCapabilities?.hasCamera && (
          <button
            onClick={startCamera}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center text-lg font-medium"
          >
            <Camera className="h-6 w-6 mr-3" />
            Scan with Camera
          </button>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-all flex items-center justify-center text-lg font-medium"
        >
          <Upload className="h-6 w-6 mr-3" />
          Upload from Device
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Device Optimization Info */}
      {deviceCapabilities && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-800 text-sm">
            <Smartphone className="h-4 w-4 mr-2" />
            <span>
              Optimized for your device • {deviceCapabilities.screenSize.width}×{deviceCapabilities.screenSize.height}
              {deviceCapabilities.isLowEnd && ' • Battery saving mode'}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const CameraMode = () => (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full rounded-lg bg-black"
          style={{ maxHeight: '60vh' }}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera overlay guide */}
        <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg pointer-events-none">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            Align CV within frame
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={captureImage}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          <Camera className="h-8 w-8" />
        </button>
        <button
          onClick={() => {
            stopCamera();
            setScanMode('choose');
          }}
          className="bg-gray-600 text-white p-4 rounded-full hover:bg-gray-700 transition-all"
        >
          <RotateCw className="h-8 w-8" />
        </button>
      </div>

      {scannedPages.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Captured Pages ({scannedPages.length})</h4>
          <div className="grid grid-cols-3 gap-2">
            {scannedPages.map((page) => (
              <div key={page.id} className="relative">
                <img
                  src={page.imageUrl}
                  alt="Scanned page"
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => retakePage(page.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={processCV}
            className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center"
          >
            <Zap className="h-5 w-5 mr-2" />
            Process CV ({scannedPages.length} page{scannedPages.length !== 1 ? 's' : ''})
          </button>
        </div>
      )}
    </div>
  );

  const ProcessingMode = () => (
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <Zap className="h-12 w-12 text-white animate-bounce" />
        </div>
        <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-cyan-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900">Processing Your CV</h3>
      <p className="text-gray-600">
        Our AI is extracting and analyzing your information...
        <br />
        <span className="text-sm text-gray-500">
          {deviceCapabilities?.isLowEnd ? 'This may take a few moments on your device' : 'Almost done!'}
        </span>
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  );

  const ResultMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">CV Successfully Processed!</h3>
        <p className="text-gray-600 text-sm">
          Confidence Score: {Math.round((extractedData?.confidence || 0.92) * 100)}%
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900">Extracted Information</h4>
        </div>
        
        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {/* Personal Info */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Personal Details</h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><strong>Name:</strong> {extractedData?.personal?.name}</div>
              <div><strong>Email:</strong> {extractedData?.personal?.email}</div>
              <div><strong>Phone:</strong> {extractedData?.personal?.phone}</div>
              <div><strong>Location:</strong> {extractedData?.personal?.address}</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
            <div className="flex flex-wrap gap-1">
              {extractedData?.skills?.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Experience</h5>
            {extractedData?.experience?.slice(0, 2).map((exp, index) => (
              <div key={index} className="mb-2 text-sm">
                <div className="font-medium">{exp.title}</div>
                <div className="text-gray-600">{exp.company} • {exp.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {extractedData?.suggestions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            AI Suggestions
          </h5>
          <ul className="text-sm text-yellow-800 space-y-1">
            {extractedData.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => {
            setScannedPages([]);
            setExtractedData(null);
            setScanMode('choose');
          }}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all text-center"
        >
          Scan Another
        </button>
        <button
          onClick={() => onClose?.()}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-center"
        >
          Use This CV
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">CV Scanner</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Main Content */}
          {scanMode === 'choose' && <ChooseMode />}
          {scanMode === 'camera' && <CameraMode />}
          {scanMode === 'processing' && <ProcessingMode />}
          {scanMode === 'result' && <ResultMode />}
        </div>
      </div>
    </div>
  );
};

export default MobileCVScanner;
