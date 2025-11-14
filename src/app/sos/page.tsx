'use client';

import { useState, useEffect, useCallback } from 'react';
import { SOSButton } from '@/components/emergency/SOSButton';
import { VoiceActivation } from '@/components/emergency/VoiceActivation';
import { LocationDetector } from '@/components/emergency/LocationDetector';
import { QuickActions } from '@/components/emergency/QuickActions';
import { NearbyServices } from '@/components/emergency/NearbyServices';
import { Location, EmergencyService } from '@/lib/types';
import { getUserSettings, getEmergencyMessage, isValidLocation } from '@/lib/utils';

export default function SOSPage() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyService>('ambulance');
  const [userSettings] = useState(getUserSettings());

  // Auto-detect location on page load
  useEffect(() => {
    if (userSettings.auto_location) {
      detectLocation();
    }
  }, [userSettings.auto_location]);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (isValidLocation(location)) {
        setCurrentLocation(location);
        setLocationError('');
      }
    } catch (error) {
      setLocationError('Unable to get your location. Please enable GPS and try again.');
      console.error('Location detection error:', error);
    }
  }, []);

  const handleSOSActivated = useCallback((location: Location, emergencyType: EmergencyService, voiceDetected: boolean = false) => {
    setSosActivated(true);
    setSelectedEmergency(emergencyType);

    // Create SOS request
    const sosRequest = {
      sos_id: `sos_${Date.now()}`,
      user_id: 'user_id_placeholder', // Will come from auth
      location,
      emergency_type: emergencyType === 'hospital' ? 'medical' : emergencyType,
      voice_detected: voiceDetected,
      status: 'active' as const,
      created_at: new Date()
    };

    // Send to backend
    sendSOSRequest(sosRequest);

    // Show feedback
    showEmergencyFeedback(emergencyType, voiceDetected);
  }, []);

  const sendSOSRequest = async (request: any) => {
    try {
      const response = await fetch('/api/sos/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to send SOS request');
      }

      const data = await response.json();
      console.log('SOS request sent successfully:', data);
    } catch (error) {
      console.error('Error sending SOS request:', error);
      // Show error to user
      alert('Failed to send SOS request. Please try again or call emergency services directly.');
    }
  };

  const showEmergencyFeedback = (emergencyType: EmergencyService, voiceDetected: boolean) => {
    const message = voiceDetected
      ? `Voice command detected! ${getEmergencyMessage(`${emergencyType}_dispatched`, userSettings.language)}`
      : getEmergencyMessage('sos_activated', userSettings.language);

    // Use native notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(getEmergencyMessage('sos_activated', userSettings.language), {
        body: message,
        icon: '/icons/sos-icon.png',
        requireInteraction: true,
        tag: 'sos-emergency'
      });
    } else {
      alert(message);
    }
  };

  const handleVoiceCommand = useCallback((command: string, detected: boolean) => {
    if (!detected) return;

    // Parse voice command
    const lowerCommand = command.toLowerCase();

    if (currentLocation) {
      if (lowerCommand.includes('ambulance') || lowerCommand.includes('medical') || lowerCommand.includes('doctor')) {
        handleSOSActivated(currentLocation, 'ambulance', true);
      } else if (lowerCommand.includes('police')) {
        handleSOSActivated(currentLocation, 'police', true);
      } else if (lowerCommand.includes('fire')) {
        handleSOSActivated(currentLocation, 'fire', true);
      } else if (lowerCommand.includes('emergency') || lowerCommand.includes('help') || lowerCommand.includes('sos')) {
        handleSOSActivated(currentLocation, 'ambulance', true);
      }
    }
  }, [currentLocation, handleSOSActivated]);

  const handleQuickAction = useCallback((service: EmergencyService) => {
    if (currentLocation) {
      handleSOSActivated(currentLocation, service, false);
    } else {
      // Try to detect location first
      detectLocation().then(() => {
        if (currentLocation) {
          handleSOSActivated(currentLocation, service, false);
        }
      });
    }
  }, [currentLocation, detectLocation, handleSOSActivated]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (sosActivated) {
    return (
      <div className="min-h-screen bg-red-600 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="animate-pulse">
            <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            {getEmergencyMessage('help_on_way', userSettings.language)}
          </h1>
          <p className="text-lg">
            {getEmergencyMessage(`${selectedEmergency}_dispatched`, userSettings.language)}
          </p>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm">
              {getEmergencyMessage('location_sharing', userSettings.language)}
            </p>
            {currentLocation && (
              <p className="text-xs mt-2 opacity-75">
                GPS: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            )}
          </div>
          <button
            onClick={() => setSosActivated(false)}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Send Another Alert
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${userSettings.dark_mode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {userSettings.language === 'hi' ? 'आपातकालीन सहायता' :
             userSettings.language === 'mr' ? 'आणीबाणी मदत' :
             'Emergency Assistance'}
          </h1>
          <p className="text-lg opacity-75">
            {userSettings.language === 'hi' ? 'तुरंत मदद के लिए बटन दबाएं या आवाज दें' :
             userSettings.language === 'mr' ? 'तातडीच्या मदतीसाठी बटण दाबा किंवा आवाज द्या' :
             'Press button or speak for immediate help'}
          </p>
        </header>

        {/* Location Status */}
        <div className="mb-8">
          <LocationDetector
            onLocationDetected={setCurrentLocation}
            onError={setLocationError}
            autoDetect={userSettings.auto_location}
          />
        </div>

        {/* Main SOS Button */}
        <div className="mb-8 flex justify-center">
          <SOSButton
            onActivate={handleSOSActivated}
            disabled={!currentLocation}
            size="extra-large"
          />
        </div>

        {/* Voice Activation */}
        {userSettings.voice_commands && (
          <div className="mb-8">
            <VoiceActivation
              isActive={isVoiceActive}
              onCommandDetected={handleVoiceCommand}
              language={userSettings.language}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            onAction={handleQuickAction}
            disabled={!currentLocation}
            language={userSettings.language}
          />
        </div>

        {/* Nearby Services */}
        {currentLocation && (
          <div>
            <NearbyServices
              location={currentLocation}
              language={userSettings.language}
            />
          </div>
        )}

        {/* Emergency Numbers */}
        <div className={`mt-8 p-4 rounded-lg ${userSettings.dark_mode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className="text-xl font-semibold mb-3">
            {userSettings.language === 'hi' ? 'आपातकालीन नंबर' :
             userSettings.language === 'mr' ? 'आणीबाणी क्रमांक' :
             'Emergency Numbers'}
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Ambulance:</span>
              <span className="font-mono font-bold">108</span>
            </div>
            <div className="flex justify-between">
              <span>Police:</span>
              <span className="font-mono font-bold">100</span>
            </div>
            <div className="flex justify-between">
              <span>Fire:</span>
              <span className="font-mono font-bold">101</span>
            </div>
            <div className="flex justify-between">
              <span>Disaster:</span>
              <span className="font-mono font-bold">112</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}