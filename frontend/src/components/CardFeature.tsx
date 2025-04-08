import React, { useState } from 'react';
import styled from 'styled-components';
import { MovieType } from "../types/MovieType";
import { useNavigate } from "react-router-dom";

interface CardFeatureProps {
    movie: MovieType;
    onClose: () => void;
}

const CardFeature = ({ movie, onClose }: CardFeatureProps) => {
    const [showPlayer, setShowPlayer] = useState(false);
    const navigate = useNavigate();

    return (
        <FeatureWrapper style={{ backgroundImage: `url(/images/films/${movie.genre}/${movie.slug}/large.jpg)` }}>
            <CloseButton onClick={onClose}>
                <img src="/images/icons/close.png" alt="Close" />
            </CloseButton>
            <Title>{movie.title}</Title>
            <Description>{movie.description}</Description>
            <PlayButton onClick={() => navigate(`/movie/${movie.slug}`)}>
                Watch Now
            </PlayButton>

            {showPlayer && (
                <Overlay onClick={() => setShowPlayer(false)}>
                    <Video controls>
                        <source src="/videos/video.mp4" type="video/mp4" />
                    </Video>
                </Overlay>
            )}
        </FeatureWrapper>
    );
};

export default CardFeature;

const FeatureWrapper = styled.div`
  background-size: contain;
  position: relative;
  height: 360px;
  background-position-x: right;
  background-repeat: no-repeat;
  background-color: black;
  padding-top: 30px;
`;

const Title = styled.h1`
  color: white;
  max-width: 500px;
  font-size: 32px;
  font-weight: bold;
  margin: 0 20px 10px;
`;

const Description = styled.p`
  color: white;
  max-width: 500px;
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`;

const PlayButton = styled.button`
  box-shadow: 0 0.6vw 1vw -0.4vw rgba(0, 0, 0, 0.35);
  background-color: #e6e6e6;
  border-width: 0;
  padding: 10px 35px;
  border-radius: 5px;
  max-width: 130px;
  font-size: 20px;
  margin: 25px 20px 0;
  cursor: pointer;
  text-align: center;
  color: #000;
  transition: 0.4s ease;
  outline: 0;

  &:hover {
    background: #ff1e1e;
    color: white;
  }
`;

const CloseButton = styled.button`
  color: white;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  outline: none;

  img {
    filter: brightness(0) invert(1);
    width: 24px;
  }
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const Video = styled.video`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;
