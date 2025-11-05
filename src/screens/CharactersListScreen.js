import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

// --- Componentes ---

/* Componente do Card do Personagem (Usado na FlatList)*/
const CharacterCard = ({ character, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image style={styles.image} source={{ uri: character.image }} />
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{character.name}</Text>
      <Text style={styles.details}>{character.status} - {character.species}</Text>
    </View>
  </TouchableOpacity>
);

// --- Tela de Listagem ---

const CharactersListScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para fazer a requisição
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const url = 'https://rickandmortyapi.com/api/character';
        const response = await axios.get(url);
        // Armazena a lista de personagens
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Erro ao buscar personagens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Carregamento 
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Buscando Personagens...</Text>
      </View>
    );
  }

  // Função para lidar com o clique e navegar
  const handleCardPress = (characterId) => {
    navigation.navigate('Details', { characterId: characterId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => handleCardPress(item.id)}
          />
        )}
      />
    </View>
  );
};

// --- Estilos da Lista ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
});

export default CharactersListScreen;