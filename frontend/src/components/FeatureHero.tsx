import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
    title: string;
    subtitle: string;
    movieSlug?: string;
}

const FeatureHero = ({ title, subtitle, movieSlug }: Props) => {
    const [showPlayer, setShowPlayer] = useState(false);

    const handlePlayClick = () => {
        if (movieSlug) {
            setShowPlayer(true);
        } else {
            console.warn('No movieSlug provided for PlayButton');
        }
    };

    return (
        <Wrapper>
            <InnerWrapper>
                <Title>{title}</Title>
                <SubTitle>{subtitle}</SubTitle>

                <PlayButton onClick={handlePlayClick}>
                    Watch Now
                </PlayButton>

                {showPlayer && (
                    <Overlay onClick={() => setShowPlayer(false)}>
                        <Video controls>
                            <source src="/videos/video.mp4" type="video/mp4" />
                        </Video>
                    </Overlay>
                )}
            </InnerWrapper>
        </Wrapper>
    );
};

export default FeatureHero;

const Wrapper = styled.section`
  background: url('/images/misc/patman.jpg');
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 30px 50px;

  @media (max-width: 550px) {
    padding: 20px;
  }
`;

const InnerWrapper = styled.div``;

const Title = styled.h1`
  color: white;
  max-width: 640px;
  font-size: 50px;
  font-weight: 700;
  line-height: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
  margin-bottom: 20px;

  @media (max-width: 550px) {
    font-size: 30px;
  }
`;

const SubTitle = styled.h2`
  max-width: 640px;
  color: white;
  font-size: 22px;
  font-weight: 500;
  line-height: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);

  @media (max-width: 550px) {
    font-size: 18px;
  }
`;

const PlayButton = styled.button`
  box-shadow: 0 0.6vw 1vw -0.4vw rgba(0, 0, 0, 0.35);
  background-color: #e6e6e6;
  border-width: 0;
  padding: 10px 35px;
  border-radius: 5px;
  max-width: 130px;
  font-size: 20px;
  margin-top: 25px;
  cursor: pointer;
  text-align: center;
  color: #000;
  transition: 0.4s ease;
  margin-bottom: 200px;
  outline: 0;

  &:hover {
    background: #ff1e1e;
    color: white;
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
