import React from 'react';
import { Stack } from 'expo-router';
import { TaskProvider } from '../lib/store';
import { SafeAreaView, StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <TaskProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShadowVisible: false }}>
          <Stack.Screen name="index" options={{ title: 'Tasks' }} />
          <Stack.Screen name="add" options={{ title: 'Add Task' }} />
          <Stack.Screen name="task/[id]" options={{ title: 'Task Details' }} />
          <Stack.Screen name="edit/[id]" options={{ title: 'Edit Task' }} />
        </Stack>
      </SafeAreaView>
    </TaskProvider>
  );
}
