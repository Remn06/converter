import { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '@/app/styles';
import { Translations } from '@/types';
import { haptics } from '@/utils/haptics';

interface EmployeeLoginScreenProps {
  t: Translations;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = '1234';

export default function EmployeeLoginScreen({
  t,
  onLoginSuccess,
  onBack,
}: EmployeeLoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleLogin = () => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === VALID_USERNAME && cleanPass === VALID_PASSWORD) {
      setHasError(false);
      haptics.success();
      Keyboard.dismiss();
      onLoginSuccess();
    } else {
      setHasError(true);
      haptics.error();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t.employeeLoginTitle}</Text>
        <Text style={styles.subtitle}>{t.employeeLoginSubtitle}</Text>

        <View style={styles.hintBox}>
          <Text style={styles.hintText}>{t.loginHint}</Text>
        </View>

        <Text style={styles.label}>{t.usernameLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.usernamePlaceholder}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (hasError) setHasError(false);
          }}
        />

        <Text style={styles.label}>{t.passwordLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.passwordPlaceholder}
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (hasError) setHasError(false);
          }}
          onSubmitEditing={handleLogin}
        />

        {hasError && <Text style={styles.errorText}>{t.loginError}</Text>}

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>{t.loginBtn}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => {
            haptics.selection();
            onBack();
          }}
        >
          <Text style={styles.secondaryButtonText}>{t.backBtn}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
