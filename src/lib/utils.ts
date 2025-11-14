import { Location, EmergencyService, UserSettings, SOSRequest } from './types';
import { EMERGENCY_CONTACTS, LOCAL_STORAGE_KEYS, EMERGENCY_MESSAGES } from './constants';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(from: Location, to: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Distance in meters
}

/**
 * Get emergency service contact number
 */
export function getEmergencyContact(service: EmergencyService): string {
  return EMERGENCY_CONTACTS[service];
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(location: Location): string {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
}

/**
 * Get current user settings from localStorage
 */
export function getUserSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    return stored ? JSON.parse(stored) : getDefaultSettings();
  } catch (error) {
    console.error('Error loading user settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Save user settings to localStorage
 */
export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
}

/**
 * Get default user settings
 */
export function getDefaultSettings(): UserSettings {
  return {
    language: 'en',
    dark_mode: false,
    location_sharing: true,
    voice_commands: true,
    auto_location: true,
    notifications: {
      push_notifications: true,
      email_alerts: true,
      sms_alerts: true,
      geographic_alerts: true,
      disaster_types: ['flood', 'cyclone', 'earthquake', 'fire', 'heatwave'],
      min_severity: 'medium'
    }
  };
}

/**
 * Get localized emergency message
 */
export function getEmergencyMessage(key: string, language: string = 'en'): string {
  try {
    const messages = EMERGENCY_MESSAGES[language as keyof typeof EMERGENCY_MESSAGES];
    return messages?.[key as keyof typeof messages] || key;
  } catch (error) {
    return key;
  }
}

/**
 * Format time relative to now
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Validate location coordinates
 */
export function isValidLocation(location: Location): boolean {
  return (
    location &&
    typeof location.lat === 'number' &&
    typeof location.lng === 'number' &&
    location.lat >= -90 &&
    location.lat <= 90 &&
    location.lng >= -180 &&
    location.lng <= 180
  );
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get device info for debugging
 */
export function getDeviceInfo(): object {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    isMobile: isMobileDevice(),
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth
    }
  };
}

/**
 * Convert meters to kilometers
 */
export function metersToKilometers(meters: number): number {
  return meters / 1000;
}

/**
 * Convert meters to miles
 */
export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}

/**
 * Get bearing between two points
 */
export function getBearing(from: Location, to: Location): number {
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const fromLat = from.lat * Math.PI / 180;
  const toLat = to.lat * Math.PI / 180;

  const y = Math.sin(dLng) * Math.cos(toLat);
  const x = Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);

  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Format compass bearing
 */
export function formatCompassBearing(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Check if point is within radius
 */
export function isWithinRadius(center: Location, point: Location, radius: number): boolean {
  const distance = calculateDistance(center, point);
  return distance <= radius;
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  const colors = {
    low: '#00FF00',
    medium: '#FFFF00',
    high: '#FFA500',
    critical: '#FF0000'
  };
  return colors[severity];
}

/**
 * Create notification payload
 */
export function createNotificationPayload(title: string, body: string, options?: any): NotificationOptions {
  return {
    body,
    icon: '/icons/disaster-icon.png',
    badge: '/icons/badge-icon.png',
    tag: 'disaster-alert',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    ...options
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Get map bounds for multiple points
 */
export function getBoundsForPoints(points: Location[]): { min: Location; max: Location } | null {
  if (points.length === 0) return null;

  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);

  return {
    min: { lat: Math.min(...lats), lng: Math.min(...lngs) },
    max: { lat: Math.max(...lats), lng: Math.max(...lngs) }
  };
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}