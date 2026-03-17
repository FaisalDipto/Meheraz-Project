import React from 'react';
import { useWidget } from '../context/WidgetContext';
import './ChatWidget.css';

export default function ChatWidget() {
  const { widgetColor, widgetGreeting, widgetPosition } = useWidget();

  return (
    <div 
      className="chat-widget-container" 
      style={{
        // A subtle hint of the position setting even when inline in the Hero
        transform: widgetPosition === 'bottom-left' ? 'translateX(-5%)' : 'translateX(5%)',
        transition: 'transform 0.3s ease'
      }}
    >
      <div className="chat-widget">
        <div className="chat-message received">
          <p>{widgetGreeting}</p>
        </div>
        
        <div 
          className="chat-message sent"
          style={{ background: `linear-gradient(90deg, ${widgetColor} 0%, ${widgetColor}dd 100%)`, color: '#fff' }}
        >
          <p>Yes 😊 Would you like pricing or a demo?</p>
        </div>
        
        <div className="chat-message received delay">
          <p>Book me a demo 🚀</p>
        </div>
      </div>
    </div>
  );
}
