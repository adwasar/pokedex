import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, Pressable } from 'react-native';

import { colorsByType } from '@/constants/colorsByType';

interface Variety {
  name: string;
  default: boolean;
  image: string;
  types: PokemonType[];
  active: boolean;
  description: string;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
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
            const typeNames = data.types.map((item: PokemonType) => item.type.name).join(', ');
            const description = [`Form: ${data.name}`, `Types: ${typeNames}`, `Height: ${data.height}`, `Weight: ${data.weight}`].join(
              '\n',
            );

            return {
              name: data.name,
              default: data.is_default,
              image: data.sprites.front_default,
              types: data.types,
              active: data.name === name,
              description,
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

  const onPressFormCard = (selectedName: string) => {
    setVarieties((previousVarieties) => {
      if (!previousVarieties) {
        return previousVarieties;
      }

      return previousVarieties.map((variety) => ({
        ...variety,
        active: variety.name === selectedName,
      }));
    });
  };

  const activeVariety = varieties?.find((variety) => variety.active);

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
        <ScrollView
          contentContainerStyle={{
            gap: 16,
          }}
          style={styles.formList}
          horizontal
        >
          {varieties?.map((pokemon) => (
            <View key={pokemon.name}>
              <Pressable
                onPress={() => onPressFormCard(pokemon.name)}
                style={[
                  styles.formCard,
                  { backgroundColor: colorsByType[pokemon.types[0].type.name] + 50, opacity: pokemon.active ? 1 : 0.5 },
                ]}
              >
                <Image source={{ uri: pokemon.image }} style={styles.formImage} />
                <Text style={styles.formName}>{pokemon.name}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.descriptionSection}>
        <Text style={[styles.titleSecondary, { marginTop: 24 }]}>Details</Text>
        <Text style={styles.description}>{activeVariety?.description}</Text>
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
  formList: {
    marginTop: 16,
  },
  formCard: {
    padding: 8,
    borderRadius: 8,
  },
  formImage: {
    width: 92,
    height: 92,
  },
  formName: {
    fontSize: 10,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  descriptionSection: {
    alignItems: 'flex-start',
  },
});
