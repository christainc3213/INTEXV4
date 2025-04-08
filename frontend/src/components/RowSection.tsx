import React from 'react';
import styled from 'styled-components';
import { MovieType } from '../types/MovieType';

interface RowSectionProps {
    title: string;
    movies: MovieType[];
    category: string;
    onCardClick: (movie: MovieType) => void; // not Dispatch<SetStateAction<...>>
}

const RowSection = ({ title, movies, category, onCardClick }: RowSectionProps) => {
    return (
        <SectionWrapper>
            <Title>{title}</Title>
            <CardRow>
                {movies.map((movie) => (
                    <Card key={movie.docId}>
                        <Image
                            src={`/images/${category}/${movie.genre}/${movie.slug}/small.jpg`}
                            onClick={() => onCardClick(movie)}
                        />
                    </Card>
                ))}
            </CardRow>
        </SectionWrapper>
    );
};

export default RowSection;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const Title = styled.div`
  font-size: 24px;
  color: #1B1F23;
  font-weight: bold;
  margin-bottom: 20px;

  @media (max-width: 650px) {
    text-align: center;
  }
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Card = styled.div`
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.25);
  }
`;

const Image = styled.img`
  border: 0;
  width: 100%;
  max-width: 305px;
  cursor: pointer;
  height: auto;
  padding: 0 5px;
`;
