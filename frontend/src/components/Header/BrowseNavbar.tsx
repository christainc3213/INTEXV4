import styled from "styled-components";
import { ReactNode } from "react";

/*---> Interfaces <---*/
interface Props {
    children?: ReactNode;
}

/*---> Component <---*/
const BrowseNavbar = ({ children }: Props) => {
    return <StyledWrapper>{children}</StyledWrapper>;
};

/*---> Styles <---*/
const StyledWrapper = styled.nav`
  max-width: 1850px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 175px;
  margin-right: auto;
  margin-left: auto;
`;

export default BrowseNavbar;
