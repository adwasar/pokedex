import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';

interface Pokemon {
  name: string;
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

  console.log(JSON.stringify(pokemons[0]?.types[0], null, 2));

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20');
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
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
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: pokemon.image }} style={{ width: 150, height: 150 }} />
            <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
          </View>
        </View>
      ))}
      <View></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
});
