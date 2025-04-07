import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

/*---> Component <---*/
const SigninButton = ({ children }: PropsType) => {
  const history = useHistory()

  const handleClick = () => {
    history.push('/signin')
  }

  return <LinkButton onClick={handleClick}>{children}</LinkButton>
}

/*---> Styles <---*/
export const LinkButton = styled.div`
  display: inline-block;
  align-items: center;     // Vertically centers text
  justify-content: center; // Horizontally centers text
  background-color: #ffffff;
  color: #000000;
  font-size: 15px;
  font-weight: bold;
  border-radius: 10px;
  padding: 8px 14px;       // Less padding for a shorter height
  height: 36px;            // Optional fixed height for consistency
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
`

/*---> Interfaces <---*/
interface PropsType {
  children?: string
}

export default SigninButton
