-- Quality over quantity: drop blog-aggregator posts, GitHub topic repos, channel video feeds,
-- and generic blog RSS. Keep curated flagship courses, CS50 playlists, textbooks, Microsoft Learn,
-- GitHub learning paths, freeCodeCamp News, and the seed resources.
DELETE FROM source_configs
WHERE source_type IN ('devto', 'github-topic', 'rss')
   OR (source_type = 'youtube' AND NOT (config ? 'channel_handles'));

DELETE FROM resources
WHERE source_name = 'Dev.to'
   OR category IN ('project', 'video')
   OR (source_type = 'tutorial' AND source_name IN ('CSS-Tricks', 'Smashing Magazine', 'Real Python', 'Baeldung', 'DigitalOcean', 'MDN'));
