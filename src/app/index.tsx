import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import PaintScreen from '@/components/PaintScreen';
import StyrofoamScreen from '@/components/StyrofoamScreen';
import { dict } from '@/constants/translations';
import { useStoredData } from '@/hooks/useStoredData';
import { Language } from '@/types';
import { haptics } from '@/utils/haptics';
import styles from './styles';

type Tab = 'styrofoam' | 'paint';

export default function App() {
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<Tab>('styrofoam');
  const [language, setLanguage] = useStoredData<Language>(
    '@language',
    'en',
    (saved) => (saved === 'en' || saved === 'uk' ? saved : 'en')
  );

  const t = dict[language];

  const toggleLanguage = () => {
    haptics.selection();
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  const handleTabPress = (tab: Tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const pageIndex = tab === 'styrofoam' ? 0 : 1;
      pagerRef.current?.scrollTo({ x: pageIndex * width, animated: true });
    }
  };

  const handleSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    const nextTab: Tab = pageIndex === 1 ? 'paint' : 'styrofoam';
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- TOP HEADER W/ LANGUAGE TOGGLE --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>{t.langToggle}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'styrofoam' && styles.activeTabButton]}
          onPress={() => handleTabPress('styrofoam')}
        >
          <Text style={[styles.tabText, activeTab === 'styrofoam' && styles.activeTabText]}>
            {t.styrofoamTab}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'paint' && styles.activeTabButton]}
          onPress={() => handleTabPress('paint')}
        >
          <Text style={[styles.tabText, activeTab === 'paint' && styles.activeTabText]}>
            {t.paintTab}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSwipeEnd}
        keyboardDismissMode="on-drag"
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ width, flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <StyrofoamScreen t={t} />
          <View style={{ height: 50 }} />
        </ScrollView>

        <ScrollView
          style={{ width, flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <PaintScreen t={t} />
          <View style={{ height: 50 }} />
        </ScrollView>
      </ScrollView>
    </View>
  );
}