import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const TMDB_API_KEY = "23acc5a70dcbd07514d0b4a287fad790";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function HomeScreen() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const popularResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/popular`,
          {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }
        );
        setPopularMovies(popularResponse.data.results);

        const upcomingResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/upcoming`,
          {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }
        );
        setUpcomingMovies(upcomingResponse.data.results);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovie = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
    >
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={() => setLoading(true)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Popular Movies</Text>
      <FlatList
        data={popularMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.header}>Upcoming Movies</Text>
      <FlatList
        data={upcomingMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  movieItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    width: "100%",
    borderRadius: 5,
  },
  movieTitle: {
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
