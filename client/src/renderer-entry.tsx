import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import { theme } from './Styles/theme';
import "./index.css"
import "@mantine/notifications/styles.css";
import { Notifications } from '@mantine/notifications';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Nie znaleziono elementu #root w index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications
        position='bottom-right'
        autoClose={2000}
        limit={3}
        zIndex={1000}
      />
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);