export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emergency_contacts?: EmergencyContact[];
  medical_info?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface SOSRequest {
  sos_id: string;
  user_id: string;
  location: Location;
  emergency_type: 'medical' | 'police' | 'fire' | 'rescue';
  description?: string;
  voice_detected: boolean;
  status: 'active' | 'responding' | 'resolved' | 'cancelled';
  assigned_ambulance?: string;
  assigned_hospital?: string;
  response_time?: number;
  created_at: Date;
  resolved_at?: Date;
}

export interface Disaster {
  disaster_id: string;
  type: 'flood' | 'cyclone' | 'earthquake' | 'fire' | 'heatwave';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: Location;
  affected_radius: number;
  start_time: Date;
  last_updated: Date;
  status: 'active' | 'monitoring' | 'resolved';
  casualties?: number;
  evacuated?: number;
  resources_deployed?: string[];
  weather_data?: WeatherData;
}

export interface WeatherData {
  temperature: number;
  rainfall: number;
  wind_speed: number;
  humidity: number;
}

export interface Ambulance {
  ambulance_id: string;
  vehicle_number: string;
  current_location: Location;
  status: 'available' | 'responding' | 'transporting' | 'maintenance';
  assigned_sos?: string;
  crew: CrewMember[];
  equipment: string[];
  last_location_update: Date;
  speed?: number;
  heading?: number;
  fuel_level?: number;
  maintenance_due?: Date;
}

export interface CrewMember {
  name: string;
  role: 'driver' | 'paramedic' | 'doctor';
  phone: string;
}

export interface Hospital {
  hospital_id: string;
  name: string;
  location: Location;
  capacity: {
    total_beds: number;
    available_beds: number;
    icu_beds: number;
    available_icu_beds: number;
  };
  contact: {
    phone: string;
    emergency: string;
    address: string;
  };
  specialties: string[];
  status: 'active' | 'full' | 'emergency_only' | 'closed';
}

export interface ReliefCenter {
  center_id: string;
  name: string;
  location: Location;
  capacity: number;
  current_occupancy: number;
  facilities: string[];
  contact: {
    phone: string;
    manager: string;
  };
  status: 'active' | 'full' | 'closed';
}

export interface DisasterPrediction {
  prediction_id: string;
  location: Location;
  disaster_type: string;
  risk_percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timeframe_hours: number;
  probability_timeline: number[];
  weather_factors: WeatherData;
  model_accuracy: number;
  last_trained: Date;
  recommended_actions: string[];
}

export interface WebSocketMessage {
  type: 'sos_emergency' | 'ambulance_location' | 'disaster_alert' | 'hospital_status' | 'emergency_broadcast';
  data: any;
  timestamp: Date;
}

export interface NotificationPreferences {
  push_notifications: boolean;
  email_alerts: boolean;
  sms_alerts: boolean;
  geographic_alerts: boolean;
  disaster_types: string[];
  min_severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UserSettings {
  language: 'en' | 'hi' | 'mr';
  dark_mode: boolean;
  location_sharing: boolean;
  voice_commands: boolean;
  auto_location: boolean;
  notifications: NotificationPreferences;
}

export type EmergencyService = 'ambulance' | 'police' | 'fire' | 'hospital';

export interface MapMarker {
  id: string;
  position: Location;
  type: 'sos' | 'disaster' | 'ambulance' | 'hospital' | 'relief_center';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
}

export interface Route {
  from: Location;
  to: Location;
  coordinates: Location[];
  distance: number;
  duration: number;
  instructions: string[];
}

export interface AlertLevels {
  low: '#00FF00';    // Green
  medium: '#FFFF00';  // Yellow
  high: '#FFA500';    // Orange
  critical: '#FF0000'; // Red
}