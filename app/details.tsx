import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

interface Variety {
  name: string;
  default: boolean;
  image: string;
}

export default function Details() {
  const [varieties, setVarieties] = useState<Variety[] | null>(null);

  const { name, id } = useLocalSearchParams();

  const formattedId = (id as string).padStart(3, '0');

  useEffect(() => {
    const fetchPokemonSpecies = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const data = await response.json();

        const varietiesList = await Promise.all(
          data.varieties.map(async (variety: { pokemon: { url: string } }) => {
            const response = await fetch(variety.pokemon.url);
            const data = await response.json();

            return {
              name: data.name,
              default: data.is_default,
              image: data.sprites.front_default,
            };
          }),
        );

        setVarieties(varietiesList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemonSpecies();
  }, [name]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <Text style={styles.titlePrimary}>{name}</Text>
      <Text style={styles.id}>{formattedId}</Text>
      <View>
        <Text style={[styles.titleSecondary, { marginTop: 16 }]}>Forms:</Text>
        {varieties?.map((variety) => (
          <View key={variety.name}>
            <Text>{variety.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titlePrimary: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  titleSecondary: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  id: {
    marginTop: 8,
    fontSize: 20,
    textAlign: 'center',
  },
});
