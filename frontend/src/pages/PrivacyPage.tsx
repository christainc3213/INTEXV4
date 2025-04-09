import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageWrapper>
        <TopNav>
          <Logo onClick={() => navigate("/")} />
        </TopNav>

        <ContentContainer>
          <h1>Privacy Policy for CineNiche</h1>
          <p>
            <strong>Effective Date:</strong> <i>April 7, 2025</i>
          </p>

          <p>
            At CineNiche, your privacy is important to us. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our web application.
          </p>

          <SectionTitle>1. Information We Collect</SectionTitle>
          <p>
            When you use CineNiche, we may collect the following types of
            personal information:
          </p>
          <ul>
            <li>
              <strong>Location Data:</strong> City, State, ZIP code
            </li>
            <li>
              <strong>Demographic Data:</strong> Age, Gender
            </li>
            <li>
              <strong>Preference Data:</strong> Viewing history, likes,
              interactions
            </li>
          </ul>

          <SectionTitle>2. How We Use Your Information</SectionTitle>
          <p>We use your information for:</p>
          <ul>
            <li>Personalizing your content experience</li>
            <li>Generating machine learning-based recommendations</li>
            <li>Improving our platform and user experience</li>
            <li>Analyzing user trends and behavior</li>
          </ul>

          <SectionTitle>3. Data Sharing and Disclosure</SectionTitle>
          <p>
            We do not sell or rent your data. We may share anonymized analytics
            data with partners, and limited personal data with trusted service
            providers bound by confidentiality.
          </p>

          <SectionTitle>4. Data Security</SectionTitle>
          <p>
            We protect your data with encryption, access controls, and secure
            storage practices.
          </p>

          <SectionTitle>5. Your Choices</SectionTitle>
          <p>You may:</p>
          <ul>
            <li>Update your personal info in your account settings</li>
            <li>Request account and data deletion</li>
            <li>
              Opt out of personalized recommendations (note: this may affect
              your experience)
            </li>
          </ul>

          <SectionTitle>6. Children’s Privacy</SectionTitle>
          <p>
            CineNiche does not knowingly collect data from users under 13. If
            discovered, we will promptly delete such data.
          </p>

          <SectionTitle>7. Changes to This Policy</SectionTitle>
          <p>
            We may update this policy periodically. Significant changes will be
            communicated via app/email. Continued use of CineNiche implies
            acceptance.
          </p>

          <SectionTitle>8. Contact Us</SectionTitle>
          <p>
            If you have any questions, reach out at: <br />
            <strong>Email:</strong> support@cineniche.com
          </p>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default PrivacyPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 0px 24px 60px 24px;

  background-image: url("/bigback.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  color: black;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.8);
  padding: 50px;
  border-radius: 12px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  color: black;
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

const Logo = styled.img.attrs({
  src: "/logo.png",
  alt: "CineNiche logo",
})`
  height: 50px;
  width: 220px;
  cursor: pointer;
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 26px; /* 👈 Padding inside, not outside */

  @media (max-width: 550px) {
    padding: 20px;
  }
`;

const WhiteBox = styled.div`
  background: white;
  color: black;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  max-width: 850px;
  margin: 80px auto; // centers the box with spacing
  backdrop-filter: blur(6px);
`;
