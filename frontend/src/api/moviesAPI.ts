import { MovieType } from "../types/MovieType";

interface fetchMoviesResponse {
  json(): unknown;
  movies: MovieType[];
  totalNumMovies: number;
}

const API_URL =
  "https://https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net//MainDb";

export const fetchMovies = async (
  pageSize = 10,
  pageNumber = 1,
  searchTerm = ""
) => {
  const query = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageNumber: pageNumber.toString(),
  });

  if (searchTerm.trim()) {
    query.append("search", searchTerm.trim());
  }

  const response = await fetch(`${API_URL}?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return await response.json();
};

export const handleAddMovie = async (
  newMovie: MovieType
): Promise<MovieType> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error(`Error adding movie: ${response.statusText}`);
    }

    const savedMovie: MovieType = await response.json(); // will now include show_id
    return savedMovie;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const handleEditMovie = async (
  show_id: string,
  updatedMovie: MovieType
): Promise<MovieType> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${show_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(updatedMovie), // Convert the new book object to a JSON string
    });

    if (!response.ok) {
      throw new Error(`Error updating book: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating Book:`, error);
    throw error;
  }
};

export const deleteMovie = async (show_id?: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${show_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
