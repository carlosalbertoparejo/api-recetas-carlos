INSERT INTO public.recipes (nombre, descripcion, ingredientes, tiempo_min, dificultad)
VALUES ('Wrap veggie', 'Wrap con vegetales salteados', 'tortilla,pimiento,cebolla,zucchini', 18, 'facil');

SELECT * FROM public.recipes ORDER BY id DESC;
SELECT * FROM public.recipes WHERE id = 1;

UPDATE public.recipes
SET nombre = 'Wrap veggie deluxe', updated_at = NOW()
WHERE id = 1;

DELETE FROM public.recipes WHERE id = 1;
