export type Domain =
  | 'ethical-hacking'
  | 'linux-unix'
  | 'troubleshooting-it'
  | 'network-engineering'
  | 'devtools'
  | 'sysadmin'
  | 'cybersecurity'
  | 'cloud'
  | 'ai-ml';

export const DOMAIN_ICONS: Record<Domain, string> = {
  'ethical-hacking': '🎯',
  'linux-unix': '🐧',
  'troubleshooting-it': '🔧',
  'network-engineering': '🌐',
  devtools: '🛠️',
  sysadmin: '🖥️',
  cybersecurity: '🛡️',
  cloud: '☁️',
  'ai-ml': '🤖',
};

type Dict = { positive: string[]; negative: string[] };

const DICTS: Record<Domain, Dict> = {
  'ethical-hacking': {
    positive: ['pentest', 'penetration', 'hacking', 'exploit', 'payload', 'bug bounty', 'ctf', 'malware', 'reverse engineering', 'osint', 'vulnerability', 'nmap', 'burp'],
    negative: ['defender', 'blue team'],
  },
  'linux-unix': {
    positive: ['linux', 'bash', 'shell', 'systemd', 'ubuntu', 'debian', 'kernel', 'unix', 'grep', 'sed', 'awk'],
    negative: ['windows'],
  },
  'troubleshooting-it': {
    positive: ['troubleshoot', 'recovery', 'diagnostic', 'repair', 'boot', 'blue screen', 'data recovery', 'performance tuning'],
    negative: [],
  },
  'network-engineering': {
    positive: ['network', 'routing', 'router', 'switching', 'bgp', 'vlan', 'wireshark', 'firewall', 'dns', 'dhcp', 'tcp', 'subnet'],
    negative: ['neural network', 'networking events'],
  },
  devtools: {
    positive: ['git', 'docker', 'kubernetes', 'ci/cd', 'pipeline', 'devops', 'vim', 'neovim', 'makefile', 'terraform', 'editor'],
    negative: [],
  },
  sysadmin: {
    positive: ['sysadmin', 'server', 'active directory', 'powershell', 'proxmox', 'virtualization', 'vmware', 'monitoring', 'backup'],
    negative: ['web server framework'],
  },
  cybersecurity: {
    positive: ['security', 'siem', 'soc', 'threat', 'malware analysis', 'incident response', 'grc', 'compliance', 'zero-day', 'cve'],
    negative: ['security training course for beginners'],
  },
  cloud: {
    positive: ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'lambda', 'cloudformation', 'multi-cloud', 'saas'],
    negative: ['on-premise only'],
  },
  'ai-ml': {
    positive: ['machine learning', 'deep learning', 'llm', 'rag', 'embedding', 'neural', 'transformer', 'prompt', 'fine-tuning', 'pytorch', 'tensorflow'],
    negative: [],
  },
};

export type Classifiable = { title: string; description: string | null; tags: string[] };

export function classify(r: Classifiable): { domain: Domain | null; method: 'keyword'; score: number } {
  const title = r.title.toLowerCase();
  const desc = (r.description ?? '').toLowerCase();
  const tags = r.tags.map((t) => t.toLowerCase()).join(' ');

  let best: Domain | null = null;
  let bestScore = 0;
  for (const [domain, dict] of Object.entries(DICTS) as [Domain, Dict][]) {
    const count = (hay: string, words: string[]) => words.filter((w) => hay.includes(w)).length;
    const score =
      count(title, dict.positive) * 5 +
      count(tags, dict.positive) * 4 +
      count(desc, dict.positive) * 2 -
      count(title + tags + desc, dict.negative) * 10;
    if (score > bestScore) {
      bestScore = score;
      best = domain;
    }
  }
  return { domain: best, method: 'keyword', score: best ? Math.min(1, bestScore / 10) : 0 };
}
