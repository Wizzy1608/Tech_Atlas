-- Course-like sources: 8 more YouTube channels, keyless playlist feeds, Microsoft Learn catalog.
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, v.stype, v.config::jsonb
FROM (VALUES
  ('YouTube - Traversy Media',       'youtube', '{"channel_ids": ["UC29ju8bIPH5as8OGnQzwJyA"]}'),
  ('YouTube - Programming with Mosh','youtube', '{"channel_ids": ["UCWv7vMbMWH4-V0ZXdmDpPBA"]}'),
  ('YouTube - Web Dev Simplified',   'youtube', '{"channel_ids": ["UCFbNIlppjAuEX4znoulh0Cw"]}'),
  ('YouTube - Kevin Powell',         'youtube', '{"channel_ids": ["UCJZv4d5rbIKd4QHMPkcABCw"]}'),
  ('YouTube - Academind',            'youtube', '{"channel_ids": ["UCSJbGtTlrDami-tDGPUV9-w"]}'),
  ('YouTube - Net Ninja',            'youtube', '{"channel_ids": ["UCW5YeuERMmlnqo4oq8vwUpg"]}'),
  ('YouTube - John Hammond',         'youtube', '{"channel_ids": ["UCVeW9qkBjo3zosnqUbG7CFw"]}'),
  ('YouTube - The Cyber Mentors',    'youtube', '{"channel_ids": ["UC0ArlFuFYMpEewyRBzdLHiw"]}'),
  ('YouTube - playlists (courses)',  'youtube', '{"channel_handles": ["freecodecamp", "TraversyMedia", "programmingwithmosh", "WebDevSimplified", "KevinPowell", "Academind", "NetNinja"], "max_playlists_per_channel": 6}'),
  ('Microsoft Learn',                'mslearn', '{"types": ["learningPaths", "courses"]}')
) AS v(name, stype, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);
