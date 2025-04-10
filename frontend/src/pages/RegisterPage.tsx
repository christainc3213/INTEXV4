import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefillEmail = params.get("email");
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [location.search]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const safeJson = async (response: Response) => {
    const length = response.headers.get("content-length");
    if (length && parseInt(length) > 0) {
      return await response.json();
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Enforce new password requirements (12+ characters, at least 1 uppercase, 1 number)
    if (!/^(?=.*[A-Z])(?=.*\d).{12,}$/.test(password)) {
      setError(
        "Password must be at least 12 characters long, include at least 1 uppercase letter and 1 number."
      );
      return;
    }

    try {
      const registerResponse = await fetch("https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const registerResult = await safeJson(registerResponse);

      if (!registerResponse.ok) {
        throw new Error(registerResult?.message || "Error registering.");
      }

      const loginUrl = "https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net/login?useCookies=true";
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const loginResult = await safeJson(loginResponse);

      if (!loginResponse.ok) {
        throw new Error(
          loginResult?.message || "Login failed after registration."
        );
      }

      navigate("/browse");
    } catch (error: any) {
      console.error("Error in registration flow:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <HeaderComponent backgroundSrc="/bigback.png" >
      <LoginHeroContent>
        <h1>Create Account</h1>
        <h2>Join CineNiche today</h2>

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
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <OptFormButton type="submit">
            <span>Register</span>
            <img src="/icons/chevron-right.png" alt="Register" />
          </OptFormButton>

          <RegisterText>
            Already have an account?{" "}
            <span onClick={handleLoginClick}>Log in</span>
          </RegisterText>
        </FormWrapper>
      </LoginHeroContent>
    </HeaderComponent>
  );
}
export default Register;

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
    accent-color: #fff;
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
