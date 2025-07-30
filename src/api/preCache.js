import {
  getStyle,
  inlineSingleBackgroundEntry,
  fetchImage,
  splitBackgroundImage,
} from "../utils/helpers.js";
import { embedCustomFonts } from "../modules/fonts.js";
import { precacheCommonTags } from "../utils/cssTools.js";
import { cache } from "../core/cache.js";

/**
 * Preloads images, background images, and optionally fonts into cache before DOM capture.
 *
 * @param {Document|Element} [root=document] - The root node to search for resources
 * @param {Object} [options={}] - Pre-caching options
 * @returns {Promise<void>} Resolves when all resources are pre-cached
 */

export async function preCache(root = document, options = {}) {
  const {
    embedFonts = true,
    reset = false,
    includeFontFamilies = [],
  } = options;
  if (reset) {
    cache.reset();
    return;
  }
  // await document.fonts.ready;
  precacheCommonTags();
  let imgEls = [],
    allEls = [];
  if (root?.querySelectorAll) {
    imgEls = Array.from(root.querySelectorAll("img[src]"));
    allEls = Array.from(root.querySelectorAll("*"));
  }
  const promises = [];
  for (const img of imgEls) {
    const src = img.src;
    if (!cache.image.has(src)) {
      promises.push(
        fetchImage(src, { useProxy: options.useProxy })
          .then((dataURL) => cache.image.set(src, dataURL))
          .catch(() => {})
      );
    }
  }
  for (const el of allEls) {
    const bg = getStyle(el).backgroundImage;
    if (bg && bg !== "none") {
      const bgSplits = splitBackgroundImage(bg);
      for (const entry of bgSplits) {
        const isUrl = entry.startsWith("url(");
        if (isUrl) {
          promises.push(
            inlineSingleBackgroundEntry(entry, options).catch(() => {})
          );
        }
      }
    }
  }
  if (embedFonts) {
    await embedCustomFonts({ preCached: true, includeFontFamilies });
  }
  await Promise.all(promises);
}
