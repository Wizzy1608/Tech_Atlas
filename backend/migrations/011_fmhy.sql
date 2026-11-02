-- FMHY (fmhy.net) educational index: IT learning sections only, reachability-checked.
INSERT INTO source_configs (name, source_type, config)
SELECT 'FMHY - educational index', 'fmhy', '{"sections": ["Courses", "Developer Learning"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = 'FMHY - educational index');
