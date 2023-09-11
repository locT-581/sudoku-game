import React from 'react';
import { ButtonProps } from 'typings/Button';

function Button({ children, className, onClick }: ButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
export default Button;
