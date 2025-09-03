import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import TaskItem from '../components/TaskItem';
import SearchBar from '../components/SearchBar';
import { useTasks } from '../lib/store';

export default function HomeScreen() {
  const { state, dispatch } = useTasks();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.tasks;
    return state.tasks.filter(t => t.title.toLowerCase().includes(q));
  }, [state.tasks, query]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first task!</Text>}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={(id) => dispatch({ type: 'toggle', payload: { id } })}
            onDelete={(id) => dispatch({ type: 'delete', payload: { id } })}
          />
        )}
      />
      <Link href="/add" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '600', lineHeight: 28 }
});
