import { useEffect, useRef, useState } from 'react';
import { Button, Keyboard, ScrollView, Text, TextInput, View } from 'react-native';
import styles from '@/app/styles';
import PackList from '@/components/PackList';
import { useStoredData } from '@/hooks/useStoredData';
import { Pack, Translations } from '@/types';
import { haptics } from '@/utils/haptics';

const DEFAULT_PACKS: Pack[] = [
  { id: '1', name: 'Standard 100x50cm', totalThickness: 60, sheetArea: 0.5 },
  { id: '2', name: 'PNP', totalThickness: 40, sheetArea: 0.65886 },
];

const mergeWithDefaultPacks = (parsedPacks: Pack[]): Pack[] => {
  const customPacks = parsedPacks
    .filter((pack) => pack.id !== '1' && pack.id !== '2')
    .map((pack) => ({ ...pack, sheetArea: pack.sheetArea || 0.5 }));
  return [...DEFAULT_PACKS, ...customPacks];
};

interface StyrofoamScreenProps {
  t: Translations;
}

export default function StyrofoamScreen({ t }: StyrofoamScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);

  const [packs, setPacks] = useStoredData<Pack[]>(
    '@saved_packs',
    DEFAULT_PACKS,
    mergeWithDefaultPacks
  );
  const [selectedPack, setSelectedPack] = useState<Pack>(DEFAULT_PACKS[0]);
  const [sheetThickness, setSheetThickness] = useState('');
  const [sheetsNeeded, setSheetsNeeded] = useState('');
  const [areaNeeded, setAreaNeeded] = useState('');
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customPackThickness, setCustomPackThickness] = useState('');
  const [customLength, setCustomLength] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const getPackName = (pack: Pack) => (pack.id === '1' ? t.defaultStyrofoamName : pack.name);

  const resetCustomForm = () => {
    setEditingPackId(null);
    setCustomName('');
    setCustomPackThickness('');
    setCustomLength('');
    setCustomHeight('');
  };

  const startEditingPack = (pack: Pack) => {
    setEditingPackId(pack.id);
    setCustomName(pack.name);
    setCustomPackThickness(pack.totalThickness.toString());
    const length = pack.sheetLength ?? 100;
    const height = pack.sheetHeight ?? Math.round((pack.sheetArea * 10000) / length);
    setCustomLength(length.toString());
    setCustomHeight(height.toString());

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      nameInputRef.current?.focus();
    }, 100);
  };

  const savePack = () => {
    const packThickness = parseFloat(customPackThickness);
    const length = parseFloat(customLength);
    const height = parseFloat(customHeight);

    if (packThickness > 0 && length > 0 && height > 0 && customName !== '') {
      const calculatedArea = (length * height) / 10000;

      if (editingPackId) {
        const updatedPack: Pack = {
          id: editingPackId,
          name: customName,
          totalThickness: packThickness,
          sheetArea: calculatedArea,
          sheetLength: length,
          sheetHeight: height,
        };
        const updatedPacks = packs.map((p) => (p.id === editingPackId ? updatedPack : p));
        setPacks(updatedPacks);
        setSelectedPack(updatedPack);
      } else {
        const newPack: Pack = {
          id: Date.now().toString(),
          name: customName,
          totalThickness: packThickness,
          sheetArea: calculatedArea,
          sheetLength: length,
          sheetHeight: height,
        };
        const updatedPacks = [...packs, newPack];
        setPacks(updatedPacks);
        setSelectedPack(newPack);
      }

      resetCustomForm();
      haptics.success();
      Keyboard.dismiss();
    } else {
      haptics.error();
    }
  };

  const deletePack = (idToDelete: string) => {
    if (idToDelete === '1' || idToDelete === '2') return;
    const updatedPacks = packs.filter((pack) => pack.id !== idToDelete);
    setPacks(updatedPacks);
    if (selectedPack.id === idToDelete) setSelectedPack(updatedPacks[0]);
    if (editingPackId === idToDelete) resetCustomForm();
  };

  const sheet = parseFloat(sheetThickness);
  const styrofoamArea = parseFloat(areaNeeded);
  let needed = parseInt(sheetsNeeded) || 0;
  let calculatedSheetsFromArea = 0;

  if (styrofoamArea > 0 && selectedPack.sheetArea > 0) {
    needed = Math.ceil(styrofoamArea / selectedPack.sheetArea);
    calculatedSheetsFromArea = needed;
  }

  let sheetsPerPack = 0;
  let styrofoamResultText = '';

  if (sheet > 0) {
    sheetsPerPack = Math.floor(selectedPack.totalThickness / sheet);
    if (needed > 0 && sheetsPerPack > 0) {
      const fullPacks = Math.floor(needed / sheetsPerPack);
      const leftoverSheets = needed % sheetsPerPack;

      if (fullPacks > 0 && leftoverSheets > 0) {
        styrofoamResultText = t.resultPacksAndSheets(fullPacks, leftoverSheets);
      } else if (fullPacks > 0 && leftoverSheets === 0) {
        styrofoamResultText = t.resultPacks(fullPacks);
      } else {
        styrofoamResultText = t.resultSheets(leftoverSheets);
      }
    }
  }

  useEffect(() => {
    if (styrofoamResultText || calculatedSheetsFromArea > 0) {
      haptics.light();
    }
  }, [styrofoamResultText, calculatedSheetsFromArea]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t.titleStyrofoam}</Text>

        <Text style={styles.label}>{t.selectConverter}</Text>
        <PackList
          items={packs}
          selectedId={selectedPack.id}
          onSelect={setSelectedPack}
          onEdit={startEditingPack}
          onDelete={deletePack}
          getLabel={(pack) => `${getPackName(pack)} (${pack.totalThickness}cm, ${pack.sheetArea}m²)`}
          isDeletable={(pack) => pack.id !== '1' && pack.id !== '2'}
        />

        <Text style={styles.label}>{t.singleSheetThickness}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.eg5}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={sheetThickness}
          onChangeText={setSheetThickness}
        />

        <Text style={styles.label}>{t.totalArea}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.eg100}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={areaNeeded}
          onChangeText={(text) => {
            setAreaNeeded(text);
            setSheetsNeeded('');
          }}
        />

        <Text style={styles.label}>{t.orExactSheets}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.eg30}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={sheetsNeeded}
          onChangeText={(text) => {
            setSheetsNeeded(text);
            setAreaNeeded('');
          }}
        />

        <View style={styles.resultContainer}>
          <Text style={styles.resultPrimary}>
            {sheetsPerPack > 0 ? `${t.sheetsPerPack} ${sheetsPerPack}` : t.enterThickness}
          </Text>

          {calculatedSheetsFromArea > 0 && sheetsPerPack === 0 && (
            <View style={styles.packsResultBox}>
              <Text style={styles.resultTertiary}>{t.toCoverArea(styrofoamArea)}</Text>
              <Text style={styles.resultSecondary}>
                {calculatedSheetsFromArea} {t.totalSheets}
              </Text>
              <Text style={styles.resultTertiary}>{t.enterThicknessHint}</Text>
            </View>
          )}

          {sheetsPerPack > 0 && needed > 0 && (
            <View style={styles.packsResultBox}>
              <Text style={styles.resultTertiary}>
                {calculatedSheetsFromArea > 0
                  ? t.toCoverAreaTotal(styrofoamArea, calculatedSheetsFromArea)
                  : t.youNeedExactly}
              </Text>
              <Text style={styles.resultSecondary}>{styrofoamResultText}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{editingPackId ? t.editCustomPack : t.addCustomPack}</Text>
        <TextInput
          ref={nameInputRef}
          style={styles.input}
          placeholder={t.profileNameHolder}
          placeholderTextColor="#999"
          value={customName}
          onChangeText={setCustomName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.packThicknessHolder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={customPackThickness}
          onChangeText={setCustomPackThickness}
        />
        <TextInput
          style={styles.input}
          placeholder={t.sheetLengthHolder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={customLength}
          onChangeText={setCustomLength}
        />
        <TextInput
          style={styles.input}
          placeholder={t.sheetWidthHolder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={customHeight}
          onChangeText={setCustomHeight}
        />
        <Button
          title={editingPackId ? t.updatePackBtn : t.savePackBtn}
          onPress={savePack}
          color="#007AFF"
        />
        {editingPackId && (
          <View style={styles.cancelButtonWrapper}>
            <Button title={t.cancelEditBtn} onPress={resetCustomForm} color="#888" />
          </View>
        )}
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
