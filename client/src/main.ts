import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { ipcMain, safeStorage } from 'electron';
import { readFile, writeFile, unlink } from 'node:fs/promises';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const getRefreshTokenPath = () =>
  path.join(app.getPath('userData'), 'refresh-token.enc');

const registerAuthHandlers = () => {
  ipcMain.handle('auth-storage:save', async (_event, uRefreshToken: string) => {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Secure storage is unavailable');
    }

    const encryptedToken = safeStorage.encryptString(uRefreshToken);

    await writeFile(
      getRefreshTokenPath(),
      encryptedToken.toString('base64'),
      { mode: 0o600 }
    );
  });

  ipcMain.handle('auth-storage:get', async () => {
    try {
      const encryptedToken = await readFile(
        getRefreshTokenPath(),
        'utf-8'
      );

      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Secure storage is unavailable');
      }

      return safeStorage.decryptString(
        Buffer.from(encryptedToken, 'base64')
      );
    }
    catch (uError) {
      if ((uError as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }

      throw uError;
    }
  });

  ipcMain.handle('auth-storage:clear', async () => {
    try {
      await unlink(getRefreshTokenPath());
    }
    catch (uError) {
      if ((uError as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw uError;
      }
    }
  });
};


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  registerAuthHandlers();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
