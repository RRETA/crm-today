# Despliegue: Vercel (frontend) + Render (backend) + Supabase (base de datos)

Estos pasos son manuales porque requieren tus propias cuentas — no se pueden automatizar
desde aquí. El código ya está listo (Postgres, `render.yaml`, `frontend/vercel.json`).

## 1. Supabase (base de datos)

1. Crea una cuenta en [supabase.com](https://supabase.com) y un proyecto nuevo.
2. Ve a **Project Settings → Database → Connection string** y copia la cadena en modo
   **URI** (conexión directa, puerto 5432). Se ve así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
3. Reemplaza `[YOUR-PASSWORD]` por la contraseña que definiste al crear el proyecto.
   Guarda esta URL completa — es tu `DATABASE_URL`.

## 2. Render (backend Django)

1. Crea una cuenta en [render.com](https://render.com) y conecta tu GitHub, dando acceso
   al repo `RRETA/crm-today`.
2. **New +** → **Blueprint** → selecciona el repo. Render detecta `render.yaml`
   automáticamente y propone el servicio `crm-today-backend`.
3. Antes de confirmar el deploy, completa las variables marcadas como manuales:
   - `DATABASE_URL`: la connection string de Supabase del paso anterior.
   - `CORS_ALLOWED_ORIGINS`: déjala vacía por ahora, la completas en el paso 4.
   - `CSRF_TRUSTED_ORIGINS`: la URL que Render te va a asignar, ej.
     `https://crm-today-backend.onrender.com` (se ve en el dashboard antes de terminar).
4. Deploy. La primera vez corre `migrate` automáticamente (está en el `startCommand`).
5. Una vez arriba, abre la pestaña **Shell** del servicio en Render y crea un tenant y
   admin de prueba:
   ```
   python manage.py seed_demo
   ```
   (crea el tenant "Empresa Demo" con usuario `admin` / `admin12345` — cámbialo después).
6. Copia la URL pública del servicio (ej. `https://crm-today-backend.onrender.com`).

## 3. Vercel (frontend React)

1. Crea una cuenta en [vercel.com](https://vercel.com) e importa el repo
   `RRETA/crm-today` desde GitHub.
2. En la configuración del proyecto, **Root Directory** → selecciona `frontend`
   (el repo tiene backend y frontend juntos, Vercel solo debe construir la carpeta
   `frontend`). El framework (Vite) se detecta solo.
3. Agrega la variable de entorno:
   - `VITE_API_URL` = `https://crm-today-backend.onrender.com/api` (la URL de Render
     del paso anterior, con `/api` al final).
4. Deploy. Copia la URL que te da Vercel (ej. `https://crm-today.vercel.app`).

## 4. Cerrar el círculo: CORS

Vuelve a Render → tu servicio → **Environment** y actualiza:

- `CORS_ALLOWED_ORIGINS` = `https://crm-today.vercel.app` (la URL real de Vercel).

Guarda — Render vuelve a desplegar solo. Los preview deployments de Vercel
(`*.vercel.app` con sufijos aleatorios por rama/PR) ya están permitidos automáticamente
vía `CORS_ALLOWED_ORIGIN_REGEXES` en `settings.py`, no hace falta agregarlos a mano.

## Notas

- El plan gratuito de Render "duerme" el servicio tras ~15 min sin tráfico; el primer
  request después de eso tarda 30–50s en responder (cold start). Es normal.
- El proyecto free de Supabase se pausa tras 1 semana sin actividad — se reactiva solo
  con la primera conexión, pero puede tardar un poco.
- Cambia la contraseña del usuario `admin` (o el `DJANGO_SECRET_KEY`) antes de usar esto
  con datos reales — los valores del seed son solo para probar que todo quedó conectado.
