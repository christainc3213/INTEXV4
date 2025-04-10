import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setRememberme(checked);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // handle submit event for the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const loginUrl = rememberme
      ? "https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net/login?useCookies=true"
      : "https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net/login?useSessionCookies=true";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include", // ✅ Ensures cookies are sent & received
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Ensure we only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      navigate("/browse");
    } catch (error: any) {
      setError(error.message || "Error logging in.");
      console.error("Fetch attempt failed:", error);
    }
  };

  return (
    <HeaderComponent backgroundSrc="/bigback.png"
                     showSigninButton={false}>
      {/* <LoginBox> */}
      <LoginHeroContent>
        <h1>Welcome Back</h1>
        <h2>Please log in to continue</h2>

        <FormWrapper onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
          />
          <StyledInput
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <CheckboxWrapper>
            <input
              type="checkbox"
              id="rememberme"
              name="rememberme"
              checked={rememberme}
              onChange={handleChange}
            />
            <label htmlFor="rememberme">Remember me</label>
          </CheckboxWrapper>
          {error && <ErrorText>{error}</ErrorText>}

          <OptFormButton type="submit">
            <span>Sign In</span>
            <img src="/icons/chevron-right.png" alt="Sign In" />
          </OptFormButton>

          <RegisterText>
            Don’t have an account?{" "}
            <span onClick={handleRegisterClick}>Register here</span>
          </RegisterText>
        </FormWrapper>
      </LoginHeroContent>
      {/* </LoginBox> */}
    </HeaderComponent>
  );
}

export default LoginPage;

import styled from "styled-components";

const LoginHeroContent = styled.div`
  max-width: 400px;
  margin: 0 auto;
  color: black;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 2rem;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 0 20px;
`;

const StyledInput = styled.input`
  width: 120%;
  max-width: 400px;
  height: 50px;
  padding: 0 15px;
  border-radius: 999px;
  border: none;
  font-size: 16px;
  outline: none;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: black;

  input {
    accent-color: #ffffff;
  }
`;

const ErrorText = styled.p`
  color: #ff4d4d;
  margin: 0;
  font-size: 14px;
`;

const RegisterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: black;

  span {
    color: rgb(98, 98, 98);
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
`;

const OptFormButton = styled.button`
  position: relative;
  overflow: hidden;
  width: fit-content;
  height: 45px;
  background: #000;
  color: white;
  padding: 0 32px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 999px;

  img {
    margin-left: 10px;
    filter: brightness(0) invert(1);
    width: 14px;
    transition: filter 0.4s ease;
    position: relative;
    z-index: 3;
  }

  span {
    font-size: 16px;
    z-index: 3;
    color: white;
    transition: color 0.4s ease;
  }

  &:hover img {
    filter: none;
  }

  @media (max-width: 950px) {
    span {
      font-size: 14px;
    }
  }
`;

// const LoginBox = styled.div`
//   background: rgba(0, 0, 0, 0.25); /* 👈 semi-transparent black */
//   padding: 40px 30px;
//   border-radius: 16px;
//   max-width: 420px;
//   width: 100%;
//   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
//   backdrop-filter: blur(5px);
//   color: white;
//   margin: 0 auto;

//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;
