import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', paddingTop: 40 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 15, paddingBottom: 10 },
  langButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#e6f2ff', borderRadius: 8, borderWidth: 1, borderColor: '#007AFF' },
  langButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', elevation: 2 },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTabButton: { borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#007AFF' },

  card: { backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 12, marginBottom: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa', color: '#000' },
  
  packList: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  packWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#007AFF', borderRadius: 20, marginRight: 10, marginBottom: 10, overflow: 'hidden' },
  activePackWrapper: { backgroundColor: '#007AFF' },
  packButton: { paddingVertical: 10, paddingLeft: 14, paddingRight: 8 },
  editButton: { paddingVertical: 10, paddingHorizontal: 6 },
  deleteButton: { paddingVertical: 10, paddingRight: 14, paddingLeft: 4 },
  packButtonText: { color: '#007AFF', fontWeight: '600' },
  editButtonText: { color: '#007AFF', fontSize: 15, fontWeight: 'bold', marginTop: -1 },
  deleteButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', marginTop: -2 },
  activePackButtonText: { color: '#fff' },
  activeDeleteButtonText: { color: '#fff' },
  cancelButtonWrapper: { marginTop: 10 },

  resultContainer: { marginTop: 10, alignItems: 'center' },
  resultPrimary: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, textAlign: 'center' },
  packsResultBox: { backgroundColor: '#e6f2ff', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  resultSecondary: { fontSize: 22, fontWeight: 'bold', color: '#005bb5', textAlign: 'center' },
  resultTertiary: { fontSize: 14, color: '#666', marginBottom: 5, textAlign: 'center' }
});