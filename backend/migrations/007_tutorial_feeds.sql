-- Tutorial feeds (all RSS/Atom endpoints verified reachable, one generic `rss` fetcher).
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, 'rss', v.config::jsonb
FROM (VALUES
  ('CSS-Tricks',      '{"url": "https://css-tricks.com/feed/", "source_name": "CSS-Tricks", "tags": ["css", "frontend"]}'),
  ('Smashing Magazine','{"url": "https://www.smashingmagazine.com/feed/", "source_name": "Smashing Magazine", "tags": ["frontend", "design"]}'),
  ('Real Python',     '{"url": "https://realpython.com/atom.xml", "source_name": "Real Python", "tags": ["python"]}'),
  ('Baeldung',        '{"url": "https://www.baeldung.com/feed", "source_name": "Baeldung", "tags": ["java", "spring"]}'),
  ('DigitalOcean Tutorials', '{"url": "https://www.digitalocean.com/rss/community/tutorials.atom", "source_name": "DigitalOcean", "tags": ["devops", "linux"]}'),
  ('MDN Blog',        '{"url": "https://developer.mozilla.org/en-US/blog/rss.xml", "source_name": "MDN", "tags": ["web", "javascript"]}')
) AS v(name, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);
