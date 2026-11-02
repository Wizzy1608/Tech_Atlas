-- Real learning sources: Dev.to topical feeds (no API key required)
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, 'devto', v.config::jsonb
FROM (VALUES
  ('Dev.to — DevOps',       '{"tag": "devops", "per_page": 15}'),
  ('Dev.to — Docker',       '{"tag": "docker", "per_page": 15}'),
  ('Dev.to — Linux',        '{"tag": "linux", "per_page": 15}'),
  ('Dev.to — Cybersecurity','{"tag": "cybersecurity", "per_page": 15}'),
  ('Dev.to — Networking',   '{"tag": "networking", "per_page": 15}'),
  ('Dev.to — AWS',          '{"tag": "aws", "per_page": 15}'),
  ('Dev.to — Kubernetes',   '{"tag": "kubernetes", "per_page": 15}'),
  ('Dev.to — Machine Learning', '{"tag": "machinelearning", "per_page": 15}')
) AS v(name, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);

-- Offer zone: real destination URLs (seed placeholders pointed at example.com)
UPDATE deals SET url = 'https://aws.amazon.com/certification/', provider = 'AWS'
WHERE title LIKE 'AWS Certified%';
UPDATE deals SET url = 'https://www.cloudskillsboost.google/', provider = 'Google Cloud'
WHERE title LIKE 'Google Cloud Skills Boost%';
