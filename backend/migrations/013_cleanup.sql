-- Remove seeded placeholders + fake deals, and drop structures no code uses.
DELETE FROM resources WHERE url LIKE '%example.com%';
DELETE FROM deals WHERE url IN (
  'https://aws.amazon.com/certification/',
  'https://www.cloudskillsboost.google/',
  'https://example.com/cisco-expired'
);
DROP TABLE IF EXISTS source_topics;
DROP TABLE IF EXISTS topics;
ALTER TABLE resources DROP COLUMN IF EXISTS image_url;
