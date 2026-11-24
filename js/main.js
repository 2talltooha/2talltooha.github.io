/*
  Taha El Ghadi · portfolio

  What this file does:
    1. Builds the project cards and the "Smaller tools" grid from data/projects.js
    2. Opens a case study in a panel, with its own address (for example #stillwave)
    3. Small things: the phone menu, the résumé and Devpost links, the About
       photo, the footer date and the yellow notes you see while previewing

  No libraries. You should not need to edit this file to change content.
*/
(function () {
  'use strict';

  var doc = document;
  var data = window.PORTFOLIO;
  var site = (data && data.site) || {};
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /*
    "Local" means you are looking at the site on your own computer. Empty picture
    slots and the yellow notes bar only show then, never to visitors.
    Add ?live to the address to see exactly what visitors see, or ?slots to
    force the helpers on.
  */
  var isLocal = (location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
      /[?&]slots\b/.test(location.search)) &&
    !/[?&]live\b/.test(location.search);

  var STATUS_LABELS = { shipped: 'Shipped', award: 'Award', progress: 'In progress' };
  var CASE_PARTS = [
    ['problem', 'Problem'],
    ['built', 'What I built'],
    ['how', 'How it works'],
    ['learned', 'What I learned and limitations'],
  ];
  var RESERVED_IDS = ['top', 'main', 'projects', 'research', 'experience', 'hackathons', 'about', 'contact', 'case'];
  var PLACEHOLDER = new RegExp('\\[' + 'PLACEHOLDER' + '[^\\]]*\\]', 'g');

  var warnings = [];
  var emptySlots = 0;

  /* ---------------------------------------------------------------------
     Small helpers
     --------------------------------------------------------------------- */

  // Straight quotes become curly ones, and a number stays glued to its unit
  // ("60 GHz"), so the data file can be typed with a plain keyboard.
  function typeset(text) {
    return String(text)
      .replace(/(^|[\s(\[{\u2013\u2014-])"/g, '$1\u201C')
      .replace(/"/g, '\u201D')
      .replace(/(^|[\s(\[{\u2013\u2014-])'/g, '$1\u2018')
      .replace(/'/g, '\u2019')
      .replace(/(\d) (?=(?:GHz|MHz|kHz|Hz|ms|s|min|h|m|cm|mm|px|KB|MB|GB)\b)/g, '$1\u00A0');
  }

  // Adds text to a node and wraps every unfinished note in a highlight.
  function appendMarked(parent, text) {
    var last = 0;
    var match;
    PLACEHOLDER.lastIndex = 0;
    while ((match = PLACEHOLDER.exec(text))) {
      if (match.index > last) parent.appendChild(doc.createTextNode(text.slice(last, match.index)));
      var mark = doc.createElement('mark');
      mark.className = 'placeholder';
      mark.textContent = match[0];
      parent.appendChild(mark);
      last = match.index + match[0].length;
    }
    if (last < text.length) parent.appendChild(doc.createTextNode(text.slice(last)));
  }

  function appendText(parent, text) {
    appendMarked(parent, typeset(text));
  }

  function append(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (item) { append(parent, item); });
      return;
    }
    parent.appendChild(typeof child === 'string' ? doc.createTextNode(child) : child);
  }

  // el('p', { class: 'x', text: 'Hello' }, child, child...)
  function el(tag, attrs) {
    var node = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'text') appendText(node, value);
        else node.setAttribute(key, value === true ? '' : String(value));
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }

  function icon(name) {
    var svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = doc.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + name);
    svg.appendChild(use);
    return svg;
  }

  function pad(number) {
    return number < 10 ? '0' + number : String(number);
  }

  function toList(value) {
    if (!value) return [];
    return (Array.isArray(value) ? value : [value]).filter(function (item) {
      return typeof item === 'string' && item.trim() !== '';
    });
  }

  function countPlaceholders(value) {
    if (typeof value === 'string') return (value.match(PLACEHOLDER) || []).length;
    if (Array.isArray(value)) return value.reduce(function (sum, item) { return sum + countPlaceholders(item); }, 0);
    if (value && typeof value === 'object') {
      return Object.keys(value).reduce(function (sum, key) { return sum + countPlaceholders(value[key]); }, 0);
    }
    return 0;
  }

  /* ---------------------------------------------------------------------
     Pieces shared by the cards and the case study
     --------------------------------------------------------------------- */

  function knownStatus(status) {
    return Object.prototype.hasOwnProperty.call(STATUS_LABELS, status);
  }

  // An unknown status falls back to "In progress", the more cautious label.
  function badge(project) {
    var kind = knownStatus(project.status) ? project.status : 'progress';
    return el('span', { class: 'badge badge--' + kind }, typeset(project.statusLabel || STATUS_LABELS[kind]));
  }

  function tagList(tags) {
    var list = toList(tags);
    if (!list.length) return null;
    var node = el('ul', { class: 'tags', 'aria-label': 'Built with' });
    list.forEach(function (tag) {
      node.appendChild(el('li', { class: 'tag' }, typeset(tag)));
    });
    return node;
  }

  // Links with an empty url are left out, so nothing on the page is a dead end.
  function linkRow(links, subject) {
    var live = (links || []).filter(function (link) { return link && link.url; });
    if (!live.length) return null;
    var row = el('p', { class: 'link-row' });
    live.forEach(function (link) {
      var label = link.label || 'Link';
      row.appendChild(el('a', { href: link.url, 'aria-label': label + ': ' + subject }, typeset(label), icon('i-external')));
    });
    return row;
  }

  function roleLine(role) {
    if (!role) return null;
    var node = el('p', { class: 'card-role' }, el('span', { class: 'label' }, 'My role'));
    appendText(node, role);
    return node;
  }

  function noteBox(note) {
    if (!note || !note.text) return null;
    return el('div', { class: 'note' },
      note.label ? el('p', { class: 'note-label' }, typeset(note.label)) : null,
      el('p', { text: note.text }));
  }

  function mediaNode(item, width, height, lazy) {
    if (/\.(mp4|webm)(\?.*)?$/i.test(item.src)) {
      return el('video', { src: item.src, controls: true, playsinline: true, preload: 'metadata', 'aria-label': item.alt || null });
    }
    return el('img', {
      src: item.src,
      alt: item.alt || '',
      width: width,
      height: height,
      loading: lazy ? 'lazy' : null,
      decoding: 'async',
    });
  }

  // An empty, labelled box that says which picture goes here. Local preview only.
  function slot(lines, extraClass) {
    var box = el('div', { class: 'slot' + (extraClass ? ' ' + extraClass : '') });
    lines.forEach(function (line, index) {
      box.appendChild(el(index === 0 ? 'strong' : 'span', null, line));
    });
    return box;
  }

  /* ---------------------------------------------------------------------
     Project cards
     --------------------------------------------------------------------- */

  function cardMedia(project) {
    var image = project.image || {};
    if (image.src) return el('div', { class: 'card-media' }, mediaNode(image, 1600, 1000, true));
    if (!isLocal) return null;
    emptySlots += 1;
    return el('div', { class: 'card-media' }, slot([
      'Picture slot \u00B7 1600 \u00D7 1000 px',
      'Save it as assets/img/projects/' + project.id + '.jpg',
      'then set image.src in data/projects.js',
    ]));
  }

  function renderCard(project, index) {
    var openId = 'open-' + project.id;
    var card = el('article', { class: 'card' + (index === 0 ? ' card--lead' : ''), id: 'card-' + project.id });

    var media = cardMedia(project);
    if (media) {
      card.classList.add('has-media');
      card.appendChild(media);
    }

    var main = el('div', { class: 'card-main' },
      el('div', { class: 'card-top' },
        el('span', { class: 'card-index' }, 'Project ' + pad(index + 1)),
        badge(project)),
      el('h3', { class: 'card-title' },
        el('a', { href: '#' + project.id, 'aria-describedby': openId }, typeset(project.title))),
      project.context ? el('p', { class: 'card-context', text: project.context }) : null,
      project.hook ? el('p', { class: 'card-hook', text: project.hook }) : null,
      noteBox(project.note));

    var meta = el('div', { class: 'card-meta' }, roleLine(project.role), tagList(project.tags));

    var foot = el('div', { class: 'card-foot' },
      el('span', { class: 'card-open', id: openId }, 'Read the case study', icon('i-arrow')),
      linkRow(project.links, project.title));

    card.appendChild(el('div', { class: 'card-body' }, main, meta, foot));
    return card;
  }

  function renderTool(tool) {
    var foot = el('div', { class: 'tool-foot' }, tagList(tool.tags));
    if (tool.link && tool.link.url) foot.appendChild(linkRow([tool.link], tool.title));
    return el('li', { class: 'tool' },
      el('h4', { class: 'tool-title' }, typeset(tool.title || '')),
      tool.text ? el('p', { class: 'tool-text', text: tool.text }) : null,
      foot);
  }

  function errorNotice() {
    var box = el('div', { class: 'notice', role: 'alert' },
      el('p', null,
        el('strong', null, 'The projects could not be loaded. '),
        'There is probably a typo in ', el('code', null, 'data/projects.js'),
        ', such as a missing comma or quote mark near the last line you edited.'));
    if (window.PORTFOLIO_ERROR) box.appendChild(el('p', null, 'The browser says: ', el('code', null, String(window.PORTFOLIO_ERROR))));
    return box;
  }

  /* ---------------------------------------------------------------------
     Read and check the data
     --------------------------------------------------------------------- */

  var projects = [];
  var byId = Object.create(null);

  if (data && Array.isArray(data.featured)) {
    data.featured.forEach(function (project, index) {
      if (!project || !project.id || !project.title) {
        warnings.push('Project number ' + (index + 1) + ' has no id or title, so it was skipped.');
        return;
      }
      if (!/^[a-z0-9][a-z0-9-]*$/.test(project.id)) warnings.push('The id "' + project.id + '" should use only lowercase letters, numbers and hyphens.');
      if (RESERVED_IDS.indexOf(project.id) !== -1) warnings.push('The id "' + project.id + '" is the name of a page section. Pick another.');
      if (byId[project.id]) {
        warnings.push('Two projects share the id "' + project.id + '". The second was skipped.');
        return;
      }
      if (!knownStatus(project.status)) warnings.push('"' + project.title + '" has an unknown status, so it shows as In progress.');
      byId[project.id] = project;
      projects.push(project);
    });
  }

  /* ---------------------------------------------------------------------
     Case study panel
     --------------------------------------------------------------------- */

  var dialog = doc.getElementById('case');
  var article = doc.getElementById('case-article');
  var caseNav = doc.getElementById('case-nav');
  var kicker = doc.getElementById('case-kicker');
  var scroller = doc.getElementById('case-scroll');
  var canOpen = !!(dialog && typeof dialog.showModal === 'function' && projects.length);
  var baseTitle = doc.title;
  var currentId = null;
  var lastTrigger = null;

  function caseMedia(project) {
    var items = [];
    if (project.image && project.image.src) items.push(project.image);
    (project.gallery || []).forEach(function (item) {
      if (item && item.src) items.push(item);
    });

    if (!items.length) {
      if (!isLocal) return null;
      return el('div', { class: 'case-media' }, slot([
        'Picture slots \u00B7 1600 \u00D7 1000 px each',
        'Photos, screenshots, a demo GIF or a short video',
        'List them under gallery in data/projects.js',
      ]));
    }

    var wrap = el('div', { class: 'case-media' });
    items.forEach(function (item) {
      wrap.appendChild(el('figure', null,
        mediaNode(item, 1600, 1000, false),
        item.caption ? el('figcaption', { text: item.caption }) : null));
    });
    return wrap;
  }

  // A paragraph that starts with "- " becomes a bullet point.
  function sectionBody(paragraphs) {
    var body = el('div', { class: 'case-section-body' });
    var bullets = null;
    paragraphs.forEach(function (text) {
      if (/^-\s+/.test(text)) {
        if (!bullets) {
          bullets = el('ul');
          body.appendChild(bullets);
        }
        bullets.appendChild(el('li', { text: text.replace(/^-\s+/, '') }));
      } else {
        bullets = null;
        body.appendChild(el('p', { text: text }));
      }
    });
    return body;
  }

  function renderCase(project) {
    var index = projects.indexOf(project);
    var study = project.caseStudy || {};

    kicker.textContent = 'Case study \u00B7 ' + pad(index + 1) + ' of ' + pad(projects.length);
    article.textContent = '';
    caseNav.textContent = '';

    article.appendChild(el('div', { class: 'case-meta' },
      badge(project),
      project.context ? el('p', { class: 'card-context', text: project.context }) : null));
    article.appendChild(el('h2', { class: 'case-title', id: 'case-title', tabindex: '-1' }, typeset(project.title)));
    if (project.hook) article.appendChild(el('p', { class: 'case-hook', text: project.hook }));

    var facts = el('div', { class: 'case-facts' },
      roleLine(project.role),
      tagList(project.tags),
      linkRow(project.links, project.title),
      noteBox(project.note));
    if (facts.childNodes.length) article.appendChild(facts);

    append(article, caseMedia(project));

    var sections = el('div', { class: 'case-sections' });
    CASE_PARTS.forEach(function (part, step) {
      var paragraphs = toList(study[part[0]]);
      if (!paragraphs.length) return;
      sections.appendChild(el('section', { class: 'case-section' },
        el('h3', null, el('span', { class: 'step' }, pad(step + 1)), ' ', part[1]),
        sectionBody(paragraphs)));
    });
    if (sections.childNodes.length) article.appendChild(sections);

    var previous = projects[index - 1];
    var next = projects[index + 1];
    if (previous) {
      caseNav.appendChild(el('a', { class: 'prev', href: '#' + previous.id },
        el('span', { class: 'dir' }, 'Previous'),
        el('span', { class: 'name' }, typeset(previous.title))));
    }
    if (next) {
      caseNav.appendChild(el('a', { class: 'next', href: '#' + next.id },
        el('span', { class: 'dir' }, 'Next'),
        el('span', { class: 'name' }, typeset(next.title))));
    }
    caseNav.hidden = !previous && !next;
  }

  function projectInAddress() {
    var id = '';
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch (error) {
      id = location.hash.slice(1);
    }
    return byId[id] || null;
  }

  function addressWithoutHash() {
    return location.pathname + location.search;
  }

  function openCase(project) {
    if (!canOpen) return;
    if (dialog.open && currentId === project.id) return;

    renderCase(project);
    currentId = project.id;
    doc.title = project.title + ' \u00B7 Taha El Ghadi';

    if (!dialog.open) {
      dialog.showModal();
      doc.documentElement.classList.add('is-locked');
    }
    scroller.scrollTop = 0;

    var title = doc.getElementById('case-title');
    if (title) title.focus({ preventScroll: true });
  }

  // Close the panel and clear the hash. The phone Back button still works
  // through popstate (we push a history entry when opening from a click).
  function requestClose() {
    if (!dialog.open) return;
    if (projectInAddress()) history.replaceState(null, '', addressWithoutHash());
    dialog.close();
  }

  // Keep the panel in step with the address bar.
  function syncWithAddress() {
    if (!canOpen) return;
    var project = projectInAddress();
    if (project) openCase(project);
    else if (dialog.open) dialog.close();
  }

  if (canOpen) {
    dialog.addEventListener('close', function () {
      currentId = null;
      doc.documentElement.classList.remove('is-locked');
      doc.title = baseTitle;
      if (projectInAddress()) history.replaceState(null, '', addressWithoutHash());
      if (lastTrigger && doc.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    });

    // Esc
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      requestClose();
    });

    doc.getElementById('case-close').addEventListener('click', requestClose);

    // A click on the dimmed area outside the panel closes it. Both press and
    // release must be outside, so dragging to select text never closes it.
    var pressedOutside = false;
    var isOutside = function (event) {
      var box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    dialog.addEventListener('mousedown', function (event) {
      pressedOutside = event.target === dialog && isOutside(event);
    });
    dialog.addEventListener('click', function (event) {
      if (pressedOutside && event.target === dialog && isOutside(event)) requestClose();
      pressedOutside = false;
    });

    // Any link on the page that points at a project opens its case study.
    doc.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var project = byId[link.getAttribute('href').slice(1)];
      if (!project) return;

      event.preventDefault();
      if (dialog.open) {
        // Moving between case studies: replace the address, so Back still closes in one step.
        history.replaceState(history.state, '', '#' + project.id);
      } else {
        lastTrigger = link;
        history.pushState({ caseStudy: true }, '', '#' + project.id);
      }
      openCase(project);
    });

    window.addEventListener('popstate', syncWithAddress);
    window.addEventListener('hashchange', syncWithAddress);
  }

  /* ---------------------------------------------------------------------
     Page set-up
     --------------------------------------------------------------------- */

  // 1. Highlight unfinished notes written directly in index.html.
  var staticPlaceholders = 0;
  (function markStaticPlaceholders() {
    var root = doc.getElementById('main');
    if (!root || !doc.createTreeWalker) return;
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var found = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.indexOf('[' + 'PLACEHOLDER') !== -1) found.push(walker.currentNode);
    }
    found.forEach(function (node) {
      staticPlaceholders += (node.nodeValue.match(PLACEHOLDER) || []).length;
      var fragment = doc.createDocumentFragment();
      appendMarked(fragment, node.nodeValue);
      node.parentNode.replaceChild(fragment, node);
    });
  })();

  // 2. Project cards and smaller tools.
  var featuredRoot = doc.getElementById('featured');
  if (featuredRoot) {
    if (!data || !Array.isArray(data.featured)) {
      featuredRoot.appendChild(errorNotice());
    } else {
      projects.forEach(function (project, index) {
        featuredRoot.appendChild(renderCard(project, index));
      });
    }
  }

  var tools = data && Array.isArray(data.smallTools) ? data.smallTools.filter(function (tool) { return tool && tool.title; }) : [];
  var toolsRoot = doc.getElementById('small-tools');
  if (toolsRoot && tools.length) {
    tools.forEach(function (tool) {
      toolsRoot.appendChild(renderTool(tool));
    });
    doc.getElementById('small-tools-block').hidden = false;
  }

  // 3. Résumé and Devpost links: shown only once an address is set in the data file.
  ['resume', 'devpost'].forEach(function (key) {
    var url = typeof site[key] === 'string' ? site[key].trim() : '';
    if (!url) return;
    Array.prototype.forEach.call(doc.querySelectorAll('[data-site-link="' + key + '"]'), function (link) {
      link.setAttribute('href', url);
      if (link.hasAttribute('data-site-text')) {
        link.textContent = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      }
    });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-site-item="' + key + '"]'), function (node) {
      node.hidden = false;
    });
  });

  // 4. About photo.
  var photoHolder = doc.getElementById('about-photo');
  if (photoHolder) {
    var photo = site.photo || {};
    if (photo.src) {
      photoHolder.appendChild(el('img', { src: photo.src, alt: photo.alt || 'Taha El Ghadi', width: 800, height: 1000, loading: 'lazy', decoding: 'async' }));
      photoHolder.parentNode.classList.add('has-photo');
    } else if (isLocal) {
      photoHolder.appendChild(slot([
        'Photo slot \u00B7 800 \u00D7 1000 px',
        'Optional. Save it as assets/img/about/taha.jpg',
        'then set photo.src in data/projects.js',
      ], 'slot--portrait'));
      photoHolder.parentNode.classList.add('has-photo');
    }
  }

  // 5. Phone menu.
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    var menuIsOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    toggle.addEventListener('click', function () {
      setMenu(!menuIsOpen());
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('click', function (event) {
      if (menuIsOpen() && !toggle.contains(event.target) && !nav.contains(event.target)) setMenu(false);
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuIsOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 48rem)');
      var onWide = function () {
        if (wide.matches) setMenu(false);
      };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  // 6. Mark the section you are reading in the menu.
  if (nav && 'IntersectionObserver' in window) {
    var navLinks = Object.create(null);
    Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (link) {
      navLinks[link.getAttribute('href').slice(1)] = link;
    });
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(navLinks).forEach(function (id) {
      var section = doc.getElementById(id);
      if (section) watcher.observe(section);
    });
  }

  // 7. Footer date, taken from when the page file last changed.
  var updated = doc.getElementById('last-updated');
  var updatedTime = doc.getElementById('last-updated-time');
  if (updated && updatedTime) {
    var modified = new Date(doc.lastModified);
    if (!isNaN(modified.getTime()) && modified.getFullYear() > 2000) {
      updatedTime.setAttribute('datetime', modified.toISOString().slice(0, 10));
      updatedTime.textContent = modified.toLocaleDateString('en-CA', { year: 'numeric', month: 'long' });
      updated.hidden = false;
    }
  }

  // 8. Open the case study named in the address, if there is one (for example .../#stillwave).
  syncWithAddress();

  // 9. Notes for you, shown only on your own computer.
  if (isLocal) {
    var placeholders = staticPlaceholders + countPlaceholders(data && data.featured) + countPlaceholders(data && data.smallTools);
    var notes = [];
    if (placeholders) notes.push(placeholders + (placeholders === 1 ? ' placeholder' : ' placeholders') + ' to fill in');
    if (emptySlots) notes.push(emptySlots + (emptySlots === 1 ? ' project' : ' projects') + ' without a picture');
    if (!site.resume) notes.push('r\u00E9sum\u00E9 not linked yet');
    if (warnings.length) notes.push(warnings.length + (warnings.length === 1 ? ' warning' : ' warnings') + ' in the data file');

    warnings.forEach(function (warning) {
      if (window.console && console.warn) console.warn('[portfolio] ' + warning);
    });

    if (notes.length) {
      var bar = el('div', { class: 'preview-bar', role: 'status' },
        el('span', { title: warnings.join('\n') || null }, 'Only you see this: ' + notes.join(' \u00B7 ')));
      var hide = el('button', { type: 'button' }, 'Hide');
      hide.addEventListener('click', function () {
        bar.parentNode.removeChild(bar);
      });
      bar.appendChild(hide);
      doc.body.appendChild(bar);
    }
  }
})();
