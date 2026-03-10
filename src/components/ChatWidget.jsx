import './ChatWidget.css';

export default function ChatWidget() {
  return (
    <div className="chat-widget-container">
      <div className="chat-widget">
        <div className="chat-message received">
          <p>Hi! Is this available?</p>
        </div>
        
        <div className="chat-message sent">
          <p>Yes 😊 Would you like pricing or a demo?</p>
        </div>
        
        <div className="chat-message received delay">
          <p>Book me a demo 🚀</p>
        </div>
      </div>
    </div>
  );
}
