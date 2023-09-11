import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import compress from "@otterlord/astro-compress";
import vercel from '@astrojs/vercel/serverless';
import image from "@astrojs/image";


// https://astro.build/config
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [critters(), image(), tailwind(), react(), compress()]
});