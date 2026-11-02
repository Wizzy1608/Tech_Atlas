CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  source_name TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  domain TEXT,
  domain_icon TEXT,
  classification_method TEXT,
  classification_score REAL,
  image_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  search_vector tsvector,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_source_type ON resources (source_type);
CREATE INDEX idx_resources_tags ON resources USING GIN (tags);
CREATE INDEX idx_resources_category ON resources (category);
CREATE INDEX idx_resources_domain ON resources (domain);
CREATE INDEX idx_resources_difficulty ON resources (difficulty);
CREATE INDEX idx_resources_search ON resources USING GIN (search_vector);
CREATE INDEX idx_resources_title_trgm ON resources USING GIN (title gin_trgm_ops);

CREATE OR REPLACE FUNCTION resources_search_vector_update() RETURNS trigger AS $fn$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END
$fn$ LANGUAGE plpgsql;

CREATE TRIGGER resources_search_vector_trigger
  BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION resources_search_vector_update();

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  provider TEXT NOT NULL,
  original_price DECIMAL,
  discounted_price DECIMAL,
  discount_percent INT,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (url)
);

CREATE INDEX idx_deals_active ON deals (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_deals_valid_until ON deals (valid_until);

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  domain_icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE source_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  fetch_interval_minutes INT NOT NULL DEFAULT 360,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ
);

CREATE TABLE source_topics (
  source_id UUID NOT NULL REFERENCES source_configs(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (source_id, topic_id)
);
