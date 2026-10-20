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

interface MakeOrderScreenProps {
  t: Translations;
  draftItems: string;
  setDraftItems: (value: string) => void;
  onSubmitOrder: (clientName: string, phone: string, items: string) => void;
}

export default function MakeOrderScreen({
  t,
  draftItems,
  setDraftItems,
  onSubmitOrder,
}: MakeOrderScreenProps) {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasError, setHasError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const cleanName = clientName.trim();
    const cleanPhone = phone.trim();
    const cleanItems = draftItems.trim();

    if (!cleanName || !cleanPhone || !cleanItems) {
      setHasError(true);
      setShowSuccess(false);
      haptics.error();
      return;
    }

    setHasError(false);
    setShowSuccess(true);
    haptics.success();
    Keyboard.dismiss();

    onSubmitOrder(cleanName, cleanPhone, cleanItems);
    setDraftItems('');
  };

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>{t.makeOrderTitle}</Text>

        {showSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{t.orderSuccessMsg}</Text>
          </View>
        )}

        <Text style={styles.label}>{t.clientNameLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.clientNamePlaceholder}
          placeholderTextColor="#999"
          value={clientName}
          onChangeText={(text) => {
            setClientName(text);
            if (hasError) setHasError(false);
            if (showSuccess) setShowSuccess(false);
          }}
        />

        <Text style={styles.label}>{t.clientPhoneLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.clientPhonePlaceholder}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (hasError) setHasError(false);
            if (showSuccess) setShowSuccess(false);
          }}
        />

        <Text style={styles.label}>{t.orderDetailsLabel}</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.orderDetailsPlaceholder}
          placeholderTextColor="#999"
          multiline
          value={draftItems}
          onChangeText={(text) => {
            setDraftItems(text);
            if (hasError) setHasError(false);
            if (showSuccess) setShowSuccess(false);
          }}
        />

        {hasError && <Text style={styles.errorText}>{t.orderFormError}</Text>}

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.primaryButtonText}>{t.submitOrderBtn}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
