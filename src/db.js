import SQLite from "react-native-sqlite-storage";

let db = null;
SQLite.openDatabase(
  { name: "movieApp.db", location: "default" },
  (dbInstance) => {
    db = dbInstance; 
    console.log("Database opened successfully");
    createTables();
  },
  (error) => {
    console.log("Error opening database: ", error);
  }
);


const createTables = () => {
  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT, overview TEXT, release_date TEXT, is_favorite INTEGER)",
        [],
        () => {
          console.log("Movies table created or already exists");
        },
        (error) => {
          console.log("Error creating movies table: ", error); 
        }
      );
    });
  } else {
    console.log("Database is not open yet."); 
  }
};


const insertMovie = (movie) => {
  console.log("Inserting movie:", movie); 
  if (db) {
    const { id, title, overview, release_date, is_favorite } = movie;
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO movies (id, title, overview, release_date, is_favorite) VALUES (?, ?, ?, ?, ?)",
        [id, title, overview, release_date, is_favorite],
        () => {
          console.log(`Movie inserted/updated: ${title}`); 
        },
        (error) => {
          console.log("Error inserting movie: ", error); 
        }
      );
    });
  } else {
    console.log("Database not initialized yet.");
};

const getMovies = (callback) => {
  console.log("Fetching movies from database..."); 
  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM movies",
        [],
        (tx, results) => {
          let movies = [];
          for (let i = 0; i < results.rows.length; i++) {
            movies.push(results.rows.item(i));
          }
          console.log("Movies fetched from DB:", movies); 
          callback(movies); 
        },
        (error) => {
          console.log("Error fetching movies: ", error); 
        }
      );
    });
  } else {
    console.log("Database not initialized yet.");
  }
};

const toggleFavorite = (movieId, isFavorite) => {
  console.log(
    `Toggling favorite status for movie ID: ${movieId}, New Status: ${isFavorite}`
  );
  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE movies SET is_favorite = ? WHERE id = ?",
        [isFavorite ? 1 : 0, movieId],
        () => {
          console.log(`Favorite status updated for movie ID ${movieId}`);
        },
        (error) => {
          console.log("Error updating favorite status: ", error); 
        }
      );
    });
  } else {
    console.log("Database not initialized yet.");
  }
};

const getFavorites = (callback) => {
  console.log("Fetching favorite movies from database..."); 
  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM movies WHERE is_favorite = 1",
        [],
        (tx, results) => {
          let favorites = [];
          for (let i = 0; i < results.rows.length; i++) {
            favorites.push(results.rows.item(i));
          }
          console.log("Favorite movies fetched from DB:", favorites); 
          callback(favorites);
        },
        (error) => {
          console.log("Error fetching favorite movies: ", error);
        }
      );
    });
  } else {
    console.log("Database not initialized yet."); 
  }
};

export { insertMovie, getMovies, toggleFavorite, getFavorites };
