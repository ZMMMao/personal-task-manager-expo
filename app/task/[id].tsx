import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { selectTaskById, useTasks } from '../../lib/store';
// Screen to show task details, with options to toggle status, edit, or delete
export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useTasks();
  const router = useRouter();
  const task = selectTaskById(state, id!);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#b91c1c' }}>Task not found.</Text>
      </View>
    );
  }

  const isCompleted = task.status === 'completed';
  const onToggle = () => dispatch({ type: 'toggle', payload: { id: task.id } });
  const onEdit = () => router.push({ pathname: '/edit/[id]', params: { id: task.id } });
  // Confirm before deleting
  const onDelete = () =>
    Alert.alert('Delete task?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'delete', payload: { id: task.id } });
          router.replace('/');
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      {/* Status pill completed/pending */}
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Status:</Text>
        <View style={[styles.pill, isCompleted ? styles.pillCompleted : styles.pillPending]}>
          <Text style={styles.pillText}>{task.status}</Text>
        </View>
      </View>

      <Text style={styles.desc}>{task.description || 'No description.'}</Text>

      {/* Two equal buttons in a row */}
      <View style={styles.row}>
        <Pressable onPress={onToggle} style={[styles.btn, styles.primary, styles.half]}>
          <Text style={[styles.btnText, styles.primaryText]}>
            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
          </Text>
        </Pressable>

        <Pressable onPress={onEdit} style={[styles.btn, styles.outline, styles.half]}>
          <Text style={[styles.btnText, styles.outlineText]}>Edit</Text>
        </Pressable>
      </View>

      {/* Full-width delete */}
      <Pressable onPress={onDelete} style={[styles.btn, styles.danger, styles.full]}>
        <Text style={[styles.btnText, styles.dangerText]}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaLabel: { color: '#5f6368', marginRight: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillCompleted: { backgroundColor: '#E6F4EA' },
  pillPending: { backgroundColor: '#E8EEF9' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#1F2937' },

  desc: { marginBottom: 16, fontSize: 14, lineHeight: 20 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // reliable spacing on RN 0.74
    marginBottom: 12,
  },
  half: { width: '48%' },
  full: { width: '100%' },

  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnText: { fontWeight: '700' },

  primary: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  primaryText: { color: '#fff' },

  outline: { backgroundColor: '#fff', borderColor: '#CBD5E1' },
  outlineText: { color: '#2563EB' },

  danger: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
  dangerText: { color: '#fff' },
});
