import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { selectTaskById, useTasks } from '../../lib/store';
// Screen to show task details, with options to toggle status, edit, or delete
export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useTasks();
  const router = useRouter();
  const task = selectTaskById(state, id!);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  // If task not found, show error
  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#b91c1c' }}>Task not found.</Text>
      </View>
    );
  }
  // Save changes and go back to details
  const save = () => {
    const t = title.trim();
    if (!t) {
      Alert.alert('Title required', 'Please enter a title for your task.');
      return;
    }
    dispatch({ type: 'update', payload: { id: task.id, title: t, description } });
    router.replace({ pathname: '/task/[id]', params: { id: task.id } });
  };

  return (
    <View style={styles.container}>
      {/* Title input */}
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      {/* Description input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={6}
      />
      {/* Save button */}
      <Pressable onPress={save} style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 12
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryText: { color: '#fff', fontWeight: '700' }
});
