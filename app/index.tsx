import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';

import { colorsByType } from '@/constants/colorsByType';

interface Pokemon {
  name: string;
  id: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=10');
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string; id: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            id: details.id,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        }),
      );

      setPokemons(detailedPokemons);
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{ pathname: '/details', params: { name: pokemon.name, id: pokemon.id } }}
          style={{
            // @ts-ignore
            backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
            padding: 20,
            borderRadius: 20,
          }}
        >
          <View>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: pokemon.image }} style={{ width: 150, height: 150 }} />
              <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
});
