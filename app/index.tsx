import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import TaskItem from '../components/TaskItem';
import SearchBar from '../components/SearchBar';
import { useTasks } from '../lib/store';
import { queryPrefix } from '../lib/searchIndex';

// a set of light color options
const SWATCHES = ['#E6F4EA', '#E0F2FE', '#EDE9FE', '#FEF3C7', '#E5E7EB'];

// The main screen showing the list of tasks
export default function HomeScreen() {
  const { state, dispatch } = useTasks(); // get global task state and dispatch
  const [query, setQuery] = useState(''); // search query
  const [open, setOpen] = useState(false); // controls of the color modal


  // Client-side filter by title (case-insensitive)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.tasks;
    const ids = queryPrefix(state.index, q);
    const byId = new Map(state.tasks.map( t => [t.id, t] ));
    return ids.map(id => byId.get(id)!).filter(Boolean);
  }, [state.tasks, state.index, query]);

  return (
    <View style={{ flex : 1 }}>
        {/* Top bar with search + a button to open the color picker */}
        <View style ={styles.topBar}>
          <SearchBar value={query} onChange={setQuery} />
          {/* Color Picker */}
          <Pressable onPress={() => setOpen(true)} style={styles.colorBtn}>
            <Text style={styles.colorBtnText}>Status Color</Text>
          </Pressable>
        </View>

      {/* Task List */}
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator                   // show the scrollbar
        data={filtered}
        keyExtractor={(item) => String(item.id) } // key by id
        ListEmptyComponent={
            // empty state and handle no search results
            <Text style={styles.empty}>
                {query ? 'No results. Try a different search.' : 'No tasks yet. Add your first task!'}
            </Text>}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            completeColor={state.settings.completeColor} // pass color
            onToggle={(id) => dispatch({ type: 'toggle', payload: { id } })}
            onDelete={(id) => dispatch({ type: 'delete', payload: { id } })}
          />
        )}
      />

      {/* Color Picker Modal: updates global settings via reducer */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choose Complete Color</Text>
            <View style={styles.swatchRow}>
                {SWATCHES.map(color => (
                  <Pressable
                    key={color}
                    onPress={() => {
                        dispatch({ type: 'setCompleteColor', payload: { color } }); // global update
                        setOpen(false);
                    }}
                    style={[styles.swatch, { backgroundColor: color }]}
                    />
                ))}
            </View>
            <Pressable onPress={() => setOpen(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating add button (FAB) */}
      <View pointerEvents="box-none" style={styles.fabWrap}>
        <Link href="/add" asChild>
            <Pressable style={styles.fab}>
              <Text style={styles.fabText}>＋</Text>
            </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16, paddingTop: 8, gap: 8,
    backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB',
  },
  colorBtn: {
    alignSelf: 'flex-start', backgroundColor: '#2563EB',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  colorBtnText: { color: '#fff', fontWeight: '700' },

  // Modal style
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  sheet: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sheetTitle: { fontSize: 16, fontWeight: '700' },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#D1D5DB' },
  cancelBtn: { alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 8 },
  cancelText: { color: '#2563EB', fontWeight: '700' },

  // fabWrap to position the button floats over content
  fabWrap: { position: 'absolute', right: 24, bottom: 24, zIndex: 100, elevation: 8 },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2563EB',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 30 },
});