import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      <Text style={styles.title}>{name}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
