import React from "react";
import styled from "styled-components";

/*---> Component <---*/
const FooterLink = ({ children, href = "#" }: PropsType) => {
  return <Link href={href}>{children}</Link>;
};

/*---> Styles <---*/
export const Link = styled.a`
  color: #757575;
  margin-bottom: 20px;
  font-size: 13px;
`;

/*---> Interfaces <---*/
interface PropsType {
  children?: string;
  href?: string;
}

export default FooterLink;
