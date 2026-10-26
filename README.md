# Gabriel Colis · Portfolio

Personal portfolio of **Gabriel Henrique Colis**, full stack software engineer in Curitiba, Brazil.

Live: https://gabriel-colis-portfolio.vercel.app

## What's inside

- **Immersive 3D scene** in Three.js: a field of glowing particle hills, light ribbons and an orbiting `{ }` cube. The camera flies over the scene as you scroll and follows the mouse, with a bloom pass for the glow.
- **Career content first**: experience, what I bring, selected projects (Programa Salão / Up Agenda) and contact, readable even before the 3D loads.
- **Easter egg**: type `xianxia` anywhere, or click the golden 天 seal in the footer 7 times.
- Respects `prefers-reduced-motion`, works at phone width, no horizontal scroll.

## Stack

Vite · TypeScript · Three.js (EffectComposer + UnrealBloomPass) · plain HTML and CSS

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build in dist/
```

## Structure

```
index.html        page markup and meta tags
src/main.ts       3D scene, scroll camera, marquee, reveal and easter egg
src/style.css     design tokens and layout
public/img/       portrait, project screenshots and game art (WebP)
public/           favicon set and social share image
```
