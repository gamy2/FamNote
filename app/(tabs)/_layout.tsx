import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor:'#003B385c',
        tabBarActiveTintColor:  '#0F9E99',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) =><MaterialCommunityIcons name="sticker-emoji" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Family',
          tabBarIcon: ({ color }) => <MaterialIcons name="family-restroom" size={24} color={color} />
        }}
      />
        <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
