'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Disaster, Location } from '@/lib/types';
import { getSeverityColor, formatRelativeTime } from '@/lib/utils';

export default function Dashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  // Mock disaster data - in production, this would come from your API
  const mockDisasters: Disaster[] = [
    {
      disaster_id: '1',
      type: 'flood',
      severity: 'high',
      location: { lat: 19.0760, lng: 72.8777 },
      affected_radius: 5000,
      start_time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      last_updated: new Date(),
      status: 'active',
      casualties: 15,
      evacuated: 200,
      resources_deployed: ['ambulances', 'rescue_teams'],
      weather_data: {
        temperature: 28,
        rainfall: 85,
        wind_speed: 12,
        humidity: 90
      }
    },
    {
      disaster_id: '2',
      type: 'fire',
      severity: 'medium',
      location: { lat: 19.0860, lng: 72.8877 },
      affected_radius: 1000,
      start_time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      last_updated: new Date(),
      status: 'monitoring',
      casualties: 0,
      evacuated: 50,
      resources_deployed: ['fire_trucks'],
      weather_data: {
        temperature: 32,
        rainfall: 0,
        wind_speed: 8,
        humidity: 45
      }
    },
    {
      disaster_id: '3',
      type: 'cyclone',
      severity: 'critical',
      location: { lat: 19.0960, lng: 72.8677 },
      affected_radius: 10000,
      start_time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      last_updated: new Date(),
      status: 'active',
      casualties: 45,
      evacuated: 1500,
      resources_deployed: ['ambulances', 'rescue_teams', 'helicopters'],
      weather_data: {
        temperature: 25,
        rainfall: 120,
        wind_speed: 85,
        humidity: 95
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDisasters(mockDisasters);
      setLoading(false);
    }, 1000);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }, []);

  const getDisasterIcon = (type: string) => {
    const icons = {
      flood: '🌊',
      cyclone: '🌀',
      earthquake: '🏚️',
      fire: '🔥',
      heatwave: '🌡️'
    };
    return icons[type as keyof typeof icons] || '⚠️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDistanceFromUser = (disaster: Disaster) => {
    if (!userLocation) return null;
    const R = 6371; // Earth's radius in kilometers
    const dLat = (disaster.location.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (disaster.location.lng - userLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(disaster.location.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const activeDisasters = disasters.filter(d => d.status === 'active').length;
  const monitoringDisasters = disasters.filter(d => d.status === 'monitoring').length;
  const totalEvacuated = disasters.reduce((sum, d) => sum + (d.evacuated || 0), 0);
  const totalCasualties = disasters.reduce((sum, d) => sum + (d.casualties || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
              <span className="font-bold text-xl">Disaster Dashboard</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/sos" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Emergency SOS
              </Link>
              <Link href="/admin" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Real-Time Disaster Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Live disaster tracking and emergency resource coordination
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Disasters</p>
                <p className="text-2xl font-bold text-red-600">{activeDisasters}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitoring</p>
                <p className="text-2xl font-bold text-yellow-600">{monitoringDisasters}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Evacuated</p>
                <p className="text-2xl font-bold text-blue-600">{totalEvacuated.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Disasters</p>
                <p className="text-2xl font-bold text-purple-600">{disasters.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disasters List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Disasters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Active Disasters</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                </div>
              ) : disasters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>No active disasters in your area</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disasters.map((disaster) => {
                    const distance = getDistanceFromUser(disaster);
                    return (
                      <div
                        key={disaster.disaster_id}
                        onClick={() => setSelectedDisaster(disaster)}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{getDisasterIcon(disaster.type)}</span>
                            <div>
                              <h3 className="font-semibold capitalize">{disaster.type} - {disaster.severity}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Started {formatRelativeTime(disaster.start_time)}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(disaster.status)}`}>
                                  {disaster.status}
                                </span>
                                <span className="text-sm">
                                  {disaster.casualties || 0} casualties
                                </span>
                                <span className="text-sm">
                                  {disaster.evacuated || 0} evacuated
                                </span>
                              </div>
                              {distance && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {distance.toFixed(1)} km from you
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getSeverityColor(disaster.severity) }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Disaster Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Disaster Details</h2>
            </div>
            <div className="p-6">
              {selectedDisaster ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getDisasterIcon(selectedDisaster.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold capitalize">
                        {selectedDisaster.type} - {selectedDisaster.severity}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {selectedDisaster.disaster_id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDisaster.status)}`}>
                        {selectedDisaster.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
                      <span>{selectedDisaster.start_time.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Affected Area:</span>
                      <span>{(selectedDisaster.affected_radius / 1000).toFixed(1)} km radius</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Casualties:</span>
                      <span className="text-red-600 font-semibold">{selectedDisaster.casualties || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Evacuated:</span>
                      <span className="text-blue-600 font-semibold">{selectedDisaster.evacuated || 0}</span>
                    </div>
                  </div>

                  {selectedDisaster.weather_data && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Weather Conditions</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Temperature: {selectedDisaster.weather_data.temperature}°C</div>
                        <div>Rainfall: {selectedDisaster.weather_data.rainfall}mm</div>
                        <div>Wind: {selectedDisaster.weather_data.wind_speed} km/h</div>
                        <div>Humidity: {selectedDisaster.weather_data.humidity}%</div>
                      </div>
                    </div>
                  )}

                  {selectedDisaster.resources_deployed && selectedDisaster.resources_deployed.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Deployed Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDisaster.resources_deployed.map((resource, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {resource.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📍</div>
                  <p>Select a disaster to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/maps"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
          >
            🗺️ View Map
          </Link>
          <Link
            href="/sos"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🚨 Emergency SOS
          </Link>
        </div>
      </div>
    </div>
  );
}