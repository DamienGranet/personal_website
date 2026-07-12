#!/usr/bin/env node
/**
 * Validates src/data/profile.json against the expected schema.
 * Runs automatically before every build (locally and in GitHub Actions),
 * so a malformed edit fails fast with a readable message instead of
 * publishing a broken site.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataPath = join(root, 'src', 'data', 'profile.json');

const errors = [];
const warnings = [];

let raw;
try {
  raw = readFileSync(dataPath, 'utf8');
} catch {
  console.error(`✗ Could not read ${dataPath}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('✗ src/data/profile.json is not valid JSON.');
  console.error(`  ${e.message}`);
  console.error('  Tip: a missing comma or an unclosed quote is the usual culprit.');
  process.exit(1);
}

// ---------------------------------------------------------------- helpers
const isStr = (v) => typeof v === 'string';
const isArr = Array.isArray;
const req = (cond, msg) => { if (!cond) errors.push(msg); };
const warn = (cond, msg) => { if (!cond) warnings.push(msg); };
const looksLikeUrl = (v) => /^(https?:\/\/|\/|mailto:)/.test(v);

// ------------------------------------------------------------- top level
for (const key of ['meta', 'person', 'sections', 'about', 'experience', 'education', 'skills', 'highlights', 'interests', 'contact', 'socialLinks', 'privacyNotice']) {
  req(key in data, `Missing top-level key: "${key}"`);
}
if (errors.length) finish();

// ------------------------------------------------------------------ meta
req(isStr(data.meta.siteUrl) && data.meta.siteUrl.startsWith('https://'), 'meta.siteUrl must be an https:// URL');
req(isStr(data.meta.seoTitle) && data.meta.seoTitle.trim().length > 0, 'meta.seoTitle is required');
req(isStr(data.meta.seoDescription) && data.meta.seoDescription.trim().length > 0, 'meta.seoDescription is required');
warn(data.meta.seoDescription.length <= 170, 'meta.seoDescription is longer than ~160 characters; search engines may truncate it');
warn(!String(data.meta.githubRepo).includes('REPLACE-ME'), 'meta.githubRepo still contains REPLACE-ME (the /edit/ GitHub button will not work until set)');

// ---------------------------------------------------------------- person
req(isStr(data.person.name) && data.person.name.trim(), 'person.name is required');
req(isStr(data.person.headline) && data.person.headline.trim(), 'person.headline is required');
req(isStr(data.person.shortIntro) && data.person.shortIntro.trim(), 'person.shortIntro is required');
req(data.person.profileImage && isStr(data.person.profileImage.src), 'person.profileImage.src is required');
req(data.person.profileImage && isStr(data.person.profileImage.alt) && data.person.profileImage.alt.trim(), 'person.profileImage.alt (image description) is required for accessibility');

// ------------------------------------------------------------ experience
req(isArr(data.experience), 'experience must be a list');
data.experience.forEach((job, i) => {
  const label = `experience[${i}]`;
  req(isStr(job.role) && job.role.trim(), `${label}: "role" is required`);
  req(isStr(job.organisation) && job.organisation.trim(), `${label}: "organisation" is required`);
  req(isStr(job.start) && job.start.trim(), `${label}: "start" is required`);
  req(isStr(job.end) && job.end.trim(), `${label}: "end" is required`);
  req(!('details' in job) || isArr(job.details), `${label}: "details" must be a list of strings`);
});

// ------------------------------------------------------------- education
req(isArr(data.education), 'education must be a list');
data.education.forEach((e, i) => {
  req(isStr(e.institution) && e.institution.trim(), `education[${i}]: "institution" is required`);
  req(isStr(e.qualification) && e.qualification.trim(), `education[${i}]: "qualification" is required`);
});

// ---------------------------------------------------------------- skills
req(isArr(data.skills), 'skills must be a list');
data.skills.forEach((g, i) => {
  req(isStr(g.category) && g.category.trim(), `skills[${i}]: "category" is required`);
  req(isArr(g.items) && g.items.every(isStr), `skills[${i}]: "items" must be a list of strings`);
});

// ------------------------------------------------------------ highlights
req(isArr(data.highlights), 'highlights must be a list');
data.highlights.forEach((h, i) => {
  req(isStr(h.title) && h.title.trim(), `highlights[${i}]: "title" is required`);
  if (h.image) req(isStr(h.imageAlt) && h.imageAlt.trim(), `highlights[${i}]: has an image but no "imageAlt" description`);
  if (h.link) req(looksLikeUrl(h.link), `highlights[${i}]: "link" doesn't look like a URL`);
});

// ------------------------------------------------------------- interests
req(isArr(data.interests), 'interests must be a list');
data.interests.forEach((it, i) => {
  req(isStr(it.label) && it.label.trim(), `interests[${i}]: "label" is required`);
  if (it.link) req(looksLikeUrl(it.link), `interests[${i}]: "link" doesn't look like a URL`);
});

// --------------------------------------------------------------- contact
if (data.contact.linkedin) req(looksLikeUrl(data.contact.linkedin), 'contact.linkedin should be a URL');
if (data.contact.formEndpoint) req(data.contact.formEndpoint.startsWith('https://'), 'contact.formEndpoint should be an https:// URL');
warn(!String(data.contact.linkedin).includes('REPLACE-ME'), 'contact.linkedin still contains REPLACE-ME — the LinkedIn button is hidden until it is set');

// ------------------------------------------------------------ social links
req(isArr(data.socialLinks), 'socialLinks must be a list');
data.socialLinks.forEach((l, i) => {
  req(isStr(l.label) && l.label.trim(), `socialLinks[${i}]: "label" is required`);
  req(isStr(l.url) && looksLikeUrl(l.url), `socialLinks[${i}]: "url" must be a URL`);
});

// -------------------------------------------- basic privacy sanity check
// Catch obviously private data before it is published.
const flat = JSON.stringify(data);
if (/\b\d{4}[ -]?\d{3}[ -]?\d{3}\b/.test(flat)) {
  warnings.push('Something in the data looks like a phone number. Personal phone numbers should not be published — double-check before deploying.');
}
if (/@(gmail|hotmail|outlook|yahoo|icloud|protonmail)\./i.test(flat)) {
  warnings.push('A personal email address (gmail/outlook/etc.) appears in the data. Prefer a dedicated alias like hello@damiengranet.com.');
}

finish();

function finish() {
  for (const w of warnings) console.warn(`⚠ ${w}`);
  if (errors.length) {
    console.error(`\n✗ profile.json has ${errors.length} problem(s):`);
    for (const e of errors) console.error(`  • ${e}`);
    console.error('\nFix the items above and run "npm run validate-content" again.');
    process.exit(1);
  }
  console.log('✓ profile.json is valid.');
  process.exit(0);
}
