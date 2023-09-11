import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

window.electron.ipcRenderer.on('save-file', (event) => {
  console.log('save-file ', event);
  document.getElementById('save')?.click();
  // Xử lý gửi một yêu cầu đến App kêu đưa 'blob', sau đó đợi phản hồi
  // và truyền vào hàm blob
  // saveFile(blob);
});

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log('renderer: ', arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
