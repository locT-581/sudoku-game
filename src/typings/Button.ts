import React, { ReactElement } from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  to?: string;
  disable?: boolean;
  children?: ReactElement;
  className?: string;
  onClick?: () => void;
}
