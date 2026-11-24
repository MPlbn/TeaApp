export { };

declare global {
    interface Window {
        authStorage: {
            save: (uRefreshToken: string) => Promise<void>;
            get: () => Promise<string | null>;
            clear: () => Promise<void>;
        };
    }
}