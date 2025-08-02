import { useState, useEffect } from "react";

interface FacebookChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const FacebookChat = ({ isOpen, onClose }: FacebookChatProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isLoaded) {
      // Initialize Facebook Chat Plugin
      const script = document.createElement('script');
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      script.onload = () => {
        window.FB?.init({
          xfbml: true,
          version: 'v18.0'
        });
        setIsLoaded(true);
      };
      document.head.appendChild(script);

      // Add the chat plugin div
      const chatDiv = document.createElement('div');
      chatDiv.className = 'fb-customerchat';
      chatDiv.setAttribute('attribution', 'biz_inbox');
      chatDiv.setAttribute('page_id', '61561853557367'); // Your Facebook Page ID
      chatDiv.setAttribute('theme_color', '#000000');
      chatDiv.setAttribute('logged_in_greeting', 'Здравейте! Как можем да ви помогнем с нашите Ragdoll котки?');
      chatDiv.setAttribute('logged_out_greeting', 'Здравейте! Как можем да ви помогнем с нашите Ragdoll котки?');
      document.body.appendChild(chatDiv);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src*="xfbml.customerchat"]');
        if (existingScript) {
          existingScript.remove();
        }
        const existingChatDiv = document.querySelector('.fb-customerchat');
        if (existingChatDiv) {
          existingChatDiv.remove();
        }
      };
    }
  }, [isOpen, isLoaded]);

  useEffect(() => {
    if (isOpen && isLoaded && window.FB) {
      // Show the chat
      window.FB.CustomerChat.showDialog();
    }
  }, [isOpen, isLoaded]);

  return null;
};

export default FacebookChat; 