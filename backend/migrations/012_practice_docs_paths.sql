-- Hands-on practice, official documentation, career paths, and Professor Messer (site + playlists).
INSERT INTO source_configs (name, source_type, config)
SELECT v.name, 'curated', v.config::jsonb
FROM (VALUES
  ('Curated - practice labs', $json$
  {"items": [
    {"title": "Exercism", "url": "https://exercism.org/", "source_name": "Exercism", "category": "practice", "difficulty": "beginner", "tags": ["practice", "python", "javascript", "ruby", "rust"], "description": "Free coding exercises with human mentoring across 70+ languages."},
    {"title": "NeetCode", "url": "https://neetcode.io/", "source_name": "NeetCode", "category": "practice", "difficulty": "intermediate", "tags": ["practice", "algorithms", "data structures", "interview"], "description": "Guided algorithm and data structure practice with video solutions for coding interviews."},
    {"title": "Codewars", "url": "https://www.codewars.com/", "source_name": "Codewars", "category": "practice", "difficulty": "beginner", "tags": ["practice", "challenges", "algorithms"], "description": "Community coding challenges (katas) in many languages, ranked by difficulty."},
    {"title": "HackerRank", "url": "https://www.hackerrank.com/", "source_name": "HackerRank", "category": "practice", "difficulty": "beginner", "tags": ["practice", "challenges", "sql", "python"], "description": "Coding challenges and skill tracks in algorithms, SQL, Python, and more."},
    {"title": "Kattis", "url": "https://open.kattis.com/", "source_name": "Kattis", "category": "practice", "difficulty": "intermediate", "tags": ["practice", "algorithms", "competitive programming"], "description": "Large problem archive with automatic judging, used in competitive programming courses."},
    {"title": "Frontend Mentor", "url": "https://www.frontendmentor.io/", "source_name": "Frontend Mentor", "category": "practice", "difficulty": "intermediate", "tags": ["practice", "web", "html", "css", "javascript"], "description": "Real-world front-end projects with designs and community feedback."},
    {"title": "OWASP Juice Shop", "url": "https://owasp.org/www-project-juice-shop/", "source_name": "OWASP", "category": "practice", "difficulty": "beginner", "tags": ["practice", "security", "owasp", "web"], "description": "Deliberately insecure web app for practicing OWASP Top 10 vulnerabilities."},
    {"title": "pwn.college", "url": "https://pwn.college/", "source_name": "pwn.college", "category": "practice", "difficulty": "advanced", "tags": ["practice", "security", "binary exploitation", "linux"], "description": "University-grade hands-on security dojo: binary exploitation, memory safety, and systems."},
    {"title": "Root-Me", "url": "https://www.root-me.org/?lang=en", "source_name": "Root-Me", "category": "practice", "difficulty": "beginner", "tags": ["practice", "security", "pentest", "ctf"], "description": "Hundreds of hands-on security challenges across web, network, crypto, and system."},
    {"title": "CTFlearn", "url": "https://ctflearn.com/", "source_name": "CTFlearn", "category": "practice", "difficulty": "beginner", "tags": ["practice", "security", "ctf"], "description": "Beginner-friendly capture-the-flag platform with progressive challenges."}
  ]}
  $json$),
  ('Curated - official docs', $json$
  {"items": [
    {"title": "Python Documentation", "url": "https://docs.python.org/3/", "source_name": "Python", "category": "docs", "tags": ["python", "docs", "language reference"], "description": "Official Python 3 language reference, standard library documentation, and tutorials."},
    {"title": "Kubernetes Documentation", "url": "https://kubernetes.io/docs/home/", "source_name": "Kubernetes", "category": "docs", "tags": ["kubernetes", "devops", "containers", "docs"], "description": "Official Kubernetes concepts, tasks, tutorials, and API reference."},
    {"title": "Docker Documentation", "url": "https://docs.docker.com/", "source_name": "Docker", "category": "docs", "tags": ["docker", "containers", "devops", "docs"], "description": "Official Docker guides: images, containers, Compose, networking, and registries."},
    {"title": "Wireshark Documentation", "url": "https://www.wireshark.org/docs/", "source_name": "Wireshark", "category": "docs", "tags": ["wireshark", "network", "packet analysis", "docs"], "description": "Official Wireshark user guide, capture filters, and protocol analysis reference."},
    {"title": "PostgreSQL Documentation", "url": "https://www.postgresql.org/docs/", "source_name": "PostgreSQL", "category": "docs", "tags": ["sql", "postgresql", "database", "docs"], "description": "Official PostgreSQL manual: SQL reference, administration, replication, and tuning."},
    {"title": "Linux man-pages", "url": "https://man7.org/linux/man-pages/", "source_name": "man7.org", "category": "docs", "tags": ["linux", "manual pages", "sysadmin", "docs"], "description": "Reference collection of Linux manual pages for commands, syscalls, and configuration."},
    {"title": "Git Documentation", "url": "https://git-scm.com/doc", "source_name": "Git", "category": "docs", "tags": ["git", "version control", "devtools", "docs"], "description": "Official Git reference, Pro Git book, and command documentation."},
    {"title": "GNU Bash Manual", "url": "https://www.gnu.org/software/bash/manual/", "source_name": "GNU", "category": "docs", "tags": ["bash", "shell", "linux", "docs"], "description": "Official Bash reference manual: syntax, builtins, expansions, and job control."},
    {"title": "Nginx Documentation", "url": "https://nginx.org/en/docs/", "source_name": "Nginx", "category": "docs", "tags": ["nginx", "web server", "sysadmin", "docs"], "description": "Official Nginx documentation: configuration directives, modules, and deployment."},
    {"title": "Terraform Documentation", "url": "https://developer.hashicorp.com/terraform/docs", "source_name": "HashiCorp", "category": "docs", "tags": ["terraform", "infrastructure as code", "devops", "cloud", "docs"], "description": "Official Terraform docs: HCL language, providers, state, and cloud provisioning."},
    {"title": "AWS Documentation", "url": "https://docs.aws.amazon.com/", "source_name": "AWS", "category": "docs", "tags": ["aws", "cloud", "docs"], "description": "Official AWS service documentation, API references, and guides."}
  ]}
  $json$),
  ('Curated - career paths', $json$
  {"items": [
    {"title": "Cybersecurity Career Path", "url": "https://roadmap.sh/cyber-security", "source_name": "roadmap.sh", "category": "path", "difficulty": "beginner", "tags": ["career", "roadmap", "cybersecurity", "security"], "description": "Step-by-step roadmap of skills and tools to become a cybersecurity professional."},
    {"title": "DevOps Career Path", "url": "https://roadmap.sh/devops", "source_name": "roadmap.sh", "category": "path", "difficulty": "intermediate", "tags": ["career", "roadmap", "devops", "cloud"], "description": "Roadmap of Linux, CI/CD, containers, cloud, and observability skills for DevOps."},
    {"title": "Backend Career Path", "url": "https://roadmap.sh/backend", "source_name": "roadmap.sh", "category": "path", "difficulty": "beginner", "tags": ["career", "roadmap", "backend", "web"], "description": "Backend developer roadmap: languages, databases, APIs, caching, and system design."},
    {"title": "Frontend Career Path", "url": "https://roadmap.sh/frontend", "source_name": "roadmap.sh", "category": "path", "difficulty": "beginner", "tags": ["career", "roadmap", "frontend", "web"], "description": "Frontend developer roadmap: HTML, CSS, JavaScript, frameworks, and tooling."},
    {"title": "Linux Career Path", "url": "https://roadmap.sh/linux", "source_name": "roadmap.sh", "category": "path", "difficulty": "beginner", "tags": ["career", "roadmap", "linux", "sysadmin"], "description": "Linux skills roadmap from the command line to system administration and hardening."},
    {"title": "AWS Career Path", "url": "https://roadmap.sh/aws", "source_name": "roadmap.sh", "category": "path", "difficulty": "intermediate", "tags": ["career", "roadmap", "aws", "cloud"], "description": "AWS cloud engineer roadmap: core services, networking, security, and architecture."}
  ]}
  $json$),
  ('Curated - Professor Messer', $json$
  {"items": [
    {"title": "Professor Messer: Free CompTIA A+ Training", "url": "https://www.professormesser.com/free-a-plus-training/", "source_name": "Professor Messer", "category": "course", "difficulty": "beginner", "tags": ["comptia", "a+", "certification", "it support", "sysadmin"], "description": "Free video course covering the CompTIA A+ exam objectives: hardware, networking, security, and troubleshooting."},
    {"title": "Professor Messer: Network+ (N10-009) Course", "url": "https://www.professormesser.com/network-plus/n10-009/n10-009-training-course/", "source_name": "Professor Messer", "category": "course", "difficulty": "beginner", "tags": ["comptia", "network+", "certification", "network"], "description": "Free Network+ video course: OSI model, IP addressing, routing, switching, and network security."},
    {"title": "Professor Messer: Security+ (SY0-701) Course", "url": "https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/", "source_name": "Professor Messer", "category": "course", "difficulty": "beginner", "tags": ["comptia", "security+", "certification", "cybersecurity"], "description": "Free Security+ video course: threats, cryptography, identity, and risk management."}
  ]}
  $json$)
) AS v(name, config)
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = v.name);

INSERT INTO source_configs (name, source_type, config)
SELECT 'YouTube - Professor Messer', 'youtube',
       '{"channel_handles": ["professormesser"], "max_playlists_per_channel": 8}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM source_configs s WHERE s.name = 'YouTube - Professor Messer');
