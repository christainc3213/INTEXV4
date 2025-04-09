import React, { useState } from "react";
import { handleAddMovie } from "../api/moviesAPI";
import { MovieType, GenreKey } from "../types/MovieType";
import styled from "styled-components";

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const genreKeys: GenreKey[] = [
"action",
"adventure",
"anime_int_tv",
"british_int_tv",
"children",
"comedies",
"comedy_drama_int",
"comedy_int",
"comedy_romance",
"crime_tv",
"documentaries",
"documentary_int",
"docuseries",
"dramas",
"drama_int",
"drama_romance",
"family",
"fantasy",
"horror",
"thriller_int",
"drama_romance_int_tv",
"kids_tv",
"language_tv",
"musicals",
"nature_tv",
"reality_tv",
"spirituality",
"action_tv",
"comedy_tv",
"drama_tv",
"talk_show_comedy_tv",
"thrillers",
];

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<MovieType>({
    show_id: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    release_year: 0,
    rating: "",
    duration: "",
    description: "",
    genre: "",
    slug: "",
    docId: "",
    posterFile: "",
    ...genreKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}), // Initialize all genre flags to 0
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedMovie = await handleAddMovie(formData);
      console.log("Movie saved with ID:", savedMovie.show_id);
      onSuccess();
    } catch (error) {
      console.error("Failed to save movie:", error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>
      <Row>
        <InputField>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
          />
        </InputField>

        <InputField>
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Enter movie type"
          />
        </InputField>
      </Row>

      <Row>
        <InputField>
          <label>Director</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Enter director name"
          />
        </InputField>

        <InputField>
          <label>Cast</label>
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Enter cast members"
          />
        </InputField>
      </Row>

      <Row>
        <InputField>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country of origin"
          />
        </InputField>

        <InputField>
          <label>Release Year</label>
          <input
            type="number"
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            placeholder="Enter release year"
          />
        </InputField>
      </Row>

      <Row>
        <InputField>
          <label>Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Enter movie rating"
          />
        </InputField>

        <InputField>
          <label>Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Enter duration in minutes"
          />
        </InputField>
      </Row>

      <InputField>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a brief description"
        />
      </InputField>

      <Legend>Genres</Legend>
      <Fieldset>
            <GenreGrid>
                {genreKeys.map((genre) => (
                    <GenreLabel key={genre}>
                        <GenreCheckbox
                            type="checkbox"
                            name={genre}
                            checked={!!formData[genre]}
                            onChange={handleChange}
                        />
                        <GenreText>{genre}</GenreText>
                    </GenreLabel>
                ))}
            </GenreGrid>
        </Fieldset>

      <ButtonContainer>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default NewMovieForm;

const FormContainer = styled.form`
  background-color: #2d2d2d;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;  /* Wider form container */
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    max-width: 90%;  /* Reduce width on smaller screens */
  }

  @media (max-width: 480px) {
    max-width: 100%;  /* Full width on extra small screens */
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1.5rem;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap; /* Ensures the inputs wrap on smaller screens */
`;

const Fieldset = styled.fieldset`
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 8px;
  background-color:rgb(31, 30, 30);
`;

const Legend = styled.legend`
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (min-width: 750px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const GenreLabel = styled.label`
  display: flex;
  align-items: center;
  color: white;
`;

const GenreCheckbox = styled.input`
  accent-color: rgb(36, 136, 251);
`;

const GenreText = styled.span`
  margin-left: 0.5rem;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* Allow inputs to take equal width */
  min-width: 250px; /* Set a minimum width to avoid inputs becoming too small */

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: white;
  }

  input,
  textarea {
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    margin-bottom: 1rem;
  }

  textarea {
    height: 120px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;
