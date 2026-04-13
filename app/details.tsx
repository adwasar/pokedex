import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function Details() {
  const { name, id } = useLocalSearchParams();

  const formattedId = (id as string).padStart(3, '0');

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.id}>{formattedId}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  id: {
    marginTop: 8,
    fontSize: 20,
    textAlign: 'center',
  },
});
