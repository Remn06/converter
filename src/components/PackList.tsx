import { Text, TouchableOpacity, View } from 'react-native';
import styles from '@/app/styles';
import { haptics } from '@/utils/haptics';

interface PackListProps<T extends { id: string }> {
  items: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  onDelete: (id: string) => void;
  getLabel: (item: T) => string;
  isDeletable: (item: T) => boolean;
}

export default function PackList<T extends { id: string }>({
  items,
  selectedId,
  onSelect,
  onDelete,
  getLabel,
  isDeletable,
}: PackListProps<T>) {
  return (
    <View style={styles.packList}>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <View key={item.id} style={[styles.packWrapper, isSelected && styles.activePackWrapper]}>
            <TouchableOpacity
              style={styles.packButton}
              onPress={() => {
                haptics.selection();
                onSelect(item);
              }}
            >
              <Text style={[styles.packButtonText, isSelected && styles.activePackButtonText]}>
                {getLabel(item)}
              </Text>
            </TouchableOpacity>
            {isDeletable(item) && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  haptics.medium();
                  onDelete(item.id);
                }}
              >
                <Text style={[styles.deleteButtonText, isSelected && styles.activeDeleteButtonText]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}
