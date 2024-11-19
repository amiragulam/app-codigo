import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const TMDB_API_KEY = "23acc5a70dcbd07514d0b4a287fad790";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetail() {
  const route = useRoute();
  const { movieId } = route.params;
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
          },
        });
        setMovieDetail(response.data);
      } catch (err) {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.poster}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`,
        }}
      />
      <Text style={styles.title}>{movieDetail.title}</Text>
      <Text style={styles.releaseDate}>
        Release Date: {movieDetail.release_date}
      </Text>
      <Text style={styles.overview}>{movieDetail.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  releaseDate: {
    fontSize: 16,
    marginVertical: 5,
  },
  overview: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
});
