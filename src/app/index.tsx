import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

// --- TYPES ---
type Language = 'en' | 'uk';

interface Pack {
  id: string;
  name: string;
  totalThickness: number;
  sheetArea: number;
}

interface Bucket {
  id: string;
  name: string;
  kg: number;
  coverageArea: number;
}

// --- TRANSLATION DICTIONARY ---
const dict = {
  en: {
    styrofoamTab: 'Styrofoam',
    paintTab: 'Buckets',
    titleStyrofoam: 'Styrofoam Calculator',
    titlePaint: 'Buckets Calculator',
    selectConverter: 'Select Converter:',
    selectBucket: 'Select Bucket Type:',
    singleSheetThickness: 'Single Sheet Thickness (cm):',
    totalArea: 'Total Area to Cover (m²):',
    orExactSheets: 'OR exact sheets needed:',
    enterThickness: 'Enter sheet thickness',
    sheetsPerPack: 'Sheets per pack:',
    toCoverArea: (area: number | string) => `To cover ${area}m², you need:`,
    toCoverAreaTotal: (area: number | string, sheets: number) => `To cover ${area}m², you need ${sheets} total sheets.`,
    totalSheets: 'total sheets',
    enterThicknessHint: '(Enter sheet thickness above to calculate packs)',
    youNeedExactly: 'You will need exactly:',
    resultPacksAndSheets: (packs: number, sheets: number) => `${packs} packs and ${sheets} sheets`,
    resultPacks: (packs: number) => `${packs} packs`,
    resultSheets: (sheets: number) => `${sheets} sheets`,
    addCustomPack: 'Add Custom Pack',
    profileNameHolder: 'Profile Name (e.g., Garage Pack)',
    packThicknessHolder: 'Total Pack Thickness (cm)',
    sheetLengthHolder: 'Sheet Length (cm, e.g., 100)',
    sheetWidthHolder: 'Sheet Width/Height (cm, e.g., 50)',
    savePackBtn: 'Save Custom Pack',
    defaultStyrofoamName: 'Standard 100x50cm',
    
    enterAreaToCalc: 'Enter area to calculate buckets',
    toCoverBuy: (area: number | string) => `To cover ${area}m², you need to buy:`,
    bucketsCount: (count: number) => count === 1 ? `${count} bucket` : `${count} buckets`,
    totalWeight: (kg: number) => `(Total weight: ${kg} kg)`,
    addCustomBucket: 'Add Custom Bucket',
    paintNameHolder: 'Paint Name (e.g., White Ceiling)',
    bucketWeightHolder: 'Weight of 1 bucket (kg)',
    coverageHolder: 'Coverage per bucket (m²)',
    saveBucketBtn: 'Save Custom Bucket',
    defaultPaintName: 'Standard Primer (10kg)',
    langToggle: '🇺🇦 UA',
    eg5: 'e.g., 5',
    eg100: 'e.g., 100',
    eg30: 'e.g., 30',
    eg150: 'e.g., 150',
  },
  uk: {
    styrofoamTab: 'Пінопласт',
    paintTab: 'Відра',
    titleStyrofoam: 'Калькулятор Пінопласту',
    titlePaint: 'Калькулятор Відер',
    selectConverter: 'Оберіть конвертер:',
    selectBucket: 'Оберіть тип відра:',
    singleSheetThickness: 'Товщина одного листа (см):',
    totalArea: 'Загальна площа покриття (м²):',
    orExactSheets: 'АБО точна кількість листів:',
    enterThickness: 'Введіть товщину листа',
    sheetsPerPack: 'Листів в упаковці:',
    toCoverArea: (area: number | string) => `Для покриття ${area}м² потрібно:`,
    toCoverAreaTotal: (area: number | string, sheets: number) => `Для покриття ${area}м² потрібно ${sheets} листів.`,
    totalSheets: 'всього листів',
    enterThicknessHint: '(Введіть товщину вище для розрахунку упаковок)',
    youNeedExactly: 'Вам знадобиться рівно:',
    resultPacksAndSheets: (packs: number, sheets: number) => `${packs} упак. та ${sheets} листів`,
    resultPacks: (packs: number) => `${packs} упаковок`,
    resultSheets: (sheets: number) => `${sheets} листів`,
    addCustomPack: 'Додати власний профіль',
    profileNameHolder: 'Назва профілю (напр., Для гаража)',
    packThicknessHolder: 'Загальна товщина упаковки (см)',
    sheetLengthHolder: 'Довжина листа (см, напр., 100)',
    sheetWidthHolder: 'Ширина/Висота листа (см, напр., 50)',
    savePackBtn: 'Зберегти профіль',
    defaultStyrofoamName: 'Стандартний 100x50см',
    
    enterAreaToCalc: 'Введіть площу для розрахунку',
    toCoverBuy: (area: number | string) => `Для покриття ${area}м² потрібно купити:`,
    bucketsCount: (count: number) => count === 1 ? `${count} відро` : (count > 1 && count < 5) ? `${count} відра` : `${count} відер`,
    totalWeight: (kg: number) => `(Загальна вага: ${kg} кг)`,
    addCustomBucket: 'Додати власне відро',
    paintNameHolder: 'Назва (напр., Біла для стелі)',
    bucketWeightHolder: 'Вага 1 відра (кг)',
    coverageHolder: 'Площа покриття з відра (м²)',
    saveBucketBtn: 'Зберегти відро',
    defaultPaintName: 'Стандартна ґрунтовка (10кг)',
    langToggle: '🇬🇧 EN',
    eg5: 'напр., 5',
    eg100: 'напр., 100',
    eg30: 'напр., 30',
    eg150: 'напр., 150',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('styrofoam'); 
  const [language, setLanguage] = useState<Language>('en'); 

  const t = dict[language]; 

  const defaultPacks: Pack[] = [
    { id: '1', name: 'Standard 100x50cm', totalThickness: 60, sheetArea: 0.5 },
    { id: '2', name: 'PNP', totalThickness: 40, sheetArea: 0.65886 },
  ];
  const [packs, setPacks] = useState<Pack[]>(defaultPacks);
  const [selectedPack, setSelectedPack] = useState<Pack>(defaultPacks[0]);
  const [sheetThickness, setSheetThickness] = useState('');
  const [sheetsNeeded, setSheetsNeeded] = useState(''); 
  const [areaNeeded, setAreaNeeded] = useState(''); 
  const [customName, setCustomName] = useState('');
  const [customPackThickness, setCustomPackThickness] = useState('');
  const [customLength, setCustomLength] = useState(''); 
  const [customHeight, setCustomHeight] = useState('');

  const defaultBucket: Bucket = { id: 'p1', name: 'Standard Primer (10kg)', kg: 10, coverageArea: 50 };
  const [buckets, setBuckets] = useState<Bucket[]>([defaultBucket]);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>(defaultBucket);
  const [paintAreaNeeded, setPaintAreaNeeded] = useState('');
  const [customBucketName, setCustomBucketName] = useState('');
  const [customBucketKg, setCustomBucketKg] = useState('');
  const [customBucketCoverage, setCustomBucketCoverage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('@language');
        if (savedLang === 'en' || savedLang === 'uk') setLanguage(savedLang);

        const savedPacks = await AsyncStorage.getItem('@saved_packs');
        if (savedPacks !== null) {
          const parsedPacks: Pack[] = JSON.parse(savedPacks);
          const customPacks = parsedPacks
            .filter((pack: Pack) => pack.id !== '1' && pack.id !== '2')
            .map((pack: Pack) => ({ ...pack, sheetArea: pack.sheetArea || 0.5 }));
          const mergedPacks = [...defaultPacks, ...customPacks];
          setPacks(mergedPacks);
          setSelectedPack(mergedPacks[0]); 
        }

        const savedBuckets = await AsyncStorage.getItem('@saved_buckets');
        if (savedBuckets !== null) {
          const parsedBuckets: Bucket[] = JSON.parse(savedBuckets);
          setBuckets(parsedBuckets);
          setSelectedBucket(parsedBuckets[0]);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  const toggleLanguage = async () => {
    const newLang: Language = language === 'en' ? 'uk' : 'en';
    setLanguage(newLang);
    try { await AsyncStorage.setItem('@language', newLang); } 
    catch (e) { console.error("Failed to save language", e); }
  };

  const getPackName = (pack: Pack) => pack.id === '1' ? t.defaultStyrofoamName : pack.name;
  const getBucketName = (bucket: Bucket) => bucket.id === 'p1' ? t.defaultPaintName : bucket.name;

  const savePacksToStorage = async (newPacksArray: Pack[]) => {
    try { await AsyncStorage.setItem('@saved_packs', JSON.stringify(newPacksArray)); } 
    catch (e) { console.error("Failed to save packs", e); }
  };

  const addNewPack = () => {
    const packThickness = parseFloat(customPackThickness);
    const length = parseFloat(customLength);
    const height = parseFloat(customHeight);

    if (packThickness > 0 && length > 0 && height > 0 && customName !== '') {
      const calculatedArea = (length * height) / 10000;
      const newPack: Pack = { id: Date.now().toString(), name: customName, totalThickness: packThickness, sheetArea: calculatedArea };
      const updatedPacks = [...packs, newPack];
      setPacks(updatedPacks);
      setSelectedPack(newPack);
      savePacksToStorage(updatedPacks);
      setCustomName(''); setCustomPackThickness(''); setCustomLength(''); setCustomHeight('');
      Keyboard.dismiss();
    }
  };

  const deletePack = (idToDelete: string) => {
    if (idToDelete === '1' || idToDelete === '2') return;
    const updatedPacks = packs.filter((pack) => pack.id !== idToDelete);
    setPacks(updatedPacks);
    savePacksToStorage(updatedPacks);
    if (selectedPack.id === idToDelete) setSelectedPack(updatedPacks[0]);
  };

  const saveBucketsToStorage = async (newBucketsArray: Bucket[]) => {
    try { await AsyncStorage.setItem('@saved_buckets', JSON.stringify(newBucketsArray)); } 
    catch (e) { console.error("Failed to save buckets", e); }
  };

  const addNewBucket = () => {
    const kg = parseFloat(customBucketKg);
    const coverage = parseFloat(customBucketCoverage);

    if (kg > 0 && coverage > 0 && customBucketName !== '') {
      const newBucket: Bucket = { id: Date.now().toString(), name: customBucketName, kg: kg, coverageArea: coverage };
      const updatedBuckets = [...buckets, newBucket];
      setBuckets(updatedBuckets);
      setSelectedBucket(newBucket);
      saveBucketsToStorage(updatedBuckets);
      setCustomBucketName(''); setCustomBucketKg(''); setCustomBucketCoverage('');
      Keyboard.dismiss();
    }
  };

  const deleteBucket = (idToDelete: string) => {
    if (idToDelete === 'p1') return;
    const updatedBuckets = buckets.filter((bucket) => bucket.id !== idToDelete);
    setBuckets(updatedBuckets);
    saveBucketsToStorage(updatedBuckets);
    if (selectedBucket.id === idToDelete) setSelectedBucket(updatedBuckets[0]);
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
      
      if (fullPacks > 0 && leftoverSheets > 0) styrofoamResultText = t.resultPacksAndSheets(fullPacks, leftoverSheets);
      else if (fullPacks > 0 && leftoverSheets === 0) styrofoamResultText = t.resultPacks(fullPacks);
      else styrofoamResultText = t.resultSheets(leftoverSheets);
    }
  }

  const paintArea = parseFloat(paintAreaNeeded);
  let bucketsNeeded = 0;
  let totalKgNeeded = 0;
  
  if (paintArea > 0 && selectedBucket.coverageArea > 0) {
    bucketsNeeded = Math.ceil(paintArea / selectedBucket.coverageArea);
    totalKgNeeded = bucketsNeeded * selectedBucket.kg;
  }

  return (
    <View style={styles.container}>
      
      {/* --- TOP HEADER W/ LANGUAGE TOGGLE --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>{t.langToggle}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'styrofoam' && styles.activeTabButton]} onPress={() => setActiveTab('styrofoam')}>
          <Text style={[styles.tabText, activeTab === 'styrofoam' && styles.activeTabText]}>{t.styrofoamTab}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'paint' && styles.activeTabButton]} onPress={() => setActiveTab('paint')}>
          <Text style={[styles.tabText, activeTab === 'paint' && styles.activeTabText]}>{t.paintTab}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        
        {activeTab === 'styrofoam' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.title}>{t.titleStyrofoam}</Text>
              
              <Text style={styles.label}>{t.selectConverter}</Text>
              <View style={styles.packList}>
                {packs.map((pack) => (
                  <View key={pack.id} style={[styles.packWrapper, selectedPack.id === pack.id && styles.activePackWrapper]}>
                    <TouchableOpacity style={styles.packButton} onPress={() => setSelectedPack(pack)}>
                      <Text style={[styles.packButtonText, selectedPack.id === pack.id && styles.activePackButtonText]}>
                        {getPackName(pack)} ({pack.totalThickness}cm, {pack.sheetArea}m²)
                      </Text>
                    </TouchableOpacity>
                    {pack.id !== '1' && pack.id !== '2' && (
                      <TouchableOpacity style={styles.deleteButton} onPress={() => deletePack(pack.id)}>
                        <Text style={[styles.deleteButtonText, selectedPack.id === pack.id && styles.activeDeleteButtonText]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.label}>{t.singleSheetThickness}</Text>
              <TextInput style={styles.input} placeholder={t.eg5} placeholderTextColor="#999" keyboardType="numeric" value={sheetThickness} onChangeText={setSheetThickness} />

              <Text style={styles.label}>{t.totalArea}</Text>
              <TextInput style={styles.input} placeholder={t.eg100} placeholderTextColor="#999" keyboardType="numeric" value={areaNeeded} onChangeText={(text) => { setAreaNeeded(text); setSheetsNeeded(''); }} />

              <Text style={styles.label}>{t.orExactSheets}</Text>
              <TextInput style={styles.input} placeholder={t.eg30} placeholderTextColor="#999" keyboardType="numeric" value={sheetsNeeded} onChangeText={(text) => { setSheetsNeeded(text); setAreaNeeded(''); }} />
              
              <View style={styles.resultContainer}>
                <Text style={styles.resultPrimary}>{sheetsPerPack > 0 ? `${t.sheetsPerPack} ${sheetsPerPack}` : t.enterThickness}</Text>
                
                {calculatedSheetsFromArea > 0 && sheetsPerPack === 0 && (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>{t.toCoverArea(styrofoamArea)}</Text>
                    <Text style={styles.resultSecondary}>{calculatedSheetsFromArea} {t.totalSheets}</Text>
                    <Text style={styles.resultTertiary}>{t.enterThicknessHint}</Text>
                  </View>
                )}

                {sheetsPerPack > 0 && needed > 0 && (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>
                      {calculatedSheetsFromArea > 0 ? t.toCoverAreaTotal(styrofoamArea, calculatedSheetsFromArea) : t.youNeedExactly}
                    </Text>
                    <Text style={styles.resultSecondary}>{styrofoamResultText}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{t.addCustomPack}</Text>
              <TextInput style={styles.input} placeholder={t.profileNameHolder} placeholderTextColor="#999" value={customName} onChangeText={setCustomName} />
              <TextInput style={styles.input} placeholder={t.packThicknessHolder} placeholderTextColor="#999" keyboardType="numeric" value={customPackThickness} onChangeText={setCustomPackThickness} />
              <TextInput style={styles.input} placeholder={t.sheetLengthHolder} placeholderTextColor="#999" keyboardType="numeric" value={customLength} onChangeText={setCustomLength} />
              <TextInput style={styles.input} placeholder={t.sheetWidthHolder} placeholderTextColor="#999" keyboardType="numeric" value={customHeight} onChangeText={setCustomHeight} />
              <Button title={t.savePackBtn} onPress={addNewPack} color="#007AFF" />
            </View>
          </View>
        )}

        {activeTab === 'paint' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.title}>{t.titlePaint}</Text>
              
              <Text style={styles.label}>{t.selectBucket}</Text>
              <View style={styles.packList}>
                {buckets.map((bucket) => (
                  <View key={bucket.id} style={[styles.packWrapper, selectedBucket.id === bucket.id && styles.activePackWrapper]}>
                    <TouchableOpacity style={styles.packButton} onPress={() => setSelectedBucket(bucket)}>
                      <Text style={[styles.packButtonText, selectedBucket.id === bucket.id && styles.activePackButtonText]}>
                        {getBucketName(bucket)} ({bucket.coverageArea}m² / {bucket.kg}kg)
                      </Text>
                    </TouchableOpacity>
                    {bucket.id !== 'p1' && (
                      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBucket(bucket.id)}>
                        <Text style={[styles.deleteButtonText, selectedBucket.id === bucket.id && styles.activeDeleteButtonText]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.label}>{t.totalArea}</Text>
              <TextInput style={styles.input} placeholder={t.eg150} placeholderTextColor="#999" keyboardType="numeric" value={paintAreaNeeded} onChangeText={setPaintAreaNeeded} />
              
              <View style={styles.resultContainer}>
                {bucketsNeeded > 0 ? (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>{t.toCoverBuy(paintAreaNeeded)}</Text>
                    <Text style={styles.resultSecondary}>{t.bucketsCount(bucketsNeeded)}</Text>
                    <Text style={styles.resultTertiary}>{t.totalWeight(totalKgNeeded)}</Text>
                  </View>
                ) : (
                  <Text style={styles.resultPrimary}>{t.enterAreaToCalc}</Text>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{t.addCustomBucket}</Text>
              <TextInput style={styles.input} placeholder={t.paintNameHolder} placeholderTextColor="#999" value={customBucketName} onChangeText={setCustomBucketName} />
              <TextInput style={styles.input} placeholder={t.bucketWeightHolder} placeholderTextColor="#999" keyboardType="numeric" value={customBucketKg} onChangeText={setCustomBucketKg} />
              <TextInput style={styles.input} placeholder={t.coverageHolder} placeholderTextColor="#999" keyboardType="numeric" value={customBucketCoverage} onChangeText={setCustomBucketCoverage} />
              <Button title={t.saveBucketBtn} onPress={addNewBucket} color="#007AFF" />
            </View>
          </View>
        )}

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}