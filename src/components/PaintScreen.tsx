import { useEffect, useRef, useState } from 'react';
import { Button, Keyboard, ScrollView, Text, TextInput, View } from 'react-native';
import styles from '@/app/styles';
import PackList from '@/components/PackList';
import { useStoredData } from '@/hooks/useStoredData';
import { Bucket, Translations } from '@/types';
import { haptics } from '@/utils/haptics';

const DEFAULT_BUCKET: Bucket = {
  id: 'p1',
  name: 'Standard Primer (10kg)',
  kg: 10,
  coverageArea: 50,
};

interface PaintScreenProps {
  t: Translations;
}

export default function PaintScreen({ t }: PaintScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);

  const [buckets, setBuckets] = useStoredData<Bucket[]>('@saved_buckets', [DEFAULT_BUCKET]);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>(DEFAULT_BUCKET);
  const [paintAreaNeeded, setPaintAreaNeeded] = useState('');
  const [editingBucketId, setEditingBucketId] = useState<string | null>(null);
  const [customBucketName, setCustomBucketName] = useState('');
  const [customBucketKg, setCustomBucketKg] = useState('');
  const [customBucketCoverage, setCustomBucketCoverage] = useState('');

  const getBucketName = (bucket: Bucket) =>
    bucket.id === 'p1' ? t.defaultPaintName : bucket.name;

  const resetBucketForm = () => {
    setEditingBucketId(null);
    setCustomBucketName('');
    setCustomBucketKg('');
    setCustomBucketCoverage('');
  };

  const startEditingBucket = (bucket: Bucket) => {
    setEditingBucketId(bucket.id);
    setCustomBucketName(bucket.name);
    setCustomBucketKg(bucket.kg.toString());
    setCustomBucketCoverage(bucket.coverageArea.toString());

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      nameInputRef.current?.focus();
    }, 100);
  };

  const saveBucket = () => {
    const kg = parseFloat(customBucketKg);
    const coverage = parseFloat(customBucketCoverage);

    if (kg > 0 && coverage > 0 && customBucketName !== '') {
      if (editingBucketId) {
        const updatedBucket: Bucket = {
          id: editingBucketId,
          name: customBucketName,
          kg,
          coverageArea: coverage,
        };
        const updatedBuckets = buckets.map((b) =>
          b.id === editingBucketId ? updatedBucket : b
        );
        setBuckets(updatedBuckets);
        setSelectedBucket(updatedBucket);
      } else {
        const newBucket: Bucket = {
          id: Date.now().toString(),
          name: customBucketName,
          kg,
          coverageArea: coverage,
        };
        const updatedBuckets = [...buckets, newBucket];
        setBuckets(updatedBuckets);
        setSelectedBucket(newBucket);
      }

      resetBucketForm();
      haptics.success();
      Keyboard.dismiss();
    } else {
      haptics.error();
    }
  };

  const deleteBucket = (idToDelete: string) => {
    if (idToDelete === 'p1') return;
    const updatedBuckets = buckets.filter((bucket) => bucket.id !== idToDelete);
    setBuckets(updatedBuckets);
    if (selectedBucket.id === idToDelete) setSelectedBucket(updatedBuckets[0]);
    if (editingBucketId === idToDelete) resetBucketForm();
  };

  const paintArea = parseFloat(paintAreaNeeded);
  let bucketsNeeded = 0;
  let totalKgNeeded = 0;

  if (paintArea > 0 && selectedBucket.coverageArea > 0) {
    bucketsNeeded = Math.ceil(paintArea / selectedBucket.coverageArea);
    totalKgNeeded = bucketsNeeded * selectedBucket.kg;
  }

  useEffect(() => {
    if (bucketsNeeded > 0) {
      haptics.light();
    }
  }, [bucketsNeeded]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t.titlePaint}</Text>

        <Text style={styles.label}>{t.selectBucket}</Text>
        <PackList
          items={buckets}
          selectedId={selectedBucket.id}
          onSelect={setSelectedBucket}
          onEdit={startEditingBucket}
          onDelete={deleteBucket}
          getLabel={(bucket) =>
            `${getBucketName(bucket)} (${bucket.coverageArea}m² / ${bucket.kg}kg)`
          }
          isDeletable={(bucket) => bucket.id !== 'p1'}
        />

        <Text style={styles.label}>{t.totalArea}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.eg150}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={paintAreaNeeded}
          onChangeText={setPaintAreaNeeded}
        />

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
        <Text style={styles.title}>
          {editingBucketId ? t.editCustomBucket : t.addCustomBucket}
        </Text>
        <TextInput
          ref={nameInputRef}
          style={styles.input}
          placeholder={t.paintNameHolder}
          placeholderTextColor="#999"
          value={customBucketName}
          onChangeText={setCustomBucketName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.bucketWeightHolder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={customBucketKg}
          onChangeText={setCustomBucketKg}
        />
        <TextInput
          style={styles.input}
          placeholder={t.coverageHolder}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={customBucketCoverage}
          onChangeText={setCustomBucketCoverage}
        />
        <Button
          title={editingBucketId ? t.updateBucketBtn : t.saveBucketBtn}
          onPress={saveBucket}
          color="#007AFF"
        />
        {editingBucketId && (
          <View style={styles.cancelButtonWrapper}>
            <Button title={t.cancelEditBtn} onPress={resetBucketForm} color="#888" />
          </View>
        )}
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
