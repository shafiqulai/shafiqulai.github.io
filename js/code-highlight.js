(function () {
  'use strict';

  function dedent(text) {
    var lines = text.split('\n');
    var min = Infinity;
    lines.forEach(function (line) {
      if (!line.trim()) return;
      var m = line.match(/^(\s+)/);
      if (m) min = Math.min(min, m[1].length);
      else min = 0;
    });
    if (!isFinite(min) || min === 0) return text.trim();
    return lines.map(function (line) {
      return line.slice(min);
    }).join('\n').trim();
  }

  function highlightBlock(block) {
    if (block.querySelector('span')) return;
    var raw = dedent(block.textContent);
    if (!raw) return;
    var lang = block.dataset.lang || 'bash';
    var code = document.createElement('code');
    code.className = 'language-' + lang;
    code.textContent = raw;
    var pre = document.createElement('pre');
    pre.className = 'language-' + lang;
    pre.appendChild(code);
    block.innerHTML = '';
    block.appendChild(pre);
    Prism.highlightElement(code);
  }

  function extendPrism() {
    if (!Prism || !Prism.languages.python) return;
    // Highlight self/cls as Python keywords (Prism omits them by default)
    Prism.languages.insertBefore('python', 'keyword', {
      'self-cls': {
        pattern: /\b(?:self|cls)\b/,
        alias: 'keyword'
      }
    });
  }

  function init() {
    extendPrism();
    document.querySelectorAll('.blg-code-block').forEach(highlightBlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
