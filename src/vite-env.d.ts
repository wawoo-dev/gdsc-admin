/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_EVENT_URL: string;
}
