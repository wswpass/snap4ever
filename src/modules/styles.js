import { getStyleKey } from "../utils/cssTools.js";
import { getStyle } from "../utils/helpers.js";
import { cache } from "../core/cache.js";

function snapshotComputedStyleFull(style) {
  const result = {};
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    let val = style.getPropertyValue(prop);

    // Opcional: evitar URLs externas que puedan romper renderizado
    if (
      (prop === "background-image" || prop === "content") &&
      val.includes("url(") &&
      !val.includes("data:")
    ) {
      val = "none";
    }

    result[prop] = val;
  }
  return result;
}

export function inlineAllStyles(source, clone, compress) {
  if (source.tagName === "STYLE") return;
  if (!cache.preStyle.has(source)) {
    cache.preStyle.set(source, getStyle(source));
  }
  const style = cache.preStyle.get(source);

  if (!cache.snapshot.has(source)) {
    const snapshot = snapshotComputedStyleFull(style);
    cache.snapshot.set(source, snapshot);
  }

  const snapshot = cache.snapshot.get(source);

  const hash = Object.entries(snapshot)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([prop, val]) => `${prop}:${val}`)
    .join(";");

  if (cache.snapshotKey.has(hash)) {
    cache.preStyleMap.set(clone, cache.snapshotKey.get(hash));
    return;
  }

  const tagName = source.tagName?.toLowerCase() || "div";
  const key = getStyleKey(snapshot, tagName, compress);

  cache.snapshotKey.set(hash, key);
  cache.preStyleMap.set(clone, key);
}
