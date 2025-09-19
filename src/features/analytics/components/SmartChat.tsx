// src/features/analytics/components/SmartChat.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mic,
  MicOff,
  Send,
  Loader2,
  Bot,
  User,
  MessageSquare,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Brain
} from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface SmartChatProps {
  messages: ChatMessage[];
  inputMessage: string;
  isListening: boolean;
  isLoading: boolean;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleListening: () => void;
  userProfile?: any;
  className?: string;
}

export const SmartChat: React.FC<SmartChatProps> = ({
  messages,
  inputMessage,
  isListening,
  isLoading,
  onInputChange,
  onSendMessage,
  onToggleListening,
  userProfile,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus sur l'input au chargement
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSendMessage();
      }
      if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        onToggleListening();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      return () => inputElement.removeEventListener('keydown', handleKeyDown);
    }
    
    return undefined; // Return explicite pour tous les chemins
  }, [onSendMessage, onToggleListening]);

  // Synthèse vocale pour les réponses IA
  const speakMessage = (text: string) => {
    if (!isSpeechEnabled) return;
    
    // Supprimer les emojis pour une meilleure synthèse vocale
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Arrêter toute lecture en cours
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageIcon = (type: 'ai' | 'user') => {
    return type === 'ai' ? (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Bot className="h-4 w-4" />
      </div>
    ) : (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
        <User className="h-4 w-4" />
      </div>
    );
  };

  const quickActions = [
    { text: "Mon programme d'aujourd'hui", emoji: "📅" },
    { text: "Comment améliorer ma récupération ?", emoji: "😴" },
    { text: "Conseils nutrition", emoji: "🥗" },
    { text: "Créer un workout", emoji: "💪" },
  ];

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Coach IA</span>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className="h-8"
            >
              {isSpeechEnabled ? (
                <Volume2 className="h-3 w-3" />
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
            </Button>
            
            <Badge variant="outline" className="text-xs">
              {messages.length} messages
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0">
        
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Salut {userProfile?.username?.split(' ')[0] || 'Champion'} !</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Je suis ton coach IA personnel. Pose-moi des questions sur ton entraînement, 
                  ta nutrition, ou demande-moi des conseils personnalisés !
                </p>
              </div>
              
              {/* Actions rapides */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onInputChange(action.text)}
                    className="text-xs h-auto p-2 flex items-center space-x-1"
                  >
                    <span>{action.emoji}</span>
                    <span>{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {getMessageIcon(message.type)}
                  
                  <div className={`flex flex-col space-y-1 max-w-[80%] ${
                    message.type === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    <div className={`rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {message.content}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </span>
                      
                      {message.type === 'ai' && isSpeechEnabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  {getMessageIcon('ai')}
                  <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Le coach réfléchit...</span>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t bg-background p-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
                placeholder="Pose-moi une question sur ton entraînement..."
                disabled={isLoading}
                className="pr-12"
              />
              
              {/* Indicateur de reconnaissance vocale */}
              {isListening && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse delay-75"></div>
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleListening}
              disabled={isLoading}
              className={`${isListening ? 'bg-red-100 border-red-300' : ''}`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={onSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Conseils d'utilisation */}
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <span>Appuie sur </span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Entrée</kbd>
            <span> pour envoyer • </span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>
            <span> + </span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Espace</kbd>
            <span> pour parler</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartChat;