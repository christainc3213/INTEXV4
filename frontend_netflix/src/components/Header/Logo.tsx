import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

/*---> Component <---*/
const Logo = () => {
  const history = useHistory()

  function handleClick() {
    history.push('/')
  }

  return (
    <Image
      src='/images/misc/logo.png'
      alt='CineNiche logo'
      onClick={handleClick}
    />
  )
}

/*---> Styles <---*/
export const Image = styled.img`
  height: 60px;
  width: 200px;
  cursor: pointer;
`

export default Logo
