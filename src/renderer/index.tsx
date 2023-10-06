import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { encrypt, saveFile } from 'utils/saveFile';

import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

window.electron.ipcRenderer.on('save-file', () => {
  // get data from local storage
  const data = localStorage.getItem('data');
  const localData = data ? JSON.parse(data) : { matrix: [], timer: 0 };
  if (localData.matrix.length === 0) {
    console.log('No data to save');
    return;
  }
  const blob = new Blob([encrypt(JSON.stringify(localData, null))], {
    type: 'text/plain',
  });
  saveFile(blob);
});

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log('renderer: ', arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
