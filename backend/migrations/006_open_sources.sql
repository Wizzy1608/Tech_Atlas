-- Free/open learning sources verified accessible (2026-10):
--   OpenStax (books.Book CMS API), Open Textbook Library (textbooks.json), freeCodeCamp News RSS.
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, v.stype, v.config::jsonb
FROM (VALUES
  ('OpenStax — open textbooks',     'openstax',              '{"limit": 150}'),
  ('Open Textbook Library',         'open-textbook-library', '{"pages": 12}'),
  ('freeCodeCamp — news/tutorials', 'freecodecamp-rss',      '{"limit": 40}')
) AS v(name, stype, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);
