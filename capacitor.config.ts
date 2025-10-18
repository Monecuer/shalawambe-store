import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.monecuer.shalawambe',
  appName: 'Shalawambe Catalogue',
  webDir: 'out', // ✅ Point to your exported Next.js folder
  server: {
    androidScheme: 'https' // ensures secure loading on Android
  }
};

export default config;
