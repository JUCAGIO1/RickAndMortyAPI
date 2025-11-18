import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CharactersListScreen from './src/screens/CharactersListScreen';
import CharacterDetailScreen from './src/screens/CharacterDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="List"
        screenOptions={{
          headerStyle: { backgroundColor: '#38AED9' },
          headerTintColor: '#fff', 
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="List"
          component={CharactersListScreen}
          options={{ title: 'Personagens Rick and Morty' }}
        />

        <Stack.Screen
          name="Details"
          component={CharacterDetailScreen}
          options={{ title: 'Detalhes do Personagem' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}