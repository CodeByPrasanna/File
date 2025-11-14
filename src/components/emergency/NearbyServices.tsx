'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/lib/types';
import { calculateDistance, formatRelativeTime, metersToKilometers } from '@/lib/utils';

interface NearbyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire' | 'relief_center';
  location: Location;
  distance: number;
  phone: string;
  address?: string;
  status?: 'active' | 'full' | 'closed' | 'emergency_only';
  available?: boolean;
  capacity?: {
    beds?: number;
    available_beds?: number;
  };
}

interface NearbyServicesProps {
  location: Location;
  language: 'en' | 'hi' | 'mr';
  className?: string;
}

export function NearbyServices({ location, language, className = '' }: NearbyServicesProps) {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospital' | 'police' | 'fire' | 'relief_center'>('all');

  const fetchNearbyServices = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError('');

    try {
      // Mock nearby services data - in production, this would come from your API
      const mockServices: NearbyService[] = [
        {
          id: '1',
          name: language === 'hi' ? 'सिटी अस्पताल' : language === 'mr' ? 'शहर रुग्णालय' : 'City Hospital',
          type: 'hospital',
          location: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
          distance: calculateDistance(location, { lat: location.lat + 0.01, lng: location.lng + 0.01 }),
          phone: '+91-22-12345678',
          address: '123 Main Street, City',
          status: 'active',
          available: true,
          capacity: {
            beds: 500,
            available_beds: 150
          }
        },
        {
          id: '2',
          name: language === 'hi' ? 'केंद्रीय पुलिस स्टेशन' : language === 'mr' ? 'केंद्रीय पोलीस ठाणे' : 'Central Police Station',
          type: 'police',
          location: { lat: location.lat - 0.008, lng: location.lng + 0.005 },
          distance: calculateDistance(location, { lat: location.lat - 0.008, lng: location.lng + 0.005 }),
          phone: '+91-22-87654321',
          address: '456 Police Road, City',
          status: 'active',
          available: true
        },
        {
          id: '3',
          name: language === 'hi' ? 'फायर स्टेशन नंबर 1' : language === 'mr' ? 'अग्निशमन केंद्र क्रमांक १' : 'Fire Station No. 1',
          type: 'fire',
          location: { lat: location.lat + 0.005, lng: location.lng - 0.008 },
          distance: calculateDistance(location, { lat: location.lat + 0.005, lng: location.lng - 0.008 }),
          phone: '+91-22-11223344',
          address: '789 Fire Brigade Avenue, City',
          status: 'active',
          available: true
        },
        {
          id: '4',
          name: language === 'hi' ? 'आपातकालीन राहत केंद्र' : language === 'mr' ? 'आपत्कालीन सहायता केंद्र' : 'Emergency Relief Center',
          type: 'relief_center',
          location: { lat: location.lat - 0.006, lng: location.lng - 0.004 },
          distance: calculateDistance(location, { lat: location.lat - 0.006, lng: location.lng - 0.004 }),
          phone: '+91-22-55443322',
          address: '321 Relief Camp Road, City',
          status: 'active',
          available: true
        }
      ];

      // Sort by distance
      const sortedServices = mockServices.sort((a, b) => a.distance - b.distance);
      setServices(sortedServices);
    } catch (err) {
      setError('Failed to fetch nearby services');
      console.error('Error fetching nearby services:', err);
    } finally {
      setLoading(false);
    }
  }, [location, language]);

  useEffect(() => {
    fetchNearbyServices();
  }, [fetchNearbyServices]);

  const getServiceIcon = (type: string) => {
    const icons = {
      hospital: '🏥',
      police: '🚔',
      fire: '🚒',
      relief_center: '🏘️'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'emergency_only': return 'text-orange-600';
      case 'full': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return language === 'hi' ? 'सक्रिय' : language === 'mr' => 'सक्रिय' : 'Active';
      case 'emergency_only': return language === 'hi' ? 'केवल आपातकालीन' : language === 'mr' ? 'फक्त आणीबाणी' : 'Emergency Only';
      case 'full': return language === 'hi' ? 'भरा हुआ' : language === 'mr' ? 'भरलेले' : 'Full';
      case 'closed': return language === 'hi' ? 'बंद' : language === 'mr' => 'बंद' : 'Closed';
      default: return language === 'hi' ? 'अज्ञात' : language === 'mr' => 'अज्ञात' : 'Unknown';
    }
  };

  const filteredServices = selectedFilter === 'all'
    ? services
    : services.filter(service => service.type === selectedFilter);

  const getDirections = (service: NearbyService) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${service.location.lat},${service.location.lng}`;
    window.open(url, '_blank');
  };

  const callService = (service: NearbyService) => {
    window.open(`tel:${service.phone}`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {language === 'hi' ? 'नजदीकी सेवाएं' :
           language === 'mr' ? 'जवळच्या सेवा' :
           'Nearby Services'}
        </h2>
        <button
          onClick={fetchNearbyServices}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: language === 'hi' ? 'सभी' : language === 'mr' ? 'सर्व' : 'All' },
          { value: 'hospital', label: language === 'hi' ? 'अस्पताल' : language === 'mr' ? 'रुग्णालय' : 'Hospitals' },
          { value: 'police', label: language === 'hi' ? 'पुलिस' : language === 'mr' ? 'पोलीस' : 'Police' },
          { value: 'fire', label: language === 'hi' ? 'आग बुझाना' : language === 'mr' ? 'अग्निशामन' : 'Fire' },
          { value: 'relief_center', label: language === 'hi' ? 'राहत केंद्र' : language === 'mr' ? 'सहायता केंद्र' : 'Relief' }
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value as any)}
            className={`
              px-3 py-1 rounded-full text-sm transition-colors
              ${selectedFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-2xl">{getServiceIcon(service.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {service.address}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="font-medium">
                      {Math.round(service.distance)}m away ({metersToKilometers(service.distance).toFixed(1)}km)
                    </span>
                    <span className={getStatusColor(service.status)}>
                      {getStatusText(service.status)}
                    </span>
                  </div>

                  {service.type === 'hospital' && service.capacity && (
                    <div className="mt-2 text-sm">
                      <span className="text-green-600">
                        {service.capacity.available_beds} beds available
                      </span>
                      <span className="text-gray-500 ml-2">
                        (of {service.capacity.beds} total)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => callService(service)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => getDirections(service)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  📍 Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>
            {language === 'hi' ? 'इस क्षेत्र में कोई सेवाएं नहीं मिलीं' :
             language === 'mr' ? 'या क्षेत्रात कोणत्याही सेवा सापडल्या नाहीत' :
             'No services found in this area'}
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}