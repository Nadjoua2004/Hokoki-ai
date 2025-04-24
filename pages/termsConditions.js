import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By using Hokokiai, you agree to be bound by these terms. If you do not agree, please do not use our service.
      </Text>

      <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
      <Text style={styles.paragraph}>
        You are responsible for the content you post and must ensure it's respectful, legal, and truthful.
      </Text>

      <Text style={styles.sectionTitle}>3. Honesty of Reports</Text>
      <Text style={styles.paragraph}>
        All reports submitted through Hokokiai must be based on facts. False or misleading claims are not allowed.
      </Text>

      <Text style={styles.sectionTitle}>4. No Harassment</Text>
      <Text style={styles.paragraph}>
        Users are prohibited from using Hokokiai to insult, harass, or defame others.
      </Text>

      <Text style={styles.sectionTitle}>5. Respect for Privacy</Text>
      <Text style={styles.paragraph}>
        You must not share personal or sensitive data of other individuals without their consent.
      </Text>

      <Text style={styles.sectionTitle}>6. Content Moderation</Text>
      <Text style={styles.paragraph}>
        We reserve the right to review and remove content that violates our terms or community standards.
      </Text>

      <Text style={styles.sectionTitle}>7. Account Suspension</Text>
      <Text style={styles.paragraph}>
        Accounts violating our terms may be suspended or permanently removed.
      </Text>

      <Text style={styles.sectionTitle}>8. Governing Law</Text>
      <Text style={styles.paragraph}>
        These terms are governed by the laws of Algeria. Any disputes shall be resolved in local courts.
      </Text>
      <Text style={styles.footer}>Last updated: April 21, 2025</Text>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop:20,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: '#444',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    color: '#555',
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: '#030000',
    textAlign: 'center',
  },
});

export default TermsAndConditionsScreen;
