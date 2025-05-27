import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  define: {
    'import.meta.env': process.env,
  },
});