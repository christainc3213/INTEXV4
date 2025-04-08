import React from "react";
import styled from "styled-components";

const FooterComponent = () => {
    return (
        <FooterWrapper>
            <FooterTitle>Questions? Contact us.</FooterTitle>
            <FooterRow>
                <FooterColumn>
                    <FooterLink href="#">FAQ</FooterLink>
                    <FooterLink href="#">Investor Relations</FooterLink>
                    <FooterLink href="/privacy">Privacy</FooterLink>
                    <FooterLink href="#">Speed Test</FooterLink>
                </FooterColumn>

                <FooterColumn>
                    <FooterLink href="#">Help Center</FooterLink>
                    <FooterLink href="#">Jobs</FooterLink>
                    <FooterLink href="#">Cookie Preferences</FooterLink>
                    <FooterLink href="#">Legal Notices</FooterLink>
                </FooterColumn>

                <FooterColumn>
                    <FooterLink href="#">Account</FooterLink>
                    <FooterLink href="#">Ways to Watch</FooterLink>
                    <FooterLink href="#">Corporate Information</FooterLink>
                    <FooterLink href="#">Only on CineNiche</FooterLink>
                </FooterColumn>

                <FooterColumn>
                    <FooterLink href="#">Media Center</FooterLink>
                    <FooterLink href="#">Terms of Use</FooterLink>
                    <FooterLink href="#">Contact Us</FooterLink>
                </FooterColumn>
            </FooterRow>
        </FooterWrapper>
    );
};

export default FooterComponent;

const FooterWrapper = styled.footer`
  max-width: 1000px;
  margin: auto;
  padding: 70px 56px;

  @media (max-width: 740px) {
    padding: 70px 30px;
  }

  @media (max-width: 500px) {
    padding: 70px 15px;
  }
`;

const FooterTitle = styled.a`
  font-size: 16px;
  color: #757575;
  margin-bottom: 50px;
`;

const FooterRow = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 740px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled.a`
  color: #757575;
  margin-bottom: 20px;
  font-size: 13px;
`;
