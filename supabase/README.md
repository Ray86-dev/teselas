# Base de datos (Supabase)

Proyecto `teselas` (región eu-west-1, Irlanda). La migración de `migrations/` ya está aplicada.

Sin cuentas ni contraseñas: cada «hogar» tiene dos claves largas y aleatorias que solo se guardan
como huella (sha-256). Las tablas están cerradas; solo se accede por funciones que piden la clave:

- `crear_hogar(clave, buzon)`
- `sincronizar(clave, cambios, desde)`: sube y baja registros (gana el más reciente)
- `leer_notas(clave)`
- `dejar_nota(buzon, texto)`, `notas_del_buzon(buzon)`, `borrar_nota(buzon, id)`

La clave de ella da acceso a sus datos; la del buzón solo permite dejar notas.

> Ojo: en el plan gratuito, Supabase pausa un proyecto tras una semana sin uso. Si pasa, la app sigue
> funcionando sin conexión y basta con reactivarlo desde el panel.
