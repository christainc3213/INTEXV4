import styled from "styled-components";
import Logo from "./Logo";

const MainHeader = () => {
  return (
    <TopNav>
      <Logo />
      {/* <Navbar /> */}
    </TopNav>
  );
};

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

export default MainHeader;
