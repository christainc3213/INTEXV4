import React, { useState } from "react";
import { handleEditMovie } from "../api/moviesAPI";
import { MovieType, GenreKey } from "../types/MovieType";
import styled from "styled-components";

interface EditMovieFormProps {
    movie: MovieType;
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

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
    // Initialize formData state to the movie data, ensuring that genre flags are either 1 or 0
    const [formData, setFormData] = useState<MovieType>(() => {
      // Ensure that each genre flag is initialized as 1 (checked) or 0 (unchecked)
      const initializedMovie = { ...movie };
      genreKeys.forEach((genre) => {
        if (!(genre in initializedMovie)) {
          initializedMovie[genre] = 0; // Default unchecked
        }
      });
      return initializedMovie;
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, type, value } = event.target as HTMLInputElement;
        const checked = (event.target as HTMLInputElement).checked;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };
      
      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                await handleEditMovie(formData.show_id, formData); // Wait for the API call to complete
                onSuccess(); // Call onSuccess only after the API call succeeds
            } catch (error) {
                console.error("Failed to edit movie:", error);
            }
        };

  return (
    <FormContainer onSubmit={handleSubmit}>
        <Title>Edit Movie</Title>

        <InputGrid>
            <InputGroup>
                <Label>Title</Label>
                <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter movie title"
                />
            </InputGroup>

            <InputGroup>
                <Label>Type</Label>
                <Input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Enter movie type"
                />
            </InputGroup>

            <InputGroup>
                <Label>Director</Label>
                <Input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    placeholder="Enter director name"
                />
            </InputGroup>

            <InputGroup>
                <Label>Cast</Label>
                <Input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleChange}
                    placeholder="Enter cast members"
                />
            </InputGroup>

            <InputGroup>
                <Label>Country</Label>
                <Input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter movie's country of origin"
                />
            </InputGroup>

            <InputGroup>
                <Label>Release Year</Label>
                <Input
                    type="number"
                    name="release_year"
                    value={formData.release_year}
                    onChange={handleChange}
                    placeholder="Enter release year"
                />
            </InputGroup>

            <InputGroup>
                <Label>Rating</Label>
                <Input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Enter movie rating"
                />
            </InputGroup>

            <InputGroup>
                <Label>Duration</Label>
                <Input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Enter duration in minutes"
                />
            </InputGroup>

            <InputGroup colSpan={2}>
                <Label>Description</Label>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter a brief description"
                />
            </InputGroup>
        </InputGrid>

        <Legend>Genres</Legend>
        <Fieldset>
            <GenreGrid>
                {genreKeys.map((genre) => (
                <GenreLabel key={genre}>
                    <GenreCheckbox
                    type="checkbox"
                    name={genre}
                    checked={formData[genre] === 1}
                    onChange={handleChange}
                    />
                    <GenreText>{genre}</GenreText>
                </GenreLabel>
                ))}
            </GenreGrid>
            </Fieldset>

            <ButtonContainer>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
            </ButtonContainer>
        </FormContainer>
    );
};

export default EditMovieForm;

const FormContainer = styled.form`
  background-color: #2d2d2d;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;  /* Increase max-width to make the form wider */
  width: 100%;  /* Allow the form to take up 100% of the available width */
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-align: center;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputGroup = styled.div<{ colSpan?: number }>`
  display: flex;
  flex-direction: column;
  ${({ colSpan }) => colSpan && `grid-column: span ${colSpan};`}
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ccc;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;