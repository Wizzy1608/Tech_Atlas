-- Structured learning paths: curated roadmaps/curricula repos (basic → advanced)
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, 'github-repos', v.config::jsonb
FROM (VALUES
  ('Paths — developer roadmap',  '{"repos": ["kamranahmedse/developer-roadmap"]}'),
  ('Paths — coding interview university', '{"repos": ["jwasham/coding-interview-university"]}'),
  ('Paths — OSSU computer science', '{"repos": ["ossu/computer-science"]}'),
  ('Paths — Odin Project curriculum', '{"repos": ["TheOdinProject/curriculum"]}'),
  ('Paths — system design primer', '{"repos": ["donnemartin/system-design-primer"]}'),
  ('Paths — free programming books', '{"repos": ["EbookFoundation/free-programming-books"]}'),
  ('Paths — build your own X', '{"repos": ["codecrafters-io/build-your-own-x"]}'),
  ('Paths — awesome index', '{"repos": ["sindresorhus/awesome"]}')
) AS v(name, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);

-- YouTube: enable by adding YOUTUBE_API_KEY to backend/.env, then e.g.
-- INSERT INTO source_configs (name, source_type, config) VALUES
--   ('YouTube — freeCodeCamp courses', 'youtube', '{"playlist_ids": ["<playlist-id>"]}');
