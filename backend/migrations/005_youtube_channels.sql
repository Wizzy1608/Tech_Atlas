-- YouTube learning channels (official RSS feeds — no API key needed).
-- Verified 2026-10: each channel_id returns a working feed.
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, 'youtube', v.config::jsonb
FROM (VALUES
  ('YouTube — freeCodeCamp',          '{"channel_ids": ["UC8butISFwT-Wl7EV0hUK0BQ"]}'),
  ('YouTube — Fireship',              '{"channel_ids": ["UCsBjURrPoezykLs9EqgamOA"]}'),
  ('YouTube — NetworkChuck',          '{"channel_ids": ["UCOuGATIAbd2DvzJmUgXn2IQ"]}'),
  ('YouTube — David Bombal',          '{"channel_ids": ["UCZTIRrENWr_rjVoA7BcUE_A"]}'),
  ('YouTube — TechWorld with Nana',   '{"channel_ids": ["UCoQ8B21RIncI9NWLr2d2Y_w"]}'),
  ('YouTube — CoreyMS (sysadmin)',    '{"channel_ids": ["UCmY91yfYo5DPqVt4TGkRNJA"]}')
) AS v(name, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);
