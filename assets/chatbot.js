/* chatbot.js - Luxury AI Chatbot Frontend Widget */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure container exists
  let root = document.getElementById('ifq-chatbot-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'ifq-chatbot-root';
    document.body.appendChild(root);
  }

  // State Variables
  let isOpen = false;
  let activeTone = 'elegant';
  let isTyping = false;
  let firstQuestionAsked = false;
  let chatHistory = [];

  // Welcome Messages for each tone (AI Concierge wording)
  const welcomeMessages = {
    elegant: "Welcome to the digital residence of Dr. Ishha Farha Quraishy. I am her AI Concierge, here to guide you with grace. How may I assist you today?",
    executive: "Systems online. Welcome to the professional portfolio hub of Dr. Ishha Farha Quraishy. I am her AI Concierge, here to assist you with details regarding IFQ Technologies, GEMS Education, AI, and Metaverse initiatives. What is your query?",
    inspirational: "Hello and welcome! It is a joy to connect with you. I am Dr. Ishha's AI Concierge, here to share her journey, achievements, and her mission for global peace and education. What inspires you today?",
    friendly: "Hi there! Welcome to Dr. Ishha's website. I'm her AI Concierge, ready to help you find whatever you need. Ask me anything about her pageants, tech projects, or how to get in touch!"
  };

  // Quick Reply Options
  const quickReplies = [
    "Who is Dr. Ishha?",
    "What is her tech experience?",
    "Tell me about her pageants",
    "How to collaborate?"
  ];

  // Helper: Format message text (Basic Markdown support for bold, italic, and links)
  function formatMessageText(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#c5a059; text-decoration:underline;">$1</a>');
    
    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  // Inject HTML Elements (Including Portrait Photo + AI Badge inside the FAB)
  root.innerHTML = `
    <!-- Floating Action Button (Portrait + AI badge) -->
    <button class="ifq-chatbot-fab" id="ifq-fab" aria-label="Open Chatbot">
      <!-- Portrait Image Container -->
      <div class="ifq-fab-avatar-container">
        <img src="/images/crown-blue-sash.png" class="ifq-fab-avatar" alt="Dr. Ishha Quraishy Portrait">
      </div>
      <!-- Corner AI Badge -->
      <div class="ifq-fab-ai-badge" title="Dr. Ishha's AI Concierge">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2c-.1 2.3-1.7 3.9-4 4 2.3.1 3.9 1.7 4 4 .1-2.3 1.7-3.9 4-4-2.3-.1-3.9-1.7-4-4z"/>
        </svg>
      </div>
    </button>

    <!-- Chat Window -->
    <div class="ifq-chatbot-window" id="ifq-window">
      <!-- Header -->
      <div class="ifq-chat-header">
        <div class="ifq-header-info">
          <div class="ifq-header-avatar">
            <!-- Spark / AI Icon in Avatar -->
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2c-.1 2.3-1.7 3.9-4 4 2.3.1 3.9 1.7 4 4 .1-2.3 1.7-3.9 4-4-2.3-.1-3.9-1.7-4-4z"/>
            </svg>
          </div>
          <div class="ifq-header-details">
            <h3 class="ifq-header-name">Dr. Ishha Farha</h3>
            <span class="ifq-header-status" id="ifq-status">
              <span id="ifq-status-text">Elegant AI Concierge</span>
            </span>
          </div>
        </div>
        <div class="ifq-header-actions">
          <!-- Settings Button -->
          <button class="ifq-header-btn" id="ifq-btn-settings" title="Change Personality Tone">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
          <!-- Close Button -->
          <button class="ifq-header-btn" id="ifq-btn-close" title="Close Chat">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Tone Settings Drawer -->
      <div class="ifq-tone-settings" id="ifq-tone-panel">
        <div class="ifq-tone-title">
          <span>AI Concierge Personality</span>
          <span style="color: #c5a059; font-size: 9px;">Demo Tone Selector</span>
        </div>
        <div class="ifq-tone-grid">
          <div class="ifq-tone-option is-selected" data-tone="elegant">
            <div class="ifq-tone-name">Elegant & Royal</div>
            <div class="ifq-tone-desc">Diplomatic, poetic, beauty-focused.</div>
          </div>
          <div class="ifq-tone-option" data-tone="executive">
            <div class="ifq-tone-name">Tech Executive</div>
            <div class="ifq-tone-desc">AI, Metaverse, business leadership.</div>
          </div>
          <div class="ifq-tone-option" data-tone="inspirational">
            <div class="ifq-tone-name">Inspirational</div>
            <div class="ifq-tone-desc">Resilience, night shifts, struggle.</div>
          </div>
          <div class="ifq-tone-option" data-tone="friendly">
            <div class="ifq-tone-name">Friendly & Warm</div>
            <div class="ifq-tone-desc">Conversational, helpful, direct.</div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="ifq-chat-messages" id="ifq-messages"></div>

      <!-- Quick Replies Area -->
      <div class="ifq-quick-replies" id="ifq-quick-replies"></div>

      <!-- Input Area -->
      <div class="ifq-chat-input-area">
        <input type="text" class="ifq-chat-input" id="ifq-input" placeholder="Ask about her pageants, tech career..." aria-label="Type message">
        <button class="ifq-send-btn" id="ifq-send" aria-label="Send message" disabled>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // DOM References
  const fab = document.getElementById('ifq-fab');
  const chatWindow = document.getElementById('ifq-window');
  const btnClose = document.getElementById('ifq-btn-close');
  const btnSettings = document.getElementById('ifq-btn-settings');
  const tonePanel = document.getElementById('ifq-tone-panel');
  const toneOptions = document.querySelectorAll('.ifq-tone-option');
  const messagesContainer = document.getElementById('ifq-messages');
  const quickRepliesContainer = document.getElementById('ifq-quick-replies');
  const inputField = document.getElementById('ifq-input');
  const btnSend = document.getElementById('ifq-send');
  const statusText = document.getElementById('ifq-status-text');

  // Toggle Chat Window
  function toggleChatWindow() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add('is-active');
      fab.style.transform = 'scale(0) rotate(90deg)'; // Hide FAB icon beautifully
      fab.style.opacity = '0';
      fab.style.pointerEvents = 'none';
      
      // If history is empty, add welcome message
      if (messagesContainer.children.length === 0) {
        showWelcomeMessage();
      }
      setTimeout(() => {
        if (!isTyping) {
          inputField.focus();
        }
      }, 300);
    } else {
      chatWindow.classList.remove('is-active');
      tonePanel.classList.remove('is-visible');
      fab.style.transform = 'scale(1) rotate(0deg)';
      fab.style.opacity = '1';
      fab.style.pointerEvents = 'auto';
    }
  }

  // Show Welcome Message based on Tone
  function showWelcomeMessage() {
    const text = welcomeMessages[activeTone];
    appendMessage('assistant', text, true);
  }

  // Toggle Settings Panel
  function toggleSettingsPanel() {
    tonePanel.classList.toggle('is-visible');
  }

  // Switch Tone
  function selectTone(tone) {
    if (activeTone === tone) return;
    activeTone = tone;
    
    // Update active class in UI
    toneOptions.forEach(opt => {
      if (opt.getAttribute('data-tone') === tone) {
        opt.classList.add('is-selected');
      } else {
        opt.classList.remove('is-selected');
      }
    });

    // Update Status Subtitle with AI Concierge phrasing
    const toneLabels = {
      elegant: "Elegant AI Concierge",
      executive: "Tech AI Concierge",
      inspirational: "Inspirational AI Concierge",
      friendly: "Friendly AI Concierge"
    };
    statusText.innerText = toneLabels[tone];

    // Hide Settings panel
    tonePanel.classList.remove('is-visible');

    // Add a system notification in the chat logs
    const sysMsg = document.createElement('div');
    sysMsg.className = 'ifq-msg-time';
    sysMsg.style.alignSelf = 'center';
    sysMsg.style.margin = '8px 0';
    sysMsg.style.color = 'var(--gold-primary)';
    sysMsg.style.opacity = '0.7';
    sysMsg.innerText = `— Switched Concierge tone to ${toneLabels[tone]} —`;
    messagesContainer.appendChild(sysMsg);
    scrollToBottom();

    // Trigger a fresh greeting in the new tone
    setTimeout(() => {
      appendMessage('assistant', welcomeMessages[tone], true);
    }, 400);
  }

  // Append Message with Optional Typewriter Effect
  function appendMessage(role, content, animate = false, onDone) {
    const msgItem = document.createElement('div');
    msgItem.className = `ifq-msg-item ifq-msg-${role === 'user' ? 'user' : 'bot'}`;

    const bubble = document.createElement('div');
    bubble.className = 'ifq-msg-bubble';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'ifq-msg-time';
    const now = new Date();
    timeSpan.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgItem.appendChild(bubble);
    msgItem.appendChild(timeSpan);
    messagesContainer.appendChild(msgItem);
    scrollToBottom();

    if (role === 'assistant' && animate) {
      let i = 0;
      bubble.innerHTML = '';
      
      const formattedHtml = formatMessageText(content);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedHtml;
      const textToType = tempDiv.innerText || tempDiv.textContent || content;

      function typeWriter() {
        if (i < textToType.length) {
          bubble.innerText = textToType.substring(0, i + 1);
          i++;
          scrollToBottom();
          setTimeout(typeWriter, 12);
        } else {
          bubble.innerHTML = formattedHtml;
          scrollToBottom();
          if (onDone) onDone();
        }
      }
      typeWriter();
    } else {
      bubble.innerHTML = formatMessageText(content);
      scrollToBottom();
      if (onDone) onDone();
    }

    // Save to local history
    if (!animate) {
      chatHistory.push({ role, content });
    } else if (role === 'assistant') {
      chatHistory.push({ role, content });
    }
  }

  // Scroll to Bottom of Messages Container
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show/Hide Typing Indicator
  function showTypingIndicator() {
    if (isTyping) return;
    isTyping = true;
    
    const indicator = document.createElement('div');
    indicator.className = 'ifq-msg-item ifq-msg-bot';
    indicator.id = 'ifq-typing';
    
    indicator.innerHTML = `
      <div class="ifq-msg-bubble" style="padding: 10px 14px;">
        <div class="ifq-typing-indicator">
          <span class="ifq-typing-dot"></span>
          <span class="ifq-typing-dot"></span>
          <span class="ifq-typing-dot"></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('ifq-typing');
    if (indicator) {
      indicator.remove();
    }
  }

  // Send Message Logic
  async function sendMessage(text) {
    if (!text || text.trim() === '') return;
    
    const message = text.trim();
    inputField.value = '';
    
    // Block any further inputs immediately (disable input & send button)
    isTyping = true;
    inputField.disabled = true;
    btnSend.disabled = true;
    inputField.placeholder = "AI Concierge is thinking...";

    // Hide suggestions container after the first question
    if (!firstQuestionAsked) {
      firstQuestionAsked = true;
      quickRepliesContainer.style.maxHeight = '0px';
      quickRepliesContainer.style.padding = '0px';
      quickRepliesContainer.style.opacity = '0';
      setTimeout(() => {
        quickRepliesContainer.style.display = 'none';
      }, 400);
    }

    // Append User Message
    appendMessage('user', message);

    // Show Typing Indicator
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          history: chatHistory,
          tone: activeTone
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      hideTypingIndicator();
      
      // Update placeholder to indicate typewriter active
      inputField.placeholder = "AI Concierge is typing...";

      // Append bot response with typewriter animation, enabling input only upon completion
      appendMessage('assistant', data.reply, true, () => {
        isTyping = false;
        inputField.disabled = false;
        inputField.placeholder = "Ask about her pageants, tech career...";
        btnSend.disabled = inputField.value.trim() === '';
        inputField.focus();
      });

    } catch (error) {
      console.error("Chat error:", error);
      hideTypingIndicator();
      appendMessage('assistant', "I apologize, but I encountered an error establishing communication. Please verify that the local server is running or check the connection.", true, () => {
        isTyping = false;
        inputField.disabled = false;
        inputField.placeholder = "Ask about her pageants, tech career...";
        btnSend.disabled = inputField.value.trim() === '';
      });
    }
  }

  // Render Quick Replies
  function renderQuickReplies() {
    quickRepliesContainer.innerHTML = '';
    quickReplies.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'ifq-reply-chip';
      chip.innerText = text;
      chip.addEventListener('click', () => {
        if (!isTyping) {
          sendMessage(text);
        }
      });
      quickRepliesContainer.appendChild(chip);
    });
  }

  // Event Listeners
  fab.addEventListener('click', toggleChatWindow);
  btnClose.addEventListener('click', toggleChatWindow);
  btnSettings.addEventListener('click', toggleSettingsPanel);

  // Close when clicking outside on mobile or closing elements
  document.addEventListener('click', (e) => {
    if (isOpen && !chatWindow.contains(e.target) && !fab.contains(e.target)) {
      toggleChatWindow();
    }
  });

  // Switch Tone Options
  toneOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      if (!isTyping) {
        const tone = opt.getAttribute('data-tone');
        selectTone(tone);
      }
    });
  });

  // Input Field validation
  inputField.addEventListener('input', () => {
    btnSend.disabled = inputField.value.trim() === '' || isTyping;
  });

  // Keyboard Enter Submit
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isTyping) {
      sendMessage(inputField.value);
    }
  });

  btnSend.addEventListener('click', () => {
    if (!isTyping) {
      sendMessage(inputField.value);
    }
  });

  // Prevent touchpad scroll event propagation to the main window (blocking smooth scroll libraries like Lenis)
  chatWindow.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });

  chatWindow.addEventListener('touchmove', (e) => {
    e.stopPropagation();
  });

  // Initialize
  renderQuickReplies();
});
