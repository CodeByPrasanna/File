export const EMERGENCY_CONTACTS = {
  ambulance: '108',
  police: '100',
  fire: '101',
  disaster_management: '112'
};

export const VOICE_COMMANDS = {
  english: {
    sos: ['emergency', 'help', 'sos', 'ambulance', 'police', 'fire'],
    ambulance: ['ambulance', 'medical', 'doctor', 'hospital'],
    police: ['police', 'security', 'danger', 'threat'],
    fire: ['fire', 'burning', 'smoke', 'firefighter']
  },
  hindi: {
    sos: ['आपातकालीन', 'मदद', 'बचाओ', 'एम्बुलेंस', 'पुलिस', 'आग'],
    ambulance: ['एम्बुलेंस', 'चिकित्सा', 'डॉक्टर', 'अस्पताल'],
    police: ['पुलिस', 'सुरक्षा', 'खतरा', 'पुलिस बुलाओ'],
    fire: ['आग', 'जल रहा है', 'धुआं', 'आग बुझाओ']
  },
  marathi: {
    sos: ['आणीबाणी', 'मदत', 'सोस', 'एम्बुलन्स', 'पोलीस', 'आग'],
    ambulance: ['एम्बुलन्स', 'वैद्यकीय', 'डॉक्टर', 'रुग्णालय'],
    police: ['पोलीस', 'सुरक्षा', '�ोकाबाजी', 'पोलीस बोला'],
    fire: ['आग', 'जळत आहे', 'धूर', 'आग विझवा']
  }
};

export const DISASTER_SEVERITY_COLORS = {
  low: '#00FF00',      // Green
  medium: '#FFFF00',    // Yellow
  high: '#FFA500',      // Orange
  critical: '#FF0000'   // Red
};

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile'
  },
  sos: {
    emergency: '/api/sos/emergency',
    active: '/api/sos/active',
    resolve: '/api/sos/resolve/:id',
    nearby: '/api/sos/nearby/:lat/:lng',
    voiceActivation: '/api/sos/voice-activation'
  },
  disaster: {
    live: '/api/disaster/live',
    predictions: '/api/disaster/predictions',
    report: '/api/disaster/report',
    heatmap: '/api/disaster/heatmap/:lat/:lng/:zoom'
  },
  ambulance: {
    updateLocation: '/api/ambulance/update-location',
    nearest: '/api/ambulance/nearest/:lat/:lng',
    assign: '/api/ambulance/assign/:ambulanceId/:sosId',
    all: '/api/ambulance/all'
  },
  hospital: {
    available: '/api/hospitals/available/:lat/:lng',
    updateCapacity: '/api/hospitals/update-capacity/:id'
  },
  routing: {
    evacuation: '/api/route/evacuation/:from/:to',
    ambulance: '/api/route/ambulance/:from/:to',
    matrix: '/api/route/matrix'
  },
  alerts: {
    broadcast: '/api/alerts/broadcast',
    targeted: '/api/alerts/targeted',
    subscriptions: '/api/alerts/subscriptions',
    preferences: '/api/alerts/preferences'
  }
};

export const WEBSOCKET_NAMESPACES = {
  disasterUpdates: '/disaster-updates',
  sosRequests: '/sos-requests',
  ambulanceTracking: '/ambulance-tracking',
  hospitalStatus: '/hospital-status',
  emergencyAlerts: '/emergency-alerts',
  adminCoordination: '/admin-coordination'
};

export const GEOCODING_CONFIG = {
  NOMINATIM_URL: 'https://nominatim.openstreetmap.org',
  USER_AGENT: 'DisasterManagementSystem/1.0',
  RATE_LIMIT: 1000, // 1 request per second
  CACHE_TTL: 172800 // 48 hours
};

export const ROUTING_CONFIG = {
  OPEN_ROUTE_SERVICE_URL: 'https://api.openrouteservice.org',
  PROFILE_EMERGENCY: 'driving-car',
  PROFILE_EVACUATION: 'foot-walking',
  CACHE_TTL: 3600 // 1 hour
};

export const WEATHER_CONFIG = {
  OPEN_METEO_URL: 'https://api.open-meteo.com/v1',
  CACHE_TTL: 1800, // 30 minutes
  HISTORICAL_YEARS: 5
};

export const PWA_CONFIG = {
  CACHE_STRATEGY: 'cacheFirst',
  OFFLINE_PAGE: '/offline',
  CRITICAL_RESOURCES: [
    '/',
    '/sos',
    '/dashboard',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ]
};

export const NOTIFICATION_TYPES = {
  SOS_ALERT: {
    title: '🚨 Emergency Alert',
    body: 'SOS request received at location',
    icon: '/icons/sos-icon.png',
    tag: 'sos-emergency',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'respond', title: 'Respond' }
    ]
  },
  DISASTER_WARNING: {
    title: '⚠️ Disaster Warning',
    body: 'Disaster predicted in your area',
    icon: '/icons/warning-icon.png',
    tag: 'disaster-warning',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Map' },
      { action: 'evacuate', title: 'Evacuation Routes' }
    ]
  },
  RESOURCE_UPDATE: {
    title: '📊 Resource Update',
    body: 'Hospital/Ambulance status updated',
    icon: '/icons/resource-icon.png',
    tag: 'resource-update',
    requireInteraction: false
  }
};

export const RATE_LIMITS = {
  SOS_REQUESTS: {
    windowMs: 60000, // 1 minute
    max: 3,
    message: 'Too many SOS requests. Please wait before trying again.'
  },
  API_CALLS: {
    windowMs: 60000, // 1 minute
    max: 100,
    message: 'Rate limit exceeded. Please try again later.'
  },
  VOICE_COMMANDS: {
    windowMs: 60000, // 1 minute
    max: 10,
    message: 'Too many voice commands. Please wait before trying again.'
  }
};

export const EMERGENCY_MESSAGES = {
  english: {
    sos_activated: 'SOS Emergency Activated',
    help_on_way: 'Help is on the way',
    stay_calm: 'Stay calm and safe',
    location_sharing: 'Location shared with emergency services',
    voice_detected: 'Voice command detected',
    ambulance_dispatched: 'Ambulance dispatched to your location',
    police_notified: 'Police notified of your emergency',
    fire_department_alerted: 'Fire department alerted'
  },
  hindi: {
    sos_activated: 'एसओएस आपातकालीन सक्रिय',
    help_on_way: 'मदद के रास्ते में है',
    stay_calm: 'शांत और सुरक्षित रहें',
    location_sharing: 'स्थान आपातकालीन सेवाओं के साथ साझा किया गया',
    voice_detected: 'आवाज कमांड का पता चला',
    ambulance_dispatched: 'एम्बुलेंस आपके स्थान पर भेजी गई',
    police_notified: 'पुलिस को आपातकालीन की सूचना दी गई',
    fire_department_alerted: 'अग्निशमन विभाग को सचेत किया गया'
  },
  marathi: {
    sos_activated: 'एसओएस आणीबाणी सक्रिय',
    help_on_way: 'मदत येत आहे',
    stay_calm: 'शांत आणि सुरक्षित रहा',
    location_sharing: 'स्थान आपत्कालीन सेवांसह सामायिक केले',
    voice_detected: 'आवाज आदेश आढळला',
    ambulance_dispatched: 'एम्बुलन्स आपल्या स्थानी पाठविली',
    police_notified: 'पोलीसांना आपत्कालीनची कळविली',
    fire_department_alerted: 'अग्निशामक दलाला सावध केले'
  }
};

export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'disaster_user_settings',
  AUTH_TOKEN: 'disaster_auth_token',
  EMERGENCY_CONTACTS: 'disaster_emergency_contacts',
  LAST_LOCATION: 'disaster_last_location',
  NOTIFICATION_PREFERENCES: 'disaster_notification_preferences',
  LANGUAGE_PREFERENCE: 'disaster_language'
};