INSERT INTO topics (name, display_name, domain, domain_icon) VALUES
  ('ethical-hacking', 'Ethical Hacking', 'ethical-hacking', '🎯'),
  ('bug-bounty', 'Bug Bounty', 'ethical-hacking', '🎯'),
  ('ctf', 'CTF', 'ethical-hacking', '🎯'),
  ('linux-administration', 'Linux Administration', 'linux-unix', '🐧'),
  ('bash-scripting', 'Bash Scripting', 'linux-unix', '🐧'),
  ('system-recovery', 'System Recovery', 'troubleshooting-it', '🔧'),
  ('hardware-diagnostics', 'Hardware Diagnostics', 'troubleshooting-it', '🔧'),
  ('routing-switching', 'Routing & Switching', 'network-engineering', '🌐'),
  ('network-automation', 'Network Automation', 'network-engineering', '🌐'),
  ('git', 'Git', 'devtools', '🛠️'),
  ('docker', 'Docker', 'devtools', '🛠️'),
  ('ci-cd', 'CI/CD', 'devtools', '🛠️'),
  ('windows-server', 'Windows Server', 'sysadmin', '🖥️'),
  ('virtualization', 'Virtualization', 'sysadmin', '🖥️'),
  ('siem', 'SIEM', 'cybersecurity', '🛡️'),
  ('threat-hunting', 'Threat Hunting', 'cybersecurity', '🛡️'),
  ('multi-cloud', 'Multi Cloud', 'cloud', '☁️'),
  ('serverless', 'Serverless', 'cloud', '☁️'),
  ('llm-ops', 'LLMOps', 'ai-ml', '🤖'),
  ('rag', 'RAG', 'ai-ml', '🤖')
ON CONFLICT (name) DO NOTHING;

INSERT INTO source_configs (name, source_type, config) VALUES
  ('GitHub — ethical-hacking topic', 'github-topic', '{"topic": "ethical-hacking", "per_page": 10}'),
  ('GitHub — docker topic', 'github-topic', '{"topic": "docker", "per_page": 10}');

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id
FROM source_configs s, topics t
WHERE s.name = 'GitHub — ethical-hacking topic' AND t.name IN ('ethical-hacking', 'bug-bounty', 'ctf');

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id
FROM source_configs s, topics t
WHERE s.name = 'GitHub — docker topic' AND t.name = 'docker';

INSERT INTO resources (title, description, url, source_type, source_name, tags, category, difficulty, domain, domain_icon, classification_method, classification_score, metadata) VALUES
  ('payloadallthethings', 'A list of tools and payloads for penetration testing', 'https://github.com/swisskyrepo/PayloadsAllTheThings', 'github_repo', 'GitHub', ARRAY['ethical-hacking','pentesting','payloads'], 'project', 'intermediate', 'ethical-hacking', '🎯', 'manual', 1.0, '{"stars": 75000}'),
  ('metasploit-framework', 'The world''s most used penetration testing framework', 'https://github.com/rapid7/metasploit-framework', 'github_repo', 'GitHub', ARRAY['ethical-hacking','pentesting','exploitation'], 'project', 'advanced', 'ethical-hacking', '🎯', 'manual', 1.0, '{"stars": 35000}'),
  ('linux-bash-scripting-for-beginners', 'Learn bash scripting from scratch with practical examples', 'https://example.com/bash-scripting-beginners', 'rss', 'Dev.to', ARRAY['bash-scripting','linux','automation'], 'education', 'beginner', 'linux-unix', '🐧', 'manual', 1.0, '{}'),
  ('linux-foundation-cheatsheet-collection', 'Command references for daily Linux administration', 'https://example.com/linux-cheatsheets', 'rss', 'Linux Journal', ARRAY['linux-administration','sysadmin','cheatsheet'], 'docs', 'beginner', 'linux-unix', '🐧', 'manual', 1.0, '{}'),
  ('wireshark-display-filter-reference', 'Complete Wireshark display filter reference guide', 'https://example.com/wireshark-filters', 'rss', 'Wireshark Docs', ARRAY['routing-switching','wireshark','networking'], 'docs', 'intermediate', 'network-engineering', '🌐', 'manual', 1.0, '{}'),
  ('netdevops-git-projects', 'Network automation projects using Git and CI', 'https://example.com/netdevops-git', 'rss', 'NetDevOps', ARRAY['network-automation','git','ci-cd'], 'news', 'advanced', 'network-engineering', '🌐', 'manual', 1.0, '{}'),
  ('git-essential-training', 'Master branches, rebases and collaboration workflows', 'https://example.com/git-training', 'rss', 'LinkedIn Learning', ARRAY['git','version-control','devtools'], 'education', 'beginner', 'devtools', '🛠️', 'manual', 1.0, '{}'),
  ('docker-get-started', 'Official Docker getting started tutorial', 'https://docs.docker.com/get-started/', 'rss', 'Docker Docs', ARRAY['docker','containers','devtools'], 'docs', 'beginner', 'devtools', '🛠️', 'manual', 1.0, '{}'),
  ('active-directory-lab-guide', 'Build a home lab for Windows Server and Active Directory', 'https://example.com/ad-lab-guide', 'rss', 'Technet', ARRAY['windows-server','active-directory','virtualization'], 'education', 'intermediate', 'sysadmin', '🖥️', 'manual', 1.0, '{}'),
  ('splunk-free-tier-guide', 'Getting started with Splunk SIEM on a home lab', 'https://example.com/splunk-guide', 'rss', 'Splunk Blog', ARRAY['siem','soc','threat-hunting'], 'education', 'beginner', 'cybersecurity', '🛡️', 'manual', 1.0, '{}'),
  ('aws-solutions-architect-free-tier', 'Free tier eligible AWS architecture learning path', 'https://example.com/aws-sa-path', 'rss', 'AWS Blog', ARRAY['multi-cloud','aws','architecture'], 'education', 'intermediate', 'cloud', '☁️', 'manual', 1.0, '{}'),
  ('rag-from-scratch', 'Build retrieval augmented generation systems from first principles', 'https://example.com/rag-from-scratch', 'rss', 'AI Engineer', ARRAY['rag','llm-ops','embeddings'], 'education', 'advanced', 'ai-ml', '🤖', 'manual', 1.0, '{}'),
  ('lets-encrypt-steps', 'Renew and troubleshoot TLS certificates', 'https://example.com/le-steps', 'rss', 'SSLMate', ARRAY['certificates','tls','linux-administration'], 'docs', 'beginner', NULL, NULL, 'keyword', 0.0, '{}')
ON CONFLICT (url) DO NOTHING;

UPDATE resources SET collected_at = now() - interval '2 days' WHERE title IN ('docker-get-started', 'rag-from-scratch', 'payloadallthethings');
UPDATE resources SET collected_at = now() - interval '12 days' WHERE title = ('lets-encrypt-steps');

INSERT INTO deals (title, description, url, provider, original_price, discounted_price, discount_percent, valid_until, is_active) VALUES
  ('AWS Certified Solutions Architect — 50% off', 'Half price exam voucher for the SAA-C03 certification', 'https://aws.amazon.com/certification/', 'AWS', 150, 75, 50, now() + interval '3 days', TRUE),
  ('Google Cloud Skills Boost — Free month', 'One month free access to all lab catalog', 'https://www.cloudskillsboost.google/', 'Google Cloud', 29, 0, 100, now() + interval '7 days', TRUE),
  ('Expired Cisco promo', 'This deal is no longer valid', 'https://example.com/cisco-expired', 'Cisco', 300, 150, 50, now() - interval '2 days', TRUE)
ON CONFLICT (url) DO NOTHING;
