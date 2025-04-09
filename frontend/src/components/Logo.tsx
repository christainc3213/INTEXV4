import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Logo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <StyledImage
      src="/logo.png" // ← direct path from /public
      alt="CineNiche logo"
      onClick={handleClick}
    />
  );
};

const StyledImage = styled.img`
  height: 50px;
  width: 220px;
  cursor: pointer;
`;

export default Logo;
