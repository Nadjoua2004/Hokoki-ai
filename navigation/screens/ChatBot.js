import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const HokokiAI = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour ! Je suis Hokoki AI, votre assistant juridique. Comment puis-je vous aider ?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://votre-url-ngrok.ngrok.io/ask');

  const quickQuestions = [
    'Ai-je droit à un congé maladie payé ?',
    'Quels sont mes droits en tant que salarié en Algérie ?'
  ];

  const fetchAIResponse = async (question) => {
    setLoading(true);
    try {
      const response = await axios.post(apiEndpoint, {
        questions: [question] // L'API attend un tableau de questions
      });
      
      return response.data.results[0].answer;
    } catch (error) {
      console.error('Erreur API:', error);
      return "Désolé, je n'ai pas pu obtenir de réponse. Veuillez réessayer plus tard.";
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      // Ajouter le message utilisateur
      const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      
      // Obtenir la réponse du bot
      const botResponse = await fetchAIResponse(inputText);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot'
      }]);
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