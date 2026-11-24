const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('authStorage', {
    save: (refreshToken: string): Promise<void> =>
        ipcRenderer.invoke('auth-storage:save', refreshToken),

    get: (): Promise<string | null> =>
        ipcRenderer.invoke('auth-storage:get'),

    clear: (): Promise<void> =>
        ipcRenderer.invoke('auth-storage:clear')
});
