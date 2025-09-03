import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTasks } from '../lib/store';

export default function AddTaskScreen() {
  const { dispatch } = useTasks();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const add = () => {
    const t = title.trim();
    if (!t) {
      Alert.alert('Title required', 'Please enter a title for your task.');
      return;
    }
    dispatch({ type: 'add', payload: { title: t, description } });
    router.replace('/'); // back to list
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={6}
      />
      <Pressable onPress={add} style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Add Task</Text>
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
