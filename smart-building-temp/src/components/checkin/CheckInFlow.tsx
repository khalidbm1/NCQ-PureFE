'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Wifi,
  Car,
  Coffee,
  Phone,
  Upload,
  Camera,
  Smartphone,
  QrCode,
  Shield,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface CheckInFlowProps {
  reservationId: string;
  onComplete?: (roomData: any) => void;
}

interface CheckInStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  optional?: boolean;
}

export function CheckInFlow({ reservationId, onComplete }: CheckInFlowProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkInMutation = useMutation({
    mutationFn: (data: any) => apiClient.checkIn(data),
    onSuccess: (result) => {
      onComplete?.(result.data);
    }
  });

  const steps: CheckInStep[] = [
    {
      id: 'reservation-verification',
      title: 'Verify Reservation',
      description: 'Confirm your booking details',
      component: ReservationVerification
    },
    {
      id: 'identity-verification',
      title: 'Identity Verification',
      description: 'Verify your identity for security',
      component: IdentityVerification
    },
    {
      id: 'preferences',
      title: 'Room Preferences',
      description: 'Customize your stay experience',
      component: RoomPreferences,
      optional: true
    },
    {
      id: 'digital-key',
      title: 'Digital Room Key',
      description: 'Set up mobile room access',
      component: DigitalKeySetup
    },
    {
      id: 'services',
      title: 'Hotel Services',
      description: 'Explore available amenities',
      component: ServiceSelection,
      optional: true
    },
    {
      id: 'completion',
      title: 'Welcome!',
      description: 'Check-in complete',
      component: CheckInComplete
    }
  ];

  const handleStepComplete = (stepData: any) => {
    setCheckInData((prev: any) => ({ ...prev, ...stepData }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - process check-in
      checkInMutation.mutate({ ...checkInData, ...stepData });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Digital Check-In</h1>
            <Badge variant="outline" className="px-3 py-1">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
            {steps[currentStep].optional && (
              <Badge variant="secondary" className="mt-2">
                Optional
              </Badge>
            )}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <CurrentStepComponent
              data={checkInData}
              onComplete={handleStepComplete}
              onPrevious={currentStep > 0 ? handlePrevious : undefined}
              isLoading={isLoading}
            />
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Takes 2-3 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function ReservationVerification({ data, onComplete, onPrevious }: any) {
  const [reservation, setReservation] = useState({
    confirmationNumber: 'HTL-2024-001',
    guestName: 'John Doe',
    checkInDate: '2024-01-23',
    checkOutDate: '2024-01-25',
    roomType: 'Deluxe Ocean View',
    guests: 2,
    rate: 450.00
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Your Reservation
        </h3>
        <p className="text-gray-600">
          Please verify your booking information below
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Guest Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{reservation.guestName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{reservation.confirmationNumber}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Stay Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {reservation.checkInDate} - {reservation.checkOutDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{reservation.roomType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Rate (2 nights)</span>
            <span className="text-xl font-semibold text-gray-900">
              ${reservation.rate * 2}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button 
          onClick={() => onComplete({ reservationVerified: true, reservation })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Confirm & Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function IdentityVerification({ data, onComplete, onPrevious }: any) {
  const [verificationType, setVerificationType] = useState<'id' | 'passport'>('id');
  const [idUploaded, setIdUploaded] = useState(false);

  const handleFileUpload = () => {
    // Simulate file upload
    setTimeout(() => setIdUploaded(true), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verify Your Identity
        </h3>
        <p className="text-gray-600">
          Upload a photo of your ID for security verification
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setVerificationType('id')}
          className={`p-4 border-2 rounded-lg transition-colors ${
            verificationType === 'id' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <p className="font-medium text-gray-900">National ID</p>
        </button>
        <button
          onClick={() => setVerificationType('passport')}
          className={`p-4 border-2 rounded-lg transition-colors ${
            verificationType === 'passport' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <User className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <p className="font-medium text-gray-900">Passport</p>
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {!idUploaded ? (
          <div>
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Upload {verificationType === 'id' ? 'National ID' : 'Passport'}
            </h4>
            <p className="text-gray-600 mb-4">
              Take a clear photo or upload an existing image
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleFileUpload}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFileUpload}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload File</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-green-600">
            <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">ID Verified Successfully</h4>
            <p className="text-gray-600">Your identity has been confirmed</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={() => onComplete({ identityVerified: true, idType: verificationType })}
          disabled={!idUploaded}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function RoomPreferences({ data, onComplete, onPrevious }: any) {
  const [preferences, setPreferences] = useState({
    temperature: 22,
    lighting: 'medium',
    pillowType: 'medium',
    wakeUpCall: false,
    newspaper: false,
    roomService: false
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize Your Stay
        </h3>
        <p className="text-gray-600">
          Set your room preferences for a personalized experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Room Settings</h4>
          
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Temperature: {preferences.temperature}°C
            </label>
            <input
              type="range"
              min="18"
              max="28"
              value={preferences.temperature}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                temperature: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Lighting</label>
            <select
              value={preferences.lighting}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                lighting: e.target.value
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="dim">Dim</option>
              <option value="medium">Medium</option>
              <option value="bright">Bright</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Pillow Type</label>
            <select
              value={preferences.pillowType}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                pillowType: e.target.value
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="soft">Soft</option>
              <option value="medium">Medium</option>
              <option value="firm">Firm</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Services</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.wakeUpCall}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  wakeUpCall: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Wake-up call service</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.newspaper}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  newspaper: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Daily newspaper</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.roomService}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  roomService: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Room service menu</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onComplete({ preferences: null })}
          >
            Skip
          </Button>
          <Button 
            onClick={() => onComplete({ preferences })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Preferences
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DigitalKeySetup({ data, onComplete, onPrevious }: any) {
  const [keySetup, setKeySetup] = useState(false);

  const handleSetupKey = () => {
    // Simulate digital key setup
    setTimeout(() => setKeySetup(true), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Digital Room Key
        </h3>
        <p className="text-gray-600">
          Set up contactless room access on your mobile device
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <Smartphone className="h-16 w-16 mx-auto mb-4 text-blue-600" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          Mobile Room Access
        </h4>
        <p className="text-gray-600 mb-6">
          Your smartphone will become your room key. Just tap your phone near the door lock to enter.
        </p>

        {!keySetup ? (
          <Button 
            onClick={handleSetupKey}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Setup Digital Key
          </Button>
        ) : (
          <div className="text-green-600">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Digital key activated!</p>
            <p className="text-sm text-gray-600 mt-2">
              Room 1205 - Access granted
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <Shield className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <h5 className="font-medium text-gray-900">Secure</h5>
          <p className="text-sm text-gray-600">Encrypted access technology</p>
        </div>
        <div className="p-4">
          <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <h5 className="font-medium text-gray-900">Convenient</h5>
          <p className="text-sm text-gray-600">No physical key needed</p>
        </div>
        <div className="p-4">
          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <h5 className="font-medium text-gray-900">24/7 Access</h5>
          <p className="text-sm text-gray-600">Works anytime during your stay</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={() => onComplete({ digitalKey: keySetup })}
          disabled={!keySetup}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ServiceSelection({ data, onComplete, onPrevious }: any) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services = [
    { id: 'wifi', name: 'Premium WiFi', icon: Wifi, price: 'Free' },
    { id: 'parking', name: 'Valet Parking', icon: Car, price: '$25/day' },
    { id: 'breakfast', name: 'Continental Breakfast', icon: Coffee, price: '$35/person' },
    { id: 'spa', name: 'Spa Access', icon: Phone, price: '$50/day' }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Hotel Services
        </h3>
        <p className="text-gray-600">
          Add services to enhance your stay
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.price}</p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onComplete({ services: [] })}
          >
            Skip
          </Button>
          <Button 
            onClick={() => onComplete({ services: selectedServices })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckInComplete({ data, onComplete }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Paradise Resort!
        </h3>
        <p className="text-gray-600">
          Your check-in is complete. Enjoy your stay!
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Your Stay Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Room:</span>
            <span className="ml-2 font-medium">1205 - Deluxe Ocean View</span>
          </div>
          <div>
            <span className="text-gray-600">Floor:</span>
            <span className="ml-2 font-medium">12th Floor</span>
          </div>
          <div>
            <span className="text-gray-600">WiFi:</span>
            <span className="ml-2 font-medium">Resort_Guest / welcome123</span>
          </div>
          <div>
            <span className="text-gray-600">Checkout:</span>
            <span className="ml-2 font-medium">Jan 25, 11:00 AM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium text-gray-900">Digital Key</p>
          <p className="text-xs text-gray-600">Ready to use</p>
        </div>
        <div className="p-4">
          <Wifi className="h-8 w-8 mx-auto mb-2 text-green-600" />
          <p className="text-sm font-medium text-gray-900">WiFi Access</p>
          <p className="text-xs text-gray-600">Connected</p>
        </div>
        <div className="p-4">
          <Phone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <p className="text-sm font-medium text-gray-900">Concierge</p>
          <p className="text-xs text-gray-600">Dial 0</p>
        </div>
      </div>

      <Button 
        onClick={() => onComplete(data)}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        Go to My Room Dashboard
      </Button>
    </div>
  );
}