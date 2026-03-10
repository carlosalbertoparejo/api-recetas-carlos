CREATE TABLE IF NOT EXISTS public.recipes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  ingredientes TEXT NOT NULL,
  tiempo_min INT NOT NULL CHECK (tiempo_min > 0),
  dificultad VARCHAR(20) NOT NULL CHECK (dificultad IN ('facil', 'media', 'dificil')),
  image_url VARCHAR(300),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_nombre ON public.recipes(nombre);
