/*import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const HokokiAI = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I\'m Hokoki AI. How can I help you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'Do I have the right to paid sick leave?',
    'What are my rights as an employee in Algeria?'
  ];

  const handleSend = async () => {
    if (inputText.trim()) {
      // Add user message to the chat
      setMessages(prev => [...prev, { id: Date.now().toString(), text: inputText, sender: 'user' }]);

      try {
        // Send the user's question to the FastAPI backend using fetch
        const response = await fetch('https://your-ngrok-url/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questions: [inputText] }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();

        // Add bot response to the chat
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: responseData.results[0].answer,
          sender: 'bot'
        }]);
      } catch (error) {
        console.error(error);
        // Handle error and add an error message to the chat
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I couldn't process your request.",
          sender: 'bot'
        }]);
      }

      setInputText('');
    }
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/BotLogo.png')} style={styles.logo} />
        <Text style={styles.title}>Your AI-powered legal assistant</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      
      <View style={styles.quickQuestions}>
        {quickQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickQuestion}
            onPress={() => handleQuickQuestion(question)}
          >
            <Text style={styles.quickQuestionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e2e2',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    flexDirection: 'row',
    color:"#a6a2a2",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: {
    paddingBottom: 18,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F9FF',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  messageText: {
    fontSize: 14,
  },
  quickQuestions: {
    marginBottom: 16,
  },
  quickQuestion: {
    backgroundColor: '#E5F0FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5F0FF',
  },
  quickQuestionText: {
    color: '#050606',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HokokiAI;
*/





import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const HokokiAI = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I\'m Hokoki AI. How can I help you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'Do I have the right to paid sick leave?',
    
    'What are my rights as an employee in Algeria?'
  ];

  const handleSend = () => {
    if (inputText.trim()) {
    
      setMessages(prev => [...prev, { id: Date.now().toString(), text: inputText, sender: 'user' }]);
      
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          text: `response to: "${inputText}"`, 
          sender: 'bot' 
        }]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
    
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Image source={require('../../assets/BotLogo.png')} style={styles.logo} />
        <Text style={styles.title}>Your AI-powered legal assistant</Text>
      </View>

     
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Quick questions */}
      <View style={styles.quickQuestions}>
        {quickQuestions.map((question, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.quickQuestion}
            onPress={() => handleQuickQuestion(question)}
          >
            <Text style={styles.quickQuestionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e2e2',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    flexDirection: 'row',
    color:"#a6a2a2", 
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: {
    paddingBottom: 18,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F9FF',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  messageText: {
    fontSize: 14,
  },
  quickQuestions: {
    marginBottom: 16,
  },
  quickQuestion: {
    backgroundColor: '#E5F0FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5F0FF',
  },
  quickQuestionText: {
    color: '#050606',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HokokiAI;