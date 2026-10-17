# Teselas · MIPE

Una app pequeñita, hecha solo para Mirian, para ir creando rutinas desde lo más básico, a su ritmo.

Cada cosita que hace descubre una tesela de un cuadro de Klimt, empezando por *El beso*. Hay una ventanita sorpresa cada día (como un calendario de adviento), un refugio para los días de tormenta y una escalera de peldaños (Semilla → Brote → Flor → Jardín) que se sube cuando apetece.

## Principios

- **Nada que se rompa.** No hay rachas; los días sin hacer nada no se ven ni se cuentan. Las teselas nunca se pierden.
- **Pocas palabras.** Frases cortas, botones grandes, una cosa cada vez.
- **Ella decide.** Las sugerencias para subir de peldaño se pueden ignorar siempre; también se puede bajar.

## Dónde funciona

| | Cómo |
|---|---|
| Portátil (Windows 11) | App flotante con Tauri: sin bordes, siempre encima (opcional), se encoge a una píldora, vive en la bandeja junto al reloj y arranca con Windows. |
| Móvil (Android) | La misma web instalada como app (PWA): https://ray86-dev.github.io/teselas/ |

Portátil y móvil se sincronizan con Supabase (ver [`supabase/`](supabase/)). El móvil se une escaneando un QR desde Ajustes.

## Lo personal

Los nombres y la dedicatoria están en [`src/personal.ts`](src/personal.ts).

Las **notas** que le aparecen en las ventanitas se escriben en el buzón (enlace privado en Ajustes → Portátil y móvil), no en el código: este repositorio es público.

## Desarrollo

```bash
npm install
npm run dev          # web en http://localhost:5199
npm run app:dev      # app de escritorio en modo desarrollo
npm run app:build    # instalador de Windows en src-tauri/target/release/bundle/nsis/
```

Para compilar la app de escritorio hacen falta Rust y las Build Tools de Visual Studio **con el SDK de Windows**.

## Estructura

```
src/
  personal.ts        nombres, dedicatoria, notas
  data/              cositas (por peldaños), sorpresas, cuadros, frases
  store/             estado (registros sincronizables), derivados y acciones
  pantallas/         Hoy, Mi cuadro, Escalera, Ajustes, Bienvenida
  capas/             Refugio, Respirar, Temporizador, Ventanita, Ideas…
  components/        Mosaico, tarjetas, píldora de escritorio…
  lib/               fechas, azar con semilla, sonido, escritorio (Tauri), recordatorios
src-tauri/           ventana flotante, bandeja del sistema, arranque con Windows
public/cuadros/      cuadros de Klimt (dominio público, Wikimedia Commons)
```

El estado se guarda como un diccionario de registros con marca de tiempo (`h:2026-10-16:agua → true`), pensado para sincronizar portátil y móvil sin perder nada.
