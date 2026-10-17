-- Teselas: los datos se protegen con claves secretas largas (sin cuentas ni contraseñas).
-- Nadie puede leer ni escribir las tablas directamente: solo a través de estas funciones,
-- y cada una exige la clave correspondiente.
--   · clave  → la de Mirian: lee y escribe sus registros y lee sus notas
--   · buzón  → la de Ray: solo deja (y borra) notas; no puede ver nada de ella

create table public.hogares (
  id uuid primary key default gen_random_uuid(),
  clave_hash text not null unique,
  buzon_hash text not null unique,
  creado timestamptz not null default now()
);

create sequence public.registros_seq;

create table public.registros (
  hogar uuid not null references public.hogares(id) on delete cascade,
  clave text not null,
  valor jsonb,
  t bigint not null,
  d text not null,
  seq bigint not null default nextval('public.registros_seq'),
  primary key (hogar, clave)
);
create index registros_hogar_seq on public.registros (hogar, seq);

create table public.notas (
  id uuid primary key default gen_random_uuid(),
  hogar uuid not null references public.hogares(id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 600),
  creada timestamptz not null default now()
);
create index notas_hogar on public.notas (hogar, creada);

alter table public.hogares enable row level security;
alter table public.registros enable row level security;
alter table public.notas enable row level security;
revoke all on public.hogares, public.registros, public.notas from anon, authenticated;
revoke all on sequence public.registros_seq from anon, authenticated;

create function public.hash_clave(p text) returns text
language sql immutable set search_path = ''
as $$ select encode(sha256(convert_to(p, 'UTF8')), 'hex') $$;

create function public.crear_hogar(p_clave text, p_buzon text) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if char_length(p_clave) < 20 or char_length(p_buzon) < 20 then
    raise exception 'clave demasiado corta';
  end if;
  insert into public.hogares (clave_hash, buzon_hash)
  values (public.hash_clave(p_clave), public.hash_clave(p_buzon));
end $$;

create function public.sincronizar(p_clave text, p_cambios jsonb, p_desde bigint)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  h uuid;
  c jsonb;
  filas jsonb;
  maximo bigint;
begin
  select id into h from public.hogares where clave_hash = public.hash_clave(p_clave);
  if h is null then
    raise exception 'hogar desconocido' using errcode = 'P0002';
  end if;
  if jsonb_typeof(p_cambios) = 'array' and jsonb_array_length(p_cambios) > 5000 then
    raise exception 'demasiados cambios de golpe';
  end if;

  for c in select value from jsonb_array_elements(coalesce(p_cambios, '[]'::jsonb)) loop
    insert into public.registros as r (hogar, clave, valor, t, d)
    values (h, c->>'k', c->'v', (c->>'t')::bigint, c->>'d')
    on conflict (hogar, clave) do update
      set valor = excluded.valor, t = excluded.t, d = excluded.d, seq = nextval('public.registros_seq')
      where (r.t, r.d) < (excluded.t, excluded.d);
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object('k', r.clave, 'v', r.valor, 't', r.t, 'd', r.d) order by r.seq), '[]'::jsonb),
         coalesce(max(r.seq), p_desde)
    into filas, maximo
    from public.registros r
   where r.hogar = h and r.seq > p_desde;

  return jsonb_build_object('regs', filas, 'seq', maximo);
end $$;

create function public.leer_notas(p_clave text)
returns table (id uuid, texto text, creada timestamptz)
language sql stable security definer set search_path = ''
as $$
  select n.id, n.texto, n.creada
    from public.notas n
    join public.hogares h on h.id = n.hogar
   where h.clave_hash = public.hash_clave(p_clave)
   order by n.creada
$$;

create function public.dejar_nota(p_buzon text, p_texto text) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  h uuid;
  nueva uuid;
begin
  select id into h from public.hogares where buzon_hash = public.hash_clave(p_buzon);
  if h is null then
    raise exception 'buzón desconocido' using errcode = 'P0002';
  end if;
  insert into public.notas (hogar, texto) values (h, btrim(p_texto)) returning id into nueva;
  return nueva;
end $$;

create function public.notas_del_buzon(p_buzon text)
returns table (id uuid, texto text, creada timestamptz)
language sql stable security definer set search_path = ''
as $$
  select n.id, n.texto, n.creada
    from public.notas n
    join public.hogares h on h.id = n.hogar
   where h.buzon_hash = public.hash_clave(p_buzon)
   order by n.creada desc
$$;

create function public.borrar_nota(p_buzon text, p_id uuid) returns void
language sql security definer set search_path = ''
as $$
  delete from public.notas n
   using public.hogares h
   where n.id = p_id and n.hogar = h.id and h.buzon_hash = public.hash_clave(p_buzon)
$$;

revoke execute on function public.hash_clave(text) from public, anon, authenticated;
revoke execute on function public.crear_hogar(text, text) from public;
revoke execute on function public.sincronizar(text, jsonb, bigint) from public;
revoke execute on function public.leer_notas(text) from public;
revoke execute on function public.dejar_nota(text, text) from public;
revoke execute on function public.notas_del_buzon(text) from public;
revoke execute on function public.borrar_nota(text, uuid) from public;

grant execute on function public.crear_hogar(text, text) to anon, authenticated;
grant execute on function public.sincronizar(text, jsonb, bigint) to anon, authenticated;
grant execute on function public.leer_notas(text) to anon, authenticated;
grant execute on function public.dejar_nota(text, text) to anon, authenticated;
grant execute on function public.notas_del_buzon(text) to anon, authenticated;
grant execute on function public.borrar_nota(text, uuid) to anon, authenticated;
