import { Text, TouchableOpacity, View } from 'react-native';
import styles from '@/app/styles';
import { Translations } from '@/types';
import { haptics } from '@/utils/haptics';

interface RoleSelectionScreenProps {
  t: Translations;
  onSelectClient: () => void;
  onSelectEmployee: () => void;
}

export default function RoleSelectionScreen({
  t,
  onSelectClient,
  onSelectEmployee,
}: RoleSelectionScreenProps) {
  return (
    <View style={styles.centeredContent}>
      <View style={styles.card}>
        <Text style={styles.title}>{t.welcomeTitle}</Text>
        <Text style={styles.subtitle}>{t.welcomeSubtitle}</Text>

        <TouchableOpacity
          style={styles.roleOptionCard}
          activeOpacity={0.8}
          onPress={() => {
            haptics.selection();
            onSelectClient();
          }}
        >
          <Text style={styles.roleOptionTitle}>{t.iAmClient}</Text>
          <Text style={styles.roleOptionDesc}>{t.iAmClientDesc}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleOptionCard, styles.roleOptionCardSecondary]}
          activeOpacity={0.8}
          onPress={() => {
            haptics.selection();
            onSelectEmployee();
          }}
        >
          <Text style={styles.roleOptionTitle}>{t.iAmEmployee}</Text>
          <Text style={styles.roleOptionDesc}>{t.iAmEmployeeDesc}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
