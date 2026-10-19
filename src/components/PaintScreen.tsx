import { useEffect, useState } from 'react';
import { Button, Keyboard, Text, TextInput, View } from 'react-native';
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
  const [buckets, setBuckets] = useStoredData<Bucket[]>('@saved_buckets', [DEFAULT_BUCKET]);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>(DEFAULT_BUCKET);
  const [paintAreaNeeded, setPaintAreaNeeded] = useState('');
  const [customBucketName, setCustomBucketName] = useState('');
  const [customBucketKg, setCustomBucketKg] = useState('');
  const [customBucketCoverage, setCustomBucketCoverage] = useState('');

  const getBucketName = (bucket: Bucket) =>
    bucket.id === 'p1' ? t.defaultPaintName : bucket.name;

  const addNewBucket = () => {
    const kg = parseFloat(customBucketKg);
    const coverage = parseFloat(customBucketCoverage);

    if (kg > 0 && coverage > 0 && customBucketName !== '') {
      const newBucket: Bucket = {
        id: Date.now().toString(),
        name: customBucketName,
        kg,
        coverageArea: coverage,
      };
      const updatedBuckets = [...buckets, newBucket];
      setBuckets(updatedBuckets);
      setSelectedBucket(newBucket);
      setCustomBucketName('');
      setCustomBucketKg('');
      setCustomBucketCoverage('');
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
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>{t.titlePaint}</Text>

        <Text style={styles.label}>{t.selectBucket}</Text>
        <PackList
          items={buckets}
          selectedId={selectedBucket.id}
          onSelect={setSelectedBucket}
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
        <Text style={styles.title}>{t.addCustomBucket}</Text>
        <TextInput
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
        <Button title={t.saveBucketBtn} onPress={addNewBucket} color="#007AFF" />
      </View>
    </View>
  );
}
