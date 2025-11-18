import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,Image,TouchableOpacity,ActivityIndicator,StyleSheet,TextInput } from 'react-native';
import axios from 'axios';

const CharacterCard = ({ character, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image style={styles.image} source={{ uri: character.image }} />
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{character.name}</Text>
      <Text style={styles.details}>{character.status} - {character.species}</Text>
    </View>
  </TouchableOpacity>
);

const CharactersListScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCharacters = async (pageNumber = 1, shouldRefresh = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (searchText) {
         const url = `https://rickandmortyapi.com/api/character/${searchText}`;
         const response = await axios.get(url);
         
         setCharacters([response.data]);
         setHasMore(false);
      } 
      else {
         const url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;
         const response = await axios.get(url);

         if (shouldRefresh) {
           setCharacters(response.data.results);
         } else {
           setCharacters(prev => [...prev, ...response.data.results]); 
         }

         setHasMore(!!response.data.info.next);
      }

    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      if (shouldRefresh) setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchCharacters(1, true); 
  }, [searchText]);

  const loadMoreItem = () => {
    if (!searchText && !isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage, false);
    }
  };

  const renderFooter = () => {
    if (!isLoading || searchText) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  const handleCardPress = (characterId) => {
    navigation.navigate('Details', { characterId: characterId });
  };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Digite o ID do personagem (ex: 1)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => handleCardPress(item.id)}
          />
        )}
        // Scrollagem Infinita 
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}

        ListEmptyComponent={
          !isLoading && <Text style={styles.emptyText}>Nenhum personagem encontrado.</Text>
        }
      />
      
      {isLoading && characters.length === 0 && (
         <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color="#4CAF50" />
           <Text style={{ marginTop: 10 }}>Buscando...</Text>
         </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#326B2C',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    fontSize: 16,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240,240,240, 0.8)', 
    zIndex: 1,
  },

  loadingFooter: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#9DE384',
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