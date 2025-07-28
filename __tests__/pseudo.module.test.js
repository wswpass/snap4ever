vi.mock('../src/utils/helpers.js', async () => {
  const actual = await vi.importActual('../src/utils/helpers.js');
  return {
    ...actual,
    fetchImage: vi.fn(),
  };
});
vi.mock('../src/modules/fonts.js', async () => {
  const actual = await vi.importActual('../src/modules/fonts.js');
  return {
    ...actual,
    iconToImage: vi.fn(),
  };
});

import { describe, it, expect, vi } from 'vitest';
import { inlinePseudoElements } from '../src/modules/pseudo.js';
import * as helpers from '../src/utils/helpers.js';
import * as fonts from '../src/modules/fonts.js';

describe('inlinePseudoElements', () => {
  it('does not fail with simple elements', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    await expect(inlinePseudoElements(el, clone, new Map(), new WeakMap(), false)).resolves.toBeUndefined();
  });

  it('handles ::before with text content', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? '"★"' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with icon font', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? '"★"' : prop === 'font-family' ? 'Font Awesome' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Font Awesome',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    fonts.iconToImage.mockResolvedValue('data:image/png;base64,icon');
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with url content', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? 'url("https://test.com/img.png")' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    helpers.fetchImage.mockResolvedValue('data:image/png;base64,img');
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with background-image (data url)', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? 'none' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'url("data:image/png;base64,abc")' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with background-image (fetch)', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? 'none' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'url("https://test.com/img.png")' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    helpers.fetchImage.mockResolvedValue('data:image/png;base64,img');
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with background-image fetch error', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? 'none' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'url("https://test.com/img.png")' : prop === 'background-color' ? 'transparent' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    helpers.fetchImage.mockRejectedValue(new Error('fail'));
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::before with no visible box', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: () => 'none', color: '', fontSize: '', fontWeight: '', fontFamily: ''
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles ::first-letter with no textNode', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: ''
    }));
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('handles error in pseudo processing', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => { throw new Error('fail'); });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('ignores if source no es Element', async () => {
    const notElement = {};
    const clone = document.createElement('div');
    await expect(inlinePseudoElements(notElement, clone, new Map(), new WeakMap(), false)).resolves.toBeUndefined();
  });

  it('ignores if clone no es Element', async () => {
    const el = document.createElement('div');
    const notElement = {};
    await expect(inlinePseudoElements(el, notElement, new Map(), new WeakMap(), false)).resolves.toBeUndefined();
  });

  it('inserta pseudoEl como ::after', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::after') return {
        getPropertyValue: (prop) => prop === 'content' ? '"after"' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? '#f00' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('inserta pseudoEl como ::before', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? '"before"' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? '#f00' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('no inserta pseudoEl si no hay visible box', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => 'none', color: '', fontSize: '', fontWeight: '', fontFamily: ''
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('maneja ::first-letter meaningful', async () => {
    const el = document.createElement('div');
    el.textContent = 'Test';
    const clone = document.createElement('div');
    clone.textContent = 'Test';
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::first-letter') return {
        getPropertyValue: (prop) => prop === 'color' ? '#f00' : '', color: '#f00', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('inserta ambos pseudoEl ::before y ::after en una sola ejecución', async () => {
    const el = document.createElement('div');
    const clone = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockImplementation((_, pseudo) => {
      if (pseudo === '::before') return {
        getPropertyValue: (prop) => prop === 'content' ? '"before"' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? '#f00' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      if (pseudo === '::after') return {
        getPropertyValue: (prop) => prop === 'content' ? '"after"' : prop === 'font-family' ? 'Arial' : prop === 'font-size' ? '32' : prop === 'font-weight' ? '400' : prop === 'color' ? '#000' : prop === 'background-image' ? 'none' : prop === 'background-color' ? '#0f0' : '',
        color: '#000', fontSize: '32px', fontWeight: '400', fontFamily: 'Arial',
      };
      return { getPropertyValue: () => '', color: '', fontSize: '', fontWeight: '', fontFamily: '' };
    });
    await inlinePseudoElements(el, clone, new Map(), new WeakMap(), false);
    window.getComputedStyle.mockRestore();
  });

  it('should inline ::first-letter when style is meaningful', async () => {
  const el = document.createElement('p');
  el.textContent = '¡Hola mundo!';
  el.style.setProperty('color', 'black');

  document.body.appendChild(el);
  const clone = el.cloneNode(true);
  const styleMap = new Map();
  const styleCache = new WeakMap();

  const style = document.createElement('style');
  style.textContent = `
    p::first-letter {
      color: red;
      font-size: 200%;
    }
  `;
  document.head.appendChild(style);

  await inlinePseudoElements(el, clone, styleMap, styleCache, false);
  const firstLetterEl = clone.querySelector('[data-snapdom-pseudo="::first-letter"]');
  expect(firstLetterEl).toBeTruthy();
  expect(firstLetterEl.textContent.length).toBeGreaterThan(0);
});

it('should inline background-image entries for pseudo-element', async () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const style = document.createElement('style');
  style.textContent = `
    div::after {
      content: " ";
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='blue'/%3E%3C/svg%3E");
      display: inline-block;
      width: 10px;
      height: 10px;
    }
  `;
  document.head.appendChild(style);

  const clone = el.cloneNode(true);
  const styleMap = new Map();
  const styleCache = new WeakMap();

  await inlinePseudoElements(el, clone, styleMap, styleCache, false);
  const pseudoAfter = clone.querySelector('[data-snapdom-pseudo="::after"]');
  expect(pseudoAfter).toBeTruthy();
  expect(pseudoAfter.style.backgroundImage.startsWith("url(\"data:image/")).toBeTruthy();
});

});





