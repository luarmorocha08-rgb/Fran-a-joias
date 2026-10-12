-- Categorias iniciais (editáveis no painel /admin/categorias)
insert into public.categories (name, slug, description, sort_order) values
  ('Alianças de Moedas',    'aliancas-de-moedas',    'Nossa especialidade: alianças fabricadas a partir de moedas.', 1),
  ('Alianças de Ouro',      'aliancas-de-ouro',      'Alianças fabricadas em ouro.', 2),
  ('Alianças de Prata',     'aliancas-de-prata',     'Alianças fabricadas em prata.', 3),
  ('Alianças Tradicionais', 'aliancas-tradicionais', 'Modelos clássicos e atemporais.', 4),
  ('Modelos Especiais',     'modelos-especiais',     'Criações diferenciadas e personalizadas.', 5)
on conflict (slug) do nothing;

-- Coleções iniciais, sem fotografia (adicione as fotos reais pelo painel)
insert into public.collections (title, slug, tagline, category_id, theme, sort_order)
select v.title, v.slug, v.tagline, c.id, v.theme, v.sort_order
from (values
  ('Alianças de Moedas', 'aliancas-de-moedas', 'A especialidade que só Marília tem.', 'aliancas-de-moedas', 'dark', 1),
  ('Alianças de Ouro',   'aliancas-de-ouro',   'Um símbolo eterno para um amor único.', 'aliancas-de-ouro', 'light', 2),
  ('Alianças de Prata',  'aliancas-de-prata',  'A delicadeza que acompanha cada promessa.', 'aliancas-de-prata', 'dark', 3)
) as v(title, slug, tagline, category_slug, theme, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
