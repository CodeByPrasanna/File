'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VOICE_COMMANDS } from '@/lib/constants';

interface VoiceActivationProps {
  isActive: boolean;
  onCommandDetected: (command: string, detected: boolean) => void;
  language: 'en' | 'hi' | 'mr';
  className?: string;
}

export function VoiceActivation({ isActive, onCommandDetected, language, className = '' }: VoiceActivationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError('');
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            currentTranscript += transcript + ' ';
          }

          setTranscript(currentTranscript.trim());

          // Check for emergency commands if we have a final result
          if (event.results[event.results.length - 1].isFinal) {
            checkForEmergencyCommand(currentTranscript.toLowerCase());
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError(`Microphone error: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Restart listening if still active
          if (isActive) {
            setTimeout(() => {
              if (isActive && permissionGranted) {
                startListening();
              }
            }, 1000);
          }
        };

        recognitionRef.current = recognition;

        // Check permission status
        navigator.permissions.query({ name: 'microphone' as PermissionName })
          .then((result) => {
            setPermissionGranted(result.state === 'granted');
            result.onchange = () => {
              setPermissionGranted(result.state === 'granted');
            };
          })
          .catch(() => {
            setPermissionGranted(null);
          });
      } else {
        setError('Speech recognition not supported in your browser');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const checkForEmergencyCommand = useCallback((transcript: string) => {
    const commands = VOICE_COMMANDS[language];
    let commandDetected = false;
    let detectedCommand = '';

    // Check SOS commands first
    for (const command of commands.sos) {
      if (transcript.includes(command)) {
        commandDetected = true;
        detectedCommand = transcript;
        break;
      }
    }

    // Check specific emergency commands if no SOS detected
    if (!commandDetected) {
      for (const [service, serviceCommands] of Object.entries(commands)) {
        if (service !== 'sos') {
          for (const command of serviceCommands) {
            if (transcript.includes(command)) {
              commandDetected = true;
              detectedCommand = transcript;
              break;
            }
          }
          if (commandDetected) break;
        }
      }
    }

    if (commandDetected) {
      onCommandDetected(detectedCommand, true);
      // Clear transcript after detection
      setTranscript('');
    }
  }, [language, onCommandDetected]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && permissionGranted) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [permissionGranted]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (permissionGranted) {
        startListening();
      } else {
        // Request permission
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setPermissionGranted(true);
            startListening();
          })
          .catch((error) => {
            setError('Microphone access denied. Please allow microphone access to use voice commands.');
            console.error('Microphone access denied:', error);
          });
      }
    }
  }, [isListening, permissionGranted, startListening, stopListening]);

  // Auto-start when isActive changes to true
  useEffect(() => {
    if (isActive && permissionGranted && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive, permissionGranted, isListening, startListening, stopListening]);

  const getButtonText = () => {
    if (permissionGranted === false) {
      return '🎤 Enable Microphone';
    }
    if (isListening) {
      return '🔴 Listening...';
    }
    return '🎤 Start Voice Commands';
  };

  const getButtonColor = () => {
    if (permissionGranted === false) {
      return 'bg-gray-500 hover:bg-gray-600';
    }
    if (isListening) {
      return 'bg-red-600 hover:bg-red-700 animate-pulse';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={toggleListening}
          disabled={!isActive && permissionGranted !== false}
          className={`
            ${getButtonColor()}
            px-6 py-3 rounded-full text-white font-semibold
            transition-all duration-200 shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center space-x-2
          `}
        >
          <span className="text-lg">{getButtonText().split(' ')[0]}</span>
          <span>{getButtonText().split(' ').slice(1).join(' ')}</span>
        </button>

        {isListening && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span>Voice assistant is active</span>
          </div>
        )}

        {transcript && (
          <div className="max-w-md mx-auto p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">You said:</p>
            <p className="text-base font-medium">"{transcript}"</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Voice Commands Reference */}
      <div className="max-w-md mx-auto">
        <h3 className="text-sm font-semibold mb-2">Voice Commands:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
            <div className="font-medium">Emergency:</div>
            <div className="opacity-75">"Help", "Emergency", "SOS"</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
            <div className="font-medium">Ambulance:</div>
            <div className="opacity-75">"Ambulance", "Medical"</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
            <div className="font-medium">Police:</div>
            <div className="opacity-75">"Police", "Security"</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
            <div className="font-medium">Fire:</div>
            <div className="opacity-75">"Fire", "Burning"</div>
          </div>
        </div>
      </div>
    </div>
  );
}