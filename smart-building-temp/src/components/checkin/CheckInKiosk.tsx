/**
 * Self-Service Check-in/Check-out Kiosk Component
 * Handles visitor and tenant check-in processes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Fingerprint,
  CreditCard,
  QrCode,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  User,
  Building,
  Key
} from 'lucide-react';
import { 
  CheckInOut,
  CheckType,
  CheckMethod,
  Location,
  AreaType
} from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

interface CheckInKioskProps {
  location: Location;
  kioskMode?: 'visitor' | 'tenant' | 'both';
  onComplete?: (checkIn: CheckInOut) => void;
}

type Step = 'method' | 'identity' | 'details' | 'confirmation' | 'success';

export function CheckInKiosk({ location, kioskMode = 'both', onComplete }: CheckInKioskProps) {
  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [checkType, setCheckType] = useState<'visitor' | 'tenant' | null>(null);
  const [checkMethod, setCheckMethod] = useState<CheckMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    hostName: '',
    purpose: '',
    expectedDuration: 60, // minutes
    roomNumber: '',
    vehicleInfo: null as any
  });
  const [processing, setProcessing] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInOut | null>(null);

  const iotService = getIoTService();

  const handleMethodSelect = (method: CheckMethod) => {
    setCheckMethod(method);
    setCurrentStep('identity');
  };

  const handleIdentityVerification = async () => {
    // In real implementation, this would handle:
    // - QR code scanning
    // - Biometric verification
    // - Card reading
    // - Manual entry validation
    
    setCurrentStep('details');
  };

  const handleDetailsSubmit = () => {
    setCurrentStep('confirmation');
  };

  const handleCheckIn = async () => {
    setProcessing(true);
    
    try {
      const checkInData = {
        userId: formData.email || 'guest_' + Date.now(),
        method: checkMethod!,
        location,
        details: {
          guestCount: 1,
          roomNumber: formData.roomNumber,
          duration: formData.expectedDuration,
          specialRequests: []
        }
      };
      
      const result = await iotService.checkIn(checkInData);
      setCheckInResult(result);
      setCurrentStep('success');
      
      // Grant temporary access
      if (checkType === 'visitor') {
        await iotService.grantAccess(result.userId, {
          areas: ['lobby', 'floor-' + location.floor],
          level: 'guest',
          validUntil: new Date(Date.now() + formData.expectedDuration * 60 * 1000)
        });
      }
      
      onComplete?.(result);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
    
    setProcessing(false);
  };

  const renderMethodSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-gray-600">Please select check-in method</p>
      </div>

      {kioskMode !== 'tenant' && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Visitor Check-in</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
              onClick={() => {
                setCheckType('visitor');
                handleMethodSelect(CheckMethod.KIOSK);
              }}
            >
              <User className="h-12 w-12 mx-auto mb-3 text-blue-500" />
              <p className="font-medium">Manual Entry</p>
              <p className="text-sm text-gray-500 mt-1">Enter your details</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
              onClick={() => {
                setCheckType('visitor');
                handleMethodSelect(CheckMethod.MOBILE);
              }}
            >
              <QrCode className="h-12 w-12 mx-auto mb-3 text-blue-500" />
              <p className="font-medium">QR Code</p>
              <p className="text-sm text-gray-500 mt-1">Scan pre-registration</p>
            </motion.button>
          </div>
        </div>
      )}

      {kioskMode !== 'visitor' && (
        <div>
          <h3 className="text-lg font-medium mb-3">Tenant/Employee Check-in</h3>
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-green-500 transition-all"
              onClick={() => {
                setCheckType('tenant');
                handleMethodSelect(CheckMethod.CARD);
              }}
            >
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Access Card</p>
              <p className="text-sm text-gray-500 mt-1">Tap your card</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-green-500 transition-all"
              onClick={() => {
                setCheckType('tenant');
                handleMethodSelect(CheckMethod.BIOMETRIC);
              }}
            >
              <Fingerprint className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Biometric</p>
              <p className="text-sm text-gray-500 mt-1">Fingerprint scan</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-green-500 transition-all"
              onClick={() => {
                setCheckType('tenant');
                handleMethodSelect(CheckMethod.MOBILE);
              }}
            >
              <QrCode className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Mobile App</p>
              <p className="text-sm text-gray-500 mt-1">Scan from app</p>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderIdentityStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
        <p className="text-gray-600">Please verify your identity</p>
      </div>

      {checkMethod === CheckMethod.BIOMETRIC && (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <Fingerprint className="h-24 w-24 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-lg font-medium">Place your finger on the scanner</p>
          <p className="text-sm text-gray-500 mt-2">Hold until the light turns green</p>
        </div>
      )}

      {checkMethod === CheckMethod.CARD && (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <CreditCard className="h-24 w-24 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-lg font-medium">Tap your access card</p>
          <p className="text-sm text-gray-500 mt-2">Hold card near the reader</p>
        </div>
      )}

      {checkMethod === CheckMethod.MOBILE && (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <QrCode className="h-24 w-24 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Scan QR Code</p>
          <p className="text-sm text-gray-500 mt-2">Open your app and scan the code above</p>
        </div>
      )}

      {checkMethod === CheckMethod.KIOSK && checkType === 'visitor' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep('method')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleIdentityVerification}
          disabled={checkMethod === CheckMethod.KIOSK && !formData.name}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Visit Details</h2>
        <p className="text-gray-600">Please provide visit information</p>
      </div>

      <div className="space-y-4">
        {checkType === 'visitor' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="ABC Corporation"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Host Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Jane Smith"
                value={formData.hostName}
                onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Purpose of Visit</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              >
                <option value="">Select purpose</option>
                <option value="meeting">Meeting</option>
                <option value="delivery">Delivery</option>
                <option value="interview">Interview</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expected Duration</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.expectedDuration}
                onChange={(e) => setFormData({ ...formData, expectedDuration: parseInt(e.target.value) })}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="480">Full day</option>
              </select>
            </div>
          </>
        )}
        
        {checkType === 'tenant' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Office/Room Number</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Suite 500"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>
          </>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Do you have a vehicle?
          </label>
          <div className="flex space-x-4">
            <Button
              variant={formData.vehicleInfo ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFormData({ 
                ...formData, 
                vehicleInfo: { needed: true } 
              })}
            >
              Yes
            </Button>
            <Button
              variant={!formData.vehicleInfo ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFormData({ 
                ...formData, 
                vehicleInfo: null 
              })}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep('identity')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleDetailsSubmit}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Confirm Details</h2>
        <p className="text-gray-600">Please review your information</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        {checkType === 'visitor' && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Company</span>
              <span className="font-medium">{formData.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Host</span>
              <span className="font-medium">{formData.hostName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Purpose</span>
              <span className="font-medium capitalize">{formData.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium">
                {formData.expectedDuration < 60 
                  ? `${formData.expectedDuration} minutes`
                  : `${formData.expectedDuration / 60} hours`
                }
              </span>
            </div>
          </>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-500">Check-in Time</span>
          <span className="font-medium">{format(new Date(), 'HH:mm')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Location</span>
          <span className="font-medium">
            {location.building} - Floor {location.floor}
          </span>
        </div>
        
        {formData.vehicleInfo && (
          <div className="flex justify-between">
            <span className="text-gray-500">Parking</span>
            <span className="font-medium">Required</span>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> You will receive a visitor badge and access card. 
          Please wear your badge visibly at all times and return it upon checkout.
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep('details')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleCheckIn}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Confirm Check-in'}
        </Button>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <CheckCircle className="h-24 w-24 mx-auto text-green-500" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Check-in Successful!</h2>
        <p className="text-gray-600">Welcome to {location.building}</p>
      </div>

      {checkInResult && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="text-lg font-medium">Check-in ID: {checkInResult.id}</div>
          
          {checkType === 'visitor' && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Access Granted To:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Lobby</Badge>
                  <Badge variant="default">Floor {location.floor}</Badge>
                  <Badge variant="default">Meeting Rooms</Badge>
                  <Badge variant="default">Cafeteria</Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Next Steps:</p>
                <ol className="text-left text-sm space-y-1">
                  <li>1. Collect your visitor badge from the printer</li>
                  <li>2. Wait for your host in the lobby</li>
                  <li>3. Follow building safety guidelines</li>
                </ol>
              </div>
            </>
          )}
          
          {formData.vehicleInfo && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Parking Information:</p>
              <p className="font-medium">Space B2-47 reserved</p>
              <p className="text-sm">Valid until {format(new Date(Date.now() + formData.expectedDuration * 60 * 1000), 'HH:mm')}</p>
            </div>
          )}
        </div>
      )}

      <Button
        size="lg"
        onClick={() => {
          setCurrentStep('method');
          setCheckType(null);
          setCheckMethod(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            hostName: '',
            purpose: '',
            expectedDuration: 60,
            roomNumber: '',
            vehicleInfo: null
          });
          setCheckInResult(null);
        }}
      >
        <Home className="h-4 w-4 mr-2" />
        New Check-in
      </Button>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {['method', 'identity', 'details', 'confirmation', 'success'].map((step, index) => (
            <div
              key={step}
              className={`
                h-2 flex-1 rounded-full transition-all
                ${currentStep === step ? 'bg-blue-500' : 
                  ['method', 'identity', 'details', 'confirmation', 'success'].indexOf(currentStep) > index 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'identity' && renderIdentityStep()}
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'confirmation' && renderConfirmation()}
        {currentStep === 'success' && renderSuccess()}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Need assistance? Contact security at ext. 1234</p>
      </div>
    </div>
  );
}