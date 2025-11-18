import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const CharacterDetailScreen = ({ route }) => {
  // Pega o 'characterId' passado como parâmetro na navegação
  const { characterId } = route.params;

  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const url = `https://rickandmortyapi.com/api/character/${characterId}`;
        const response = await axios.get(url);
        setCharacter(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do personagem:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  // Tela de carregamento
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Se o personagem não for encontrado
  if (!character) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Personagem não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailContainer}>
        <Image style={styles.detailImage} source={{ uri: character.image }} />
        <Text style={styles.detailTitle}>{character.name}</Text>
        
        <Text style={styles.detailText}>Status: {character.status}</Text>
        <Text style={styles.detailText}>Espécie: {character.species}</Text>
        <Text style={styles.detailText}>Gênero: {character.gender}</Text>
        <Text style={styles.detailText}>Origem: {character.origin.name}</Text>
        <Text style={styles.detailText}>Localização: {character.location.name}</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#67C22E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#67C22E',
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#326B2C'
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
});

export default CharacterDetailScreen;