import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import type { Task } from '../lib/types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  completeColor: string; // color for completed tasks
}

export default function TaskItem({ task, onToggle, onDelete, completeColor }: Props) {
  // Build the row container style; if completed, tint the background
  const containerStyle = [
    styles.container,
    task.status == 'completed' && { backgroundColor: completeColor }
  ];
  return (
    <View style={containerStyle}>
      {/* Left: tappable status icon (toggle, '✓' : '○')  */}
      <Pressable onPress={() => onToggle(task.id)} style={styles.status}>
        <Text style={styles.statusText}>{task.status === 'completed' ? '✓' : '○'}</Text>
      </Pressable>

      {/* Middle: title/description with link to details */}
      <View style={styles.info}>
        <Link href={{ pathname: '/task/[id]', params: { id: task.id }}}>
          <Text style={[styles.title, task.status === 'completed' && styles.completed]} numberOfLines={1}>
            {task.title}
          </Text>
        </Link>
        <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
      </View>

      {/* Right: actions, edit and delete function */}
      <View style={styles.actions}>
        <Link href={{ pathname: '/edit/[id]', params: { id: task.id }}} style={styles.actionBtn}>
          <Text style={styles.link}>Edit</Text>
        </Link>
        <Pressable onPress={() => onDelete(task.id)} style={styles.actionBtn}>
          <Text style={styles.danger}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    backgroundColor: '#fff',
    gap: 12
  },
  status: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  statusText: { fontSize: 16 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  completed: { textDecorationLine: 'line-through', color: '#9AA0A6' },
  desc: { fontSize: 12, color: '#5f6368', marginTop: 4 },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  actionBtn: { paddingVertical: 4 },
  link: { color: '#2563eb', fontWeight: '600' },
  danger: { color: '#b91c1c', fontWeight: '600' }
});
