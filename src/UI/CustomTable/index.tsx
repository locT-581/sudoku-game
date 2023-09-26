import styled from '@emotion/styled';
import { TableContainer } from '@mui/material';

const CustomTable = styled(TableContainer)(() => ({
  width: '80vh',
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
    border: '2px solid #fff',
  },
  '& .MuiTableCell-root': {
    width: 'calc(100% / 9)',
    margin: '0px',
    padding: '0px',
    border: '1px solid #fff',
    textAlign: 'center',
    aspectRatio: '1 / 1',
  },
}));

export default CustomTable;
