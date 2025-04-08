import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
    size?: number;
    color?: string;
    centered?: boolean;
}

const Spinner = ({ size = 50, color = '#ffffff', centered = true }: SpinnerProps) => {
    return (
        <Wrapper $centered={centered}>
        <Circle size={size} color={color} />
        </Wrapper>
    );
};

export default Spinner;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrapper = styled.div<{ $centered: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    ${(props) => props.$centered && 'height: 100vh;'}
`;


const Circle = styled.div<{ size: number; color: string }>`
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid ${(props) => props.color};
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: ${spin} 1s linear infinite;
`;
