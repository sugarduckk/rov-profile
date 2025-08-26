import styled, { css } from 'styled-components';
import { theme, buttonStyles } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  ${buttonStyles.base}
  ${({ $size }) => buttonStyles.sizes[$size]}
  ${({ $variant }) => buttonStyles.variants[$variant]}
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
    
    @media (min-width: ${theme.breakpoints.sm}) {
      width: auto;
    }
  `}
`;

export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
