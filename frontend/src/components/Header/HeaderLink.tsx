import styled from "styled-components";

/*---> Component <---*/
interface Props {
    children: React.ReactNode;
    onClick: () => void;
}

const HeaderLink = ({ children, ...rest }: Props) => {
    return <StyledWrapper {...rest}>{children}</StyledWrapper>;
};

/*---> Styles <---*/
const StyledWrapper = styled.div`
  padding: 5px;
  color: #fff;
  margin-left: 25px;
  cursor: pointer;
  font-weight: normal;
`;

export default HeaderLink;
