'use client';

import { useState, useCallback } from 'react';
import { Location, EmergencyService } from '@/lib/types';

interface SOSButtonProps {
  onActivate: (location: Location, emergencyType: EmergencyService, voiceDetected?: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  className?: string;
}

export function SOSButton({ onActivate, disabled = false, size = 'extra-large', className = '' }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-20 h-20 text-sm';
      case 'medium':
        return 'w-32 h-32 text-lg';
      case 'large':
        return 'w-48 h-48 text-xl';
      case 'extra-large':
        return 'w-56 h-56 text-2xl md:w-64 md:h-64 md:text-3xl';
      default:
        return 'w-56 h-56 text-2xl md:w-64 md:h-64 md:text-3xl';
    }
  };

  const getCurrentPosition = useCallback(async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }, []);

  const triggerVibration = useCallback(() => {
    if ('vibrate' in navigator) {
      // Vibrate pattern: three short bursts
      navigator.vibrate([100, 50, 100, 50, 100]);
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 500);
    }
  }, []);

  const handleMouseDown = useCallback(async () => {
    if (disabled || isPressed) return;

    setIsPressed(true);
    setCountdown(3);
    triggerVibration();

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-trigger after 3 seconds
    setTimeout(async () => {
      clearInterval(countdownInterval);
      setCountdown(null);

      try {
        const location = await getCurrentPosition();
        onActivate(location, 'ambulance', false);

        // Additional vibration when activated
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      } catch (error) {
        console.error('Error getting location for SOS:', error);
        alert('Unable to get your location. Please enable GPS and try again.');
      }

      setIsPressed(false);
    }, 3000);
  }, [disabled, isPressed, onActivate, getCurrentPosition, triggerVibration]);

  const handleMouseUp = useCallback(() => {
    if (countdown !== null) {
      setIsPressed(false);
      setCountdown(null);
    }
  }, [countdown]);

  const handleMouseLeave = useCallback(() => {
    if (countdown !== null) {
      setIsPressed(false);
      setCountdown(null);
    }
  }, [countdown]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  }, [handleMouseDown]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  }, [handleMouseUp]);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        className={`
          ${getSizeClasses()}
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'}
          ${isPressed ? 'scale-95' : 'scale-100'}
          ${isVibrating ? 'animate-pulse' : ''}
          rounded-full text-white font-bold
          flex items-center justify-center
          transition-all duration-200
          shadow-2xl hover:shadow-3xl
          focus:outline-none focus:ring-4 focus:ring-red-300
          select-none
          ${disabled ? '' : 'cursor-pointer'}
        `}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleMouseUp}
        aria-label="Emergency SOS Button - Hold for 3 seconds to activate"
        role="button"
        tabIndex={0}
      >
        <div className="text-center">
          {countdown !== null ? (
            <div className="animate-pulse">
              <div className="text-5xl md:text-7xl font-bold">{countdown}</div>
              <div className="text-xs md:text-sm mt-1 opacity-75">HOLD</div>
            </div>
          ) : (
            <div>
              <div className="text-3xl md:text-5xl mb-2">🚨</div>
              <div className="font-bold leading-tight">SOS</div>
              <div className="text-xs md:text-sm opacity-75 mt-1">
                HOLD 3 SEC
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Pulsing ring effect */}
      {isPressed && (
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping" />
      )}

      {/* Instructions */}
      {!disabled && (
        <div className="text-center mt-4 text-sm opacity-75">
          Hold button for 3 seconds to send emergency alert
        </div>
      )}

      {/* Accessibility hint */}
      {disabled && (
        <div className="text-center mt-4 text-sm text-red-600">
          Location required to activate SOS
        </div>
      )}
    </div>
  );
}