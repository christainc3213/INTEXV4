import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface HeaderComponentProps {
    showSigninButton?: boolean;
    showPlayButton?: boolean;
    movieSlug?: string;
    children?: ReactNode;
}

/*---> Main Component <---*/
const HeaderComponent = ({
                             showSigninButton = false,
                             showPlayButton = false,
                             movieSlug,
                             children,
                         }: HeaderComponentProps) => {
    const navigate = useNavigate();

    return (
        <HeaderWrapper>
            <TopNav>
                <Logo onClick={() => navigate("/")} />
                {showSigninButton && (
                    <SigninButton onClick={() => navigate("/login")}>
                        Sign In
                    </SigninButton>
                )}
            </TopNav>

            <Content>{children}</Content>

            {showPlayButton && (
                <PlayButton onClick={() => navigate(`/movie/${movieSlug}`)}>
                    Play
                </PlayButton>
            )}
        </HeaderWrapper>

    );
};

export default HeaderComponent;



const HeaderWrapper = styled.div`
    background: url("/bigback.png");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;

    width: 100%;
    height: 100vh;

    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    box-sizing: border-box;
`;





const TopNav = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 50px; /* 👈 Padding inside, not outside */

    @media (max-width: 550px) {
        padding: 20px;
    }
`;


const Content = styled.div`
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
    align-items: center;     /* ✅ vertical centering */
    justify-content: center; /* ✅ horizontal centering */

    background-color: #000000;
    color: #ffffff;
    font-size: 14px;          /* ✅ smaller text */
    font-weight: 600;
    border-radius: 10px;

    padding: 8px 16px;        /* ✅ less padding = smaller button */
    width: auto;              /* ✅ shrink-wrap to content */
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



