'use client';

import { EmergencyService } from '@/lib/types';
import { getEmergencyContact } from '@/lib/utils';

interface QuickActionsProps {
  onAction: (service: EmergencyService) => void;
  disabled?: boolean;
  language: 'en' | 'hi' | 'mr';
  className?: string;
}

export function QuickActions({ onAction, disabled = false, language, className = '' }: QuickActionsProps) {
  const getActionInfo = (service: EmergencyService) => {
    const info = {
      ambulance: {
        icon: '🚑',
        title: language === 'hi' ? 'एम्बुलेंस' : language === 'mr' ? 'एम्बुलन्स' : 'Ambulance',
        description: language === 'hi' ? 'चिकित्सा आपातकालीन' : language === 'mr' ? 'वैद्यकीय आणीबाणी' : 'Medical Emergency',
        phone: '108',
        color: 'bg-red-600 hover:bg-red-700'
      },
      police: {
        icon: '🚔',
        title: language === 'hi' ? 'पुलिस' : language === 'mr' ? 'पोलीस' : 'Police',
        description: language === 'hi' ? 'सुरक्षा आपातकालीन' : language === 'mr' ? 'सुरक्षा आणीबाणी' : 'Security Emergency',
        phone: '100',
        color: 'bg-blue-600 hover:bg-blue-700'
      },
      fire: {
        icon: '🚒',
        title: language === 'hi' ? 'आग बुझाना' : language === 'mr' ? 'आग विझवा' : 'Fire Department',
        description: language === 'hi' ? 'आग की आपातकालीन' : language === 'mr' ? 'आगीची आणीबाणी' : 'Fire Emergency',
        phone: '101',
        color: 'bg-orange-600 hover:bg-orange-700'
      },
      hospital: {
        icon: '🏥',
        title: language === 'hi' ? 'अस्पताल' : language === 'mr' ? 'रुग्णालय' : 'Hospital',
        description: language === 'hi' ? 'नजदीकी अस्पताल' : language === 'mr' ? 'जवळचे रुग्णालय' : 'Nearest Hospital',
        phone: '108',
        color: 'bg-green-600 hover:bg-green-700'
      }
    };

    return info[service];
  };

  const handleQuickAction = (service: EmergencyService) => {
    onAction(service);
  };

  const handleDirectCall = (service: EmergencyService) => {
    const phone = getEmergencyContact(service);
    // Try to make a phone call
    if (typeof window !== 'undefined' && window.open) {
      window.open(`tel:${phone}`);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-center">
        {language === 'hi' ? 'त्वरित कार्य' :
         language === 'mr' ? 'त्वरित क्रिया' :
         'Quick Actions'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['ambulance', 'police', 'fire', 'hospital'] as EmergencyService[]).map((service) => {
          const info = getActionInfo(service);
          return (
            <div key={service} className="space-y-2">
              <button
                onClick={() => handleQuickAction(service)}
                disabled={disabled}
                className={`
                  ${info.color}
                  w-full p-4 rounded-lg text-white
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg hover:shadow-xl
                  transform hover:scale-105
                  flex flex-col items-center space-y-2
                `}
              >
                <span className="text-3xl">{info.icon}</span>
                <span className="font-bold text-sm">{info.title}</span>
                <span className="text-xs opacity-90">{info.phone}</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {info.description}
                </p>
                <button
                  onClick={() => handleDirectCall(service)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Direct Call: {info.phone}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-4 rounded-lg ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
        <div className="flex items-start space-x-2">
          <span className="text-lg">⚡</span>
          <div>
            <h3 className="font-semibold text-sm mb-1">
              {language === 'hi' ? 'त्वरित युक्तियाँ' :
               language === 'mr' ? 'त्वरित टिपा' :
               'Quick Tips'}
            </h3>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li>
                • {language === 'hi' ? 'बटन दबाकर तुरंत सहायता भेजें' :
                   language === 'mr' ? 'बटण दाबून तातडीची मदत पाठवा' :
                   'Tap button for immediate assistance'}
              </li>
              <li>
                • {language === 'hi' ? 'आवाज आदेशों के लिए "हेल्प" कहें' :
                   language === 'mr' ? 'आवाज आदेशांसाठी "मदत" म्हणा' :
                   'Say "Help" for voice commands'}
              </li>
              <li>
                • {language === 'hi' ? 'GPS स्थान सक्षम करें' :
                   language === 'mr' ? 'GPS स्थान सक्षम करा' :
                   'Enable GPS location'}
              </li>
              <li>
                • {language === 'hi' ? 'आपातकालीन नंबर सेव करें' :
                   language === 'mr' ? 'आणीबाणी क्रमांक जतन करा' :
                   'Save emergency numbers'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {disabled && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <p className="text-sm text-red-700 dark:text-red-300">
              {language === 'hi' ? 'स्थान की आवश्यकता है' :
               language === 'mr' ? 'स्थान आवश्यक आहे' :
               'Location required to activate emergency services'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}