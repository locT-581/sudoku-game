/* eslint-disable react/jsx-boolean-value */
import { Backdrop } from '@mui/material';
import { ReactElement } from 'react';

interface GameBackdropType {
  children: ReactElement;
}

function GameBackdrop({ children }: GameBackdropType) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      {children}
    </Backdrop>
  );
}

export default GameBackdrop;
