import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface HeaderComponentProps {
    showSigninButton?: boolean;
    showPlayButton?: boolean;
    movieSlug?: string;
    /** pass a .mp4 OR a .png (omit for no background) */
    backgroundSrc?: string;
    showWhiteFilm?: boolean;  // ⬅️ new prop
    children?: React.ReactNode;
}

/*---> Main Component <---*/
const HeaderComponent = ({
                             showSigninButton = false,
                             showPlayButton = false,
                             movieSlug,
                             backgroundSrc = "/whiteback.mp4",
                             showWhiteFilm = false,
                             children,
                         }: HeaderComponentProps) => {
    const navigate = useNavigate();
    const isVideo = backgroundSrc.endsWith(".mp4");

    return (
        <HeaderWrapper>
            {isVideo ? (
                <VideoBg autoPlay muted loop playsInline>
                    <source src={backgroundSrc} type="video/mp4" />
                </VideoBg>
            ) : (
                <ImageBg style={{ backgroundImage: `url(${backgroundSrc})` }} />
            )}

            {showWhiteFilm && <WhiteFilm />}

            <TopNav>
                <Logo onClick={() => navigate("/")} />
                {showSigninButton && (
                    <SigninButton onClick={() => navigate("/login")}>Sign In</SigninButton>
                )}
            </TopNav>

            <Content>{children}</Content>

            {showPlayButton && (
                <PlayButton onClick={() => navigate(`/movie/${movieSlug}`)}>Play</PlayButton>
            )}
        </HeaderWrapper>
    );
};



export default HeaderComponent;


const VideoBackground = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    z-index: 0;            /* ⬅ put it in the normal stacking context */
    pointer-events: none;
    background: #000;      /* fallback */
`;


const TopNav = styled.div`
    z-index: 2;
    display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 50px;
    

  @media (max-width: 550px) {
    padding: 20px;
  }
`;

const Content = styled.div`
    z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex: 1;
  color: white;
  padding: 0 50px;

  @media (max-width: 550px) {
    padding: 0 20px;
  }
`;

const Navbar = styled.nav`
    z-index: 2;
  max-width: 1850px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 175px;
  margin-right: auto;
  margin-left: auto;

  @media (max-width: 550px) {
    margin-bottom: 100px;
  }
`;

const Logo = styled.img.attrs({
  src: "/logo.png",
  alt: "CineNiche logo",
})`
  height: 50px;
  width: 220px;
  cursor: pointer;
`;

const SigninButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #000000;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;

  padding: 8px 16px;
  width: auto;
  height: auto;
  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    background-color: #ffffff;
    color: #000000;
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

const WhiteFilm = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.75);
    z-index: 1;
    pointer-events: none;
`;


const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
`;

const ImageBg = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
`;
/* … TopNav, Content, etc. all with z‑index:1 … */


const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 70px;
  padding: 0 20px;
  gap: 1rem; /* 👈 adds space between input + button */

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;
