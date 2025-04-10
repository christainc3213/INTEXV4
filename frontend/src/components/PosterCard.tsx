import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";

interface Props {
    movie: MovieType;
    posterSrc: string;
}

/* ---------- behaviour identical to MovieScrollRow ---------- */

const Card = styled.div`
  position: relative;
  min-width: 160px;
  max-width: 160px;
  height: 240px;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
  &:hover .overlay {
    transform: translateY(0%);
    pointer-events: auto;
  }
`;

const PosterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%);
  color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transform: translateY(100%);
  transition: transform 0.4s ease;
  pointer-events: none;

  h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    text-align: center;
  }
  button {
    background: #fff;
    color: #000;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      background: #eee;
    }
  }
`;

const PosterCard: React.FC<Props> = ({ movie, posterSrc }) => {
    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(`/movie/${movie.slug}`)}>
            <PosterImg
                src={posterSrc}
                alt={movie.title}
                onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg")
                }
            />
            <Overlay className="overlay">
                <h4>{movie.title}</h4>
                {/* stopPropagation so the parent onClick doesn’t fire twice */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movie.slug}`);
                    }}
                >
                    Go to Movie
                </button>
            </Overlay>
        </Card>
    );
};

export default PosterCard;
