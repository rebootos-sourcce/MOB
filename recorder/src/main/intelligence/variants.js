'use strict';
// Platform-specific content variants for YouTube, TikTok, and LinkedIn.
// Takes the base AI-generated package data and reformats for each platform's
// character limits, tone, and best practices.

/**
 * Generate platform-specific variants from a production package.
 * @param {object} pkg
 * @returns {{ youtube: object, tiktok: object, linkedin: object }}
 */
function generateVariants(pkg) {
  const title = pkg.edited_title || pkg.titleVariants?.[0] || pkg.title || 'Recording';
  const description = pkg.edited_description || pkg.description || '';
  const rawHashtags = pkg.edited_hashtags_json
    ? JSON.parse(pkg.edited_hashtags_json)
    : (pkg.hashtags_json ? JSON.parse(pkg.hashtags_json) : []);
  const tags = Array.isArray(rawHashtags)
    ? rawHashtags.map(h => (typeof h === 'string' ? h : h.tag)).filter(Boolean)
    : [];
  const chapters = pkg.chapters_json ? JSON.parse(pkg.chapters_json) : [];

  return {
    youtube:  buildYoutube(title, description, tags, chapters),
    tiktok:   buildTikTok(title, description, tags),
    linkedin: buildLinkedIn(title, description, tags, chapters),
  };
}

// ── YouTube ───────────────────────────────────────────────────────────────────
// Title: ≤100 chars. Description: ≤5000 chars with timestamps + hashtags.
function buildYoutube(title, description, tags, chapters) {
  const ytTitle = title.slice(0, 100);

  let chapterBlock = '';
  if (chapters.length >= 3) {
    chapterBlock = '\n\nChapters:\n' + chapters.map(c => {
      const mins = Math.floor(c.start_ms / 60000);
      const secs = Math.floor((c.start_ms % 60000) / 1000);
      const ts = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      return `${ts} ${c.label || 'Chapter'}`;
    }).join('\n');
  }

  const hashtagLine = tags.slice(0, 15).map(t => '#' + t.replace(/^#/, '')).join(' ');
  const ytDesc = (description + chapterBlock + '\n\n' + hashtagLine).slice(0, 5000).trim();

  return { title: ytTitle, description: ytDesc, tags: tags.slice(0, 500) };
}

// ── TikTok ────────────────────────────────────────────────────────────────────
// Caption: ≤2200 chars. 3–5 hashtags is optimal. Hook-first title.
function buildTikTok(title, description, tags) {
  const firstLine = description.split(/[.\n]/)[0]?.trim() || title;
  const hook = firstLine.slice(0, 150);
  const hashtagLine = tags.slice(0, 5).map(t => '#' + t.replace(/^#/, '')).join(' ');
  const caption = (hook + '\n\n' + hashtagLine).slice(0, 2200).trim();

  return { caption, hashtags: tags.slice(0, 5) };
}

// ── LinkedIn ──────────────────────────────────────────────────────────────────
// Professional tone. ≤3000 chars (shows ~200 before "see more"). No spam hashtags.
function buildLinkedIn(title, description, tags, chapters) {
  const cleanTitle = title.replace(/^(so|well|okay|um|uh|hey),?\s*/i, '').trim();
  const headline = (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)).slice(0, 200);

  let keyPoints = '';
  if (chapters.length >= 2) {
    keyPoints = '\n\nKey topics:\n' + chapters.slice(0, 5).map(c => `• ${c.label || 'Topic'}`).join('\n');
  }

  const liTags = tags.filter(t => t.length > 3).slice(0, 5).map(t => '#' + t.replace(/^#/, '')).join(' ');
  const liBody = (description + keyPoints + '\n\n' + liTags).slice(0, 2800).trim();

  return { headline, body: headline + '\n\n' + liBody, hashtags: tags.slice(0, 5) };
}

module.exports = { generateVariants };
