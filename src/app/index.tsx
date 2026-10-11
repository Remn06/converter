import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  // --- APP STATE (TAB NAVIGATION) ---
  const [activeTab, setActiveTab] = useState('styrofoam'); 

  // --- STYROFOAM STATE ---
  const defaultPack = { id: '1', name: 'Standard 100x50cm', totalThickness: 60, sheetArea: 0.5 };
  const [packs, setPacks] = useState([defaultPack]);
  const [selectedPack, setSelectedPack] = useState(defaultPack);
  const [sheetThickness, setSheetThickness] = useState('');
  const [sheetsNeeded, setSheetsNeeded] = useState(''); 
  const [areaNeeded, setAreaNeeded] = useState(''); 
  const [customName, setCustomName] = useState('');
  const [customPackThickness, setCustomPackThickness] = useState('');
  const [customLength, setCustomLength] = useState(''); 
  const [customHeight, setCustomHeight] = useState('');

  // --- PAINT & PRIMER STATE ---
  const defaultBucket = { id: 'p1', name: 'Standard Primer (10kg)', kg: 10, coverageArea: 50 };
  const [buckets, setBuckets] = useState([defaultBucket]);
  const [selectedBucket, setSelectedBucket] = useState(defaultBucket);
  const [paintAreaNeeded, setPaintAreaNeeded] = useState('');
  const [customBucketName, setCustomBucketName] = useState('');
  const [customBucketKg, setCustomBucketKg] = useState('');
  const [customBucketCoverage, setCustomBucketCoverage] = useState('');

  // --- LOAD SAVED DATA ON STARTUP ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Styrofoam
        const savedPacks = await AsyncStorage.getItem('@saved_packs');
        if (savedPacks !== null) {
          let parsedPacks = JSON.parse(savedPacks);
          parsedPacks = parsedPacks.map(pack => {
            if (pack.id === '1') return { ...pack, name: 'Standard 100x50cm', sheetArea: 0.5 };
            return { ...pack, sheetArea: pack.sheetArea || 0.5 };
          });
          setPacks(parsedPacks);
          setSelectedPack(parsedPacks[0]); 
        }

        // Load Paint Buckets
        const savedBuckets = await AsyncStorage.getItem('@saved_buckets');
        if (savedBuckets !== null) {
          const parsedBuckets = JSON.parse(savedBuckets);
          setBuckets(parsedBuckets);
          setSelectedBucket(parsedBuckets[0]);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // --- STYROFOAM FUNCTIONS ---
  const savePacksToStorage = async (newPacksArray) => {
    try { await AsyncStorage.setItem('@saved_packs', JSON.stringify(newPacksArray)); } 
    catch (e) { console.error("Failed to save packs", e); }
  };

  const addNewPack = () => {
    const packThickness = parseFloat(customPackThickness);
    const length = parseFloat(customLength);
    const height = parseFloat(customHeight);

    if (packThickness > 0 && length > 0 && height > 0 && customName !== '') {
      const calculatedArea = (length * height) / 10000;
      const newPack = { id: Date.now().toString(), name: customName, totalThickness: packThickness, sheetArea: calculatedArea };
      const updatedPacks = [...packs, newPack];
      
      setPacks(updatedPacks);
      setSelectedPack(newPack);
      savePacksToStorage(updatedPacks);
      setCustomName(''); setCustomPackThickness(''); setCustomLength(''); setCustomHeight('');
      Keyboard.dismiss();
    }
  };

  const deletePack = (idToDelete) => {
    if (idToDelete === '1') return;
    const updatedPacks = packs.filter((pack) => pack.id !== idToDelete);
    setPacks(updatedPacks);
    savePacksToStorage(updatedPacks);
    if (selectedPack.id === idToDelete) setSelectedPack(updatedPacks[0]);
  };

  // --- PAINT FUNCTIONS ---
  const saveBucketsToStorage = async (newBucketsArray) => {
    try { await AsyncStorage.setItem('@saved_buckets', JSON.stringify(newBucketsArray)); } 
    catch (e) { console.error("Failed to save buckets", e); }
  };

  const addNewBucket = () => {
    const kg = parseFloat(customBucketKg);
    const coverage = parseFloat(customBucketCoverage);

    if (kg > 0 && coverage > 0 && customBucketName !== '') {
      const newBucket = { id: Date.now().toString(), name: customBucketName, kg: kg, coverageArea: coverage };
      const updatedBuckets = [...buckets, newBucket];
      
      setBuckets(updatedBuckets);
      setSelectedBucket(newBucket);
      saveBucketsToStorage(updatedBuckets);
      setCustomBucketName(''); setCustomBucketKg(''); setCustomBucketCoverage('');
      Keyboard.dismiss();
    }
  };

  const deleteBucket = (idToDelete) => {
    if (idToDelete === 'p1') return;
    const updatedBuckets = buckets.filter((bucket) => bucket.id !== idToDelete);
    setBuckets(updatedBuckets);
    saveBucketsToStorage(updatedBuckets);
    if (selectedBucket.id === idToDelete) setSelectedBucket(updatedBuckets[0]);
  };

  // --- STYROFOAM MATH ---
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
      
      if (fullPacks > 0 && leftoverSheets > 0) styrofoamResultText = `${fullPacks} packs and ${leftoverSheets} sheets`;
      else if (fullPacks > 0 && leftoverSheets === 0) styrofoamResultText = `${fullPacks} packs`;
      else styrofoamResultText = `${leftoverSheets} sheets`;
    }
  }

  // --- PAINT MATH ---
  const paintArea = parseFloat(paintAreaNeeded);
  let bucketsNeeded = 0;
  let totalKgNeeded = 0;
  
  if (paintArea > 0 && selectedBucket.coverageArea > 0) {
    bucketsNeeded = Math.ceil(paintArea / selectedBucket.coverageArea);
    totalKgNeeded = bucketsNeeded * selectedBucket.kg;
  }

  return (
    <View style={styles.container}>
      
      {/* --- TOP TAB NAVIGATION --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'styrofoam' && styles.activeTabButton]}
          onPress={() => setActiveTab('styrofoam')}
        >
          <Text style={[styles.tabText, activeTab === 'styrofoam' && styles.activeTabText]}>Styrofoam</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'paint' && styles.activeTabButton]}
          onPress={() => setActiveTab('paint')}
        >
          <Text style={[styles.tabText, activeTab === 'paint' && styles.activeTabText]}>Paint & Primer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        
        {/* ========================================= */}
        {/*           STYROFOAM SCREEN                */}
        {/* ========================================= */}
        {activeTab === 'styrofoam' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.title}>Styrofoam Calculator</Text>
              
              <Text style={styles.label}>Select Converter:</Text>
              <View style={styles.packList}>
                {packs.map((pack) => (
                  <View key={pack.id} style={[styles.packWrapper, selectedPack.id === pack.id && styles.activePackWrapper]}>
                    <TouchableOpacity style={styles.packButton} onPress={() => setSelectedPack(pack)}>
                      <Text style={[styles.packButtonText, selectedPack.id === pack.id && styles.activePackButtonText]}>
                        {pack.name} ({pack.totalThickness}cm, {pack.sheetArea}m²)
                      </Text>
                    </TouchableOpacity>
                    {pack.id !== '1' && (
                      <TouchableOpacity style={styles.deleteButton} onPress={() => deletePack(pack.id)}>
                        <Text style={[styles.deleteButtonText, selectedPack.id === pack.id && styles.activeDeleteButtonText]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.label}>Single Sheet Thickness (cm):</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 5" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={sheetThickness} 
                onChangeText={setSheetThickness} 
              />

              <Text style={styles.label}>Total Area to Cover (m²):</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 100" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={areaNeeded} 
                onChangeText={(text) => { setAreaNeeded(text); setSheetsNeeded(''); }} 
              />

              <Text style={styles.label}>OR exact sheets needed:</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 30" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={sheetsNeeded} 
                onChangeText={(text) => { setSheetsNeeded(text); setAreaNeeded(''); }} 
              />
              
              <View style={styles.resultContainer}>
                <Text style={styles.resultPrimary}>{sheetsPerPack > 0 ? `Sheets per pack: ${sheetsPerPack}` : 'Enter sheet thickness'}</Text>
                
                {calculatedSheetsFromArea > 0 && sheetsPerPack === 0 && (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>To cover {styrofoamArea}m², you need:</Text>
                    <Text style={styles.resultSecondary}>{calculatedSheetsFromArea} total sheets</Text>
                    <Text style={styles.resultTertiary}>(Enter sheet thickness above to calculate packs)</Text>
                  </View>
                )}

                {sheetsPerPack > 0 && needed > 0 && (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>
                      {calculatedSheetsFromArea > 0 ? `To cover ${styrofoamArea}m², you need ${calculatedSheetsFromArea} total sheets.` : 'You will need exactly:'}
                    </Text>
                    <Text style={styles.resultSecondary}>{styrofoamResultText}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Add Custom Pack</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Profile Name (e.g., Garage Pack)" 
                placeholderTextColor="#999"
                value={customName} 
                onChangeText={setCustomName} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Total Pack Thickness (cm)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={customPackThickness} 
                onChangeText={setCustomPackThickness} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Sheet Length (cm, e.g., 100)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={customLength} 
                onChangeText={setCustomLength} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Sheet Width/Height (cm, e.g., 50)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={customHeight} 
                onChangeText={setCustomHeight} 
              />
              <Button title="Save Custom Pack" onPress={addNewPack} color="#28a745" />
            </View>
          </View>
        )}

        {/* ========================================= */}
        {/*             PAINT SCREEN                  */}
        {/* ========================================= */}
        {activeTab === 'paint' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.title}>Paint & Primer Calculator</Text>
              
              <Text style={styles.label}>Select Bucket Type:</Text>
              <View style={styles.packList}>
                {buckets.map((bucket) => (
                  <View key={bucket.id} style={[styles.packWrapper, selectedBucket.id === bucket.id && styles.activePackWrapper]}>
                    <TouchableOpacity style={styles.packButton} onPress={() => setSelectedBucket(bucket)}>
                      <Text style={[styles.packButtonText, selectedBucket.id === bucket.id && styles.activePackButtonText]}>
                        {bucket.name} ({bucket.coverageArea}m² / {bucket.kg}kg)
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

              <Text style={styles.label}>Total Area to Cover (m²):</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 150" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={paintAreaNeeded} 
                onChangeText={setPaintAreaNeeded} 
              />
              
              <View style={styles.resultContainer}>
                {bucketsNeeded > 0 ? (
                  <View style={styles.packsResultBox}>
                    <Text style={styles.resultTertiary}>To cover {paintAreaNeeded}m², you need to buy:</Text>
                    <Text style={styles.resultSecondary}>{bucketsNeeded} {bucketsNeeded === 1 ? 'bucket' : 'buckets'}</Text>
                    <Text style={styles.resultTertiary}>(Total weight: {totalKgNeeded} kg)</Text>
                  </View>
                ) : (
                  <Text style={styles.resultPrimary}>Enter area to calculate buckets</Text>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Add Custom Bucket</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Paint Name (e.g., White Ceiling Paint)" 
                placeholderTextColor="#999"
                value={customBucketName} 
                onChangeText={setCustomBucketName} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Weight of 1 bucket (kg)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={customBucketKg} 
                onChangeText={setCustomBucketKg} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Coverage per bucket (m²)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={customBucketCoverage} 
                onChangeText={setCustomBucketCoverage} 
              />
              <Button title="Save Custom Bucket" onPress={addNewBucket} color="#007AFF" />
            </View>
          </View>
        )}

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', paddingTop: 40 },
  
  // --- TAB STYLES ---
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', elevation: 2 },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTabButton: { borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#007AFF' },

  // --- GENERAL APP STYLES ---
  card: { backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 12, marginBottom: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  
  // --- FIXED INPUT STYLES (Added color: '#000') ---
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8, 
    fontSize: 16, 
    backgroundColor: '#fafafa',
    color: '#000' 
  },
  
  packList: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  packWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#007AFF', borderRadius: 20, marginRight: 10, marginBottom: 10, overflow: 'hidden' },
  activePackWrapper: { backgroundColor: '#007AFF' },
  packButton: { paddingVertical: 10, paddingLeft: 14, paddingRight: 10 },
  deleteButton: { paddingVertical: 10, paddingRight: 14, paddingLeft: 4 },
  packButtonText: { color: '#007AFF', fontWeight: '600' },
  deleteButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', marginTop: -2 },
  activePackButtonText: { color: '#fff' },
  activeDeleteButtonText: { color: '#fff' },

  resultContainer: { marginTop: 10, alignItems: 'center' },
  resultPrimary: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, textAlign: 'center' },
  packsResultBox: { backgroundColor: '#e6f2ff', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  resultSecondary: { fontSize: 22, fontWeight: 'bold', color: '#005bb5', textAlign: 'center' },
  resultTertiary: { fontSize: 14, color: '#666', marginBottom: 5, textAlign: 'center' }
});