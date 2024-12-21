import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { login } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export default function LoginScreen() {
  const { navigate } = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigate('Chat');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setIsLoading(true);
      setError(null);
      const response: LoginResponse = await login({ email, password });
      
      if (response.success && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        navigate('Chat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.titleText}>Welcome</Text>
          <Text style={styles.subtitleText}>Please login to continue</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            style={[
              styles.button,
              (isLoading || !email || !password) && styles.buttonDisabled
            ]}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});