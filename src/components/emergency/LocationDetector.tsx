'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '@/lib/types';
import { isValidLocation, formatCoordinates } from '@/lib/utils';

interface LocationDetectorProps {
  onLocationDetected: (location: Location) => void;
  onError: (error: string) => void;
  autoDetect?: boolean;
  className?: string;
}

export function LocationDetector({
  onLocationDetected,
  onError,
  autoDetect = true,
  className = ''
}: LocationDetectorProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const detectLocation = useCallback(async (highAccuracy: boolean = true) => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      return null;
    }

    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const options: PositionOptions = {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 5000 : 10000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (isValidLocation(location)) {
        setCurrentLocation(location);
        setAccuracy(position.coords.accuracy);
        setLastUpdate(new Date());
        onLocationDetected(location);
        onError('');
        return location;
      } else {
        throw new Error('Invalid location coordinates received');
      }
    } catch (error) {
      let errorMessage = 'Unable to get your location';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable GPS/location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your GPS signal.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
      }

      onError(errorMessage);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, [onLocationDetected, onError]);

  const startLocationWatching = useCallback(() => {
    if (!navigator.geolocation) return;

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (isValidLocation(location)) {
          setCurrentLocation(location);
          setAccuracy(position.coords.accuracy);
          setLastUpdate(new Date());
          onLocationDetected(location);
        }
      },
      (error) => {
        console.error('Location watching error:', error);
        // Don't show error for watching errors to avoid spamming user
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Accept positions up to 1 minute old
      }
    );
  }, [onLocationDetected]);

  const stopLocationWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'prompt') {
          // Permission hasn't been requested yet, try to get location to trigger prompt
          await detectLocation();
        }
        return result.state;
      } catch (error) {
        console.error('Permission query failed:', error);
        return null;
      }
    }
    return null;
  }, [detectLocation]);

  // Auto-detect on mount
  useEffect(() => {
    if (autoDetect) {
      detectLocation();
    }
  }, [autoDetect, detectLocation]);

  // Start watching for location changes
  useEffect(() => {
    if (currentLocation) {
      startLocationWatching();
    }

    return () => {
      stopLocationWatching();
    };
  }, [currentLocation, startLocationWatching, stopLocationWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationWatching();
    };
  }, [stopLocationWatching]);

  const getAccuracyLevel = () => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 10) return { level: 'High', color: 'text-green-600' };
    if (accuracy <= 50) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  const accuracyInfo = getAccuracyLevel();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          📍 Location Status
          {isDetecting && (
            <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
        </h3>
        <button
          onClick={() => detectLocation(true)}
          disabled={isDetecting}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDetecting ? 'Detecting...' : 'Refresh'}
        </button>
      </div>

      {currentLocation ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Location Detected</span>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {formatCoordinates(currentLocation)}
            </div>

            {accuracy && (
              <div className="flex items-center justify-between">
                <span>Accuracy: </span>
                <span className={accuracyInfo.color}>
                  {accuracyInfo.level} (±{Math.round(accuracy)}m)
                </span>
              </div>
            )}

            {lastUpdate && (
              <div className="text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ✓ Location sharing enabled for emergency services
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium">Location Required</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enable location services to use emergency features
          </p>

          <div className="space-y-2">
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? 'Getting Location...' : 'Enable Location'}
            </button>

            <button
              onClick={requestLocationPermission}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Request Permission
            </button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Location is required for SOS alerts</p>
            <p>• Enables nearest emergency service detection</p>
            <p>• Used only for emergency responses</p>
          </div>
        </div>
      )}
    </div>
  );
}