create extension if not exists pgcrypto;

create table if not exists public.locais (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  equipamento text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tipos_registro (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  re text not null unique,
  nome text not null,
  created_at timestamptz not null default now()
);

create sequence if not exists public.numero_etiqueta_seq start 1001;

create table if not exists public.etiquetas_azuis (
  id uuid primary key default gen_random_uuid(),
  numero_etiqueta integer not null unique default nextval('public.numero_etiqueta_seq'),
  data_criacao timestamptz not null default now(),
  local_id uuid not null references public.locais(id),
  tipo_registro_id uuid not null references public.tipos_registro(id),
  maquina_parada boolean not null default false,
  prioridade text not null check (prioridade in ('A', 'B')),
  encontrada_por_id uuid not null references public.funcionarios(id),
  descricao_anomalia text not null,
  fotos_url text[] not null default '{}',
  executado_por_id uuid references public.funcionarios(id),
  descricao_acao text,
  tempo_execucao_minutos integer check (tempo_execucao_minutos is null or tempo_execucao_minutos >= 0),
  status text not null default 'Concluído' check (status = 'Concluído')
);

alter table public.locais enable row level security;
alter table public.tipos_registro enable row level security;
alter table public.funcionarios enable row level security;
alter table public.etiquetas_azuis enable row level security;

create policy "leitura publica de locais" on public.locais for select using (true);
create policy "leitura publica de tipos" on public.tipos_registro for select using (true);
create policy "leitura publica de funcionarios" on public.funcionarios for select using (true);
create policy "leitura publica de etiquetas" on public.etiquetas_azuis for select using (true);
create policy "insercao publica de etiquetas" on public.etiquetas_azuis for insert with check (true);

-- O CRUD administrativo deve ser protegido por autenticação real em produção.
-- A política abaixo libera escrita apenas para usuários autenticados.
create policy "admin autenticado gerencia locais" on public.locais for all to authenticated using (true) with check (true);
create policy "admin autenticado gerencia tipos" on public.tipos_registro for all to authenticated using (true) with check (true);
create policy "admin autenticado gerencia funcionarios" on public.funcionarios for all to authenticated using (true) with check (true);

insert into public.tipos_registro (nome) values ('Anomalia'), ('Limpeza'), ('Segurança') on conflict (nome) do nothing;
insert into public.locais (tag, equipamento) values ('EXT-01', 'Extrusora 01'), ('COR-02', 'Cortadeira 02'), ('EMB-01', 'Embaladora 01') on conflict (tag) do nothing;
