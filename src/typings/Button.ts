import React, { ReactElement } from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
  to?: string;
  disable?: boolean;
  bg: string;
  children?: ReactElement;
  className?: string;
  onClick?: () => void;
}
