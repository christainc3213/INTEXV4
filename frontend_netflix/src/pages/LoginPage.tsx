import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
// 🔥 Removed: import firebase from '../lib/firebase.prod'
import HeaderWrapper from '../components/Header/HeaderWrapper'
import Navbar from '../components/Header/Navbar'
import Logo from '../components/Header/Logo'
import FooterCompound from '../compounds/FooterCompound'
import SignFormWrapper from '../components/SignForm/SignFormWrapper'
import SignFormBase from '../components/SignForm/SignFormBase'
import SignFormTitle from '../components/SignForm/SignFormTitle'
import SignFormInput from '../components/SignForm/SignFormInput'
import SignFormButton from '../components/SignForm/SignFormButton'
import SignFormText from '../components/SignForm/SignFormText'
import SignFormLink from '../components/SignForm/SignFormLink'
import SignFormCaptcha from '../components/SignForm/SignFormCaptcha'
import SignFormError from '../components/SignForm/SignFormError'
import Warning from '../components/Feature/Warning'

/*---> Component <---*/
const SigninPage = () => {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const IsInvalid = password === '' || emailAddress === ''

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch('http://localhost:5206/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const result = await response.json()
      // Optionally store JWT token
      // localStorage.setItem('token', result.token)

      setEmailAddress('')
      setPassword('')
      setError('')
      history.push('/browse')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignupClick = () => {
    history.push('/signup')
    const HeaderElement: HTMLElement | null = document.getElementById('header')
    HeaderElement?.scrollIntoView()
  }

  return (
      <>
        <HeaderWrapper>
          <Navbar>
            <Logo />
          </Navbar>
          <SignFormWrapper>
            <SignFormBase onSubmit={handleSubmit} method='POST'>
              <Warning>NOT official NetShow</Warning>
              <SignFormTitle>Sign in</SignFormTitle>
              {error ? <SignFormError>{error}</SignFormError> : null}
              <SignFormInput
                  type='text'
                  placeholder='Email Address'
                  value={emailAddress}
                  onChange={({ target }) => setEmailAddress(target.value)}
              />
              <SignFormInput
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
              />
              <SignFormButton disabled={IsInvalid} type='submit'>
                Sign In
              </SignFormButton>
              <SignFormText>
                New to NetShow?
                <SignFormLink onClick={handleSignupClick}>
                  Sign up now.
                </SignFormLink>
              </SignFormText>
              <SignFormCaptcha>
                This page is protected by Google reCAPTCHA to ensure you are not a
                bot.
              </SignFormCaptcha>
            </SignFormBase>
          </SignFormWrapper>
        </HeaderWrapper>
        <FooterCompound />
      </>
  )
}

export default SigninPage
