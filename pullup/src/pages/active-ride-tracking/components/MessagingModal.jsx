import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const MessagingModal = ({ isOpen, onClose, currentMode, tripData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickMessages = [
    "I\'m on my way",
    "Running 5 minutes late",
    "I\'m here",
    "Thank you!",
    "Where are you?",
    "Almost there"
  ];

  useEffect(() => {
    if (isOpen) {
      // Initialize with some mock messages
      const initialMessages = [
        {
          id: 1,
          sender: currentMode === 'rider' ? 'driver' : 'passenger',
          text: currentMode === 'rider' ? "Hi! I'm your driver John. I'll be there in 3 minutes." : "Hi! I'm Sarah, your passenger. I'll be ready at the pickup location.",
          timestamp: new Date(Date.now() - 300000),
          isSystem: false
        },
        {
          id: 2,
          sender: 'system',
          text: `${currentMode === 'rider' ? 'Driver' : 'Passenger'} is approaching pickup location`,
          timestamp: new Date(Date.now() - 120000),
          isSystem: true
        }
      ];
      setMessages(initialMessages);
    }
  }, [isOpen, currentMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
      isSystem: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Got it, thanks!",
        "Sounds good!",
        "On my way!",
        "Perfect, see you soon!",
        "Thanks for letting me know!"
      ];
      const response = {
        id: Date.now() + 1,
        sender: currentMode === 'rider' ? 'driver' : 'passenger',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isSystem: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleQuickMessage = (message) => {
    handleSendMessage(message);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-surface rounded-lg shadow-modal max-w-md w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={currentMode === 'rider' 
                  ? tripData?.driver?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
                  : tripData?.passenger?.avatar || "https://randomuser.me/api/portraits/women/44.jpg"
                }
                alt={currentMode === 'rider' ? 'Driver' : 'Passenger'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">
                {currentMode === 'rider' ? tripData?.driver?.name ||'John Smith' : tripData?.passenger?.name ||'Sarah Johnson'
                }
              </h2>
              <p className="text-sm text-text-secondary">
                {currentMode === 'rider' ? 'Your Driver' : 'Your Passenger'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } ${message.isSystem ? 'justify-center' : ''}`}
            >
              {message.isSystem ? (
                <div className="bg-surface-secondary rounded-lg px-3 py-2 max-w-xs">
                  <p className="text-xs text-text-secondary text-center">{message.text}</p>
                  <p className="text-xs text-text-muted text-center mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              ) : (
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 ${
                    message.sender === 'user' ?'bg-primary text-primary-foreground' :'bg-surface-secondary text-text-primary'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ?'text-primary-foreground opacity-70' :'text-text-muted'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-secondary rounded-lg px-3 py-2 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages */}
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickMessages.slice(0, 4).map((message, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(message)}
                className="text-xs p-2 bg-surface-secondary rounded-lg hover:bg-border-muted transition-colors duration-fast text-left"
              >
                {message}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim()}
              iconName="Send"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModal;