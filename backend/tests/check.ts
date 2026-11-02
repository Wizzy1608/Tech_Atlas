import assert from 'node:assert/strict';
import { classify } from '../src/classifier.js';
import { decodeEntities, stripTags } from '../src/collectors/utils/text.js';

const domain = (title: string) => classify({ title, description: null, tags: [] }).domain;

assert.equal(domain('Bash scripting for Linux administrators'), 'linux-unix');
assert.equal(domain('Kubernetes and Docker for DevOps'), 'devtools');
assert.equal(domain('Penetration testing with Burp Suite'), 'ethical-hacking');
assert.equal(domain('An unrelated title'), null);

assert.equal(decodeEntities('R&amp;D &lt;go&gt;'), 'R&D <go>');
assert.equal(stripTags('<p>Hello <b>world</b></p>'), 'Hello world');

console.log('checks passed');
