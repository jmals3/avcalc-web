import React, { useState } from 'react';
import './ChatSidePane.css';

const ChatSidePane = () => {
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        // Handle sending the message
        console.log('Message sent:', message);
        setMessage('');
    };

    return (
        <div className="chat-side-pane">
            <div className="chat-header">Chat</div>
            <div className="chat-body">
                {/* Chat messages will be displayed here */}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatSidePane;