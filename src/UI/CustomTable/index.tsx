import styled from '@emotion/styled';
import { TableContainer } from '@mui/material';

const CustomTable = styled(TableContainer)(() => ({
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  margin: '0px -2px',

  '& .MuiTable-root': {
    width: '100%',
    height: '100%',
  },
  '& .MuiTableBody-root': {
    width: '100%',
    height: '100%',
    margin: '0px',
    padding: '0px',
  },
  '& .MuiTableCell-root': {
    fontFamily: '"Mansalva", cursive',
    fontSize: '1.5rem',
    width: 'calc(100% / 9)',
    height: 'calc(100% / 9)',
    margin: '0px',
    padding: '0px',
    textAlign: 'center',
    aspectRatio: '1 / 1',
    border: 'none',
  },
}));

export default CustomTable;
