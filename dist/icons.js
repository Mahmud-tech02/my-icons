/*!
 * My Icons — reusable SVG outline icon loader
 * Usage:
 *   <script src=".../icons.js" data-icons-url="https://.../icons.svg"></script>
 *   <i data-icon="search"></i>
 *
 * If data-icons-url is not set, it falls back to a URL relative to this
 * script's own location: "../icons/icons.svg" (matches this repo's layout).
 *
 * (c) MIT License
 */
(function () {
  "use strict";

  var ATTR = "data-icon";
  var DONE_ATTR = "data-icon-rendered";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var XLINK_NS = "http://www.w3.org/1999/xlink";

  // ---------------------------------------------------------------------
  // 1. Work out where icons.svg lives
  // ---------------------------------------------------------------------
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  function resolveSpriteUrl() {
    if (currentScript) {
      var explicit = currentScript.getAttribute("data-icons-url");
      if (explicit) return explicit;
    }
    if (window.ICONS_CONFIG && window.ICONS_CONFIG.url) {
      return window.ICONS_CONFIG.url;
    }
    // Fallback: assume repo layout dist/icons.js -> ../icons/icons.svg
    if (currentScript && currentScript.src) {
      return currentScript.src.replace(
        /dist\/icons(\.min)?\.js(\?.*)?$/,
        "icons/icons.svg"
      );
    }
    return "icons/icons.svg";
  }

  var SPRITE_URL = resolveSpriteUrl();

  // ---------------------------------------------------------------------
  // 2. Fetch the sprite once, inject it hidden into the document,
  //    then render every [data-icon] element.
  // ---------------------------------------------------------------------
  var spriteReady = false;
  var spriteContainer = null;
  var pendingQueue = [];

  function injectSprite(svgText) {
    var wrapper = document.createElement("div");
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.style.position = "absolute";
    wrapper.style.width = "0";
    wrapper.style.height = "0";
    wrapper.style.overflow = "hidden";
    wrapper.innerHTML = svgText;
    document.body.insertBefore(wrapper, document.body.firstChild);
    spriteContainer = wrapper;
    spriteReady = true;
  }

  function hasSymbol(name) {
    return !!(spriteContainer && spriteContainer.querySelector("symbol#" + cssEscape(name)));
  }

  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/([^\w-])/g, "\\$1");
  }

  // ---------------------------------------------------------------------
  // 3. Render a single <i data-icon="name"> element
  // ---------------------------------------------------------------------
  function renderIcon(el) {
    if (!el || el.hasAttribute(DONE_ATTR)) return;
    var name = el.getAttribute(ATTR);
    if (!name) return;

    if (!hasSymbol(name)) {
      console.warn('[Icons] Icon "' + name + '" not found.');
      el.setAttribute(DONE_ATTR, "true"); // don't retry / don't break layout
      return;
    }

    var svg = document.createElementNS(SVG_NS, "svg");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttributeNS(XLINK_NS, "xlink:href", "#" + name);
    use.setAttribute("href", "#" + name); // modern browsers
    svg.appendChild(use);

    // Preserve all attributes from the original <i> (class, id, aria-*, style, etc.)
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name === ATTR) continue;
      svg.setAttribute(attr.name, attr.value);
    }

    svg.setAttribute("width", svg.getAttribute("width") || "24");
    svg.setAttribute("height", svg.getAttribute("height") || "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("focusable", "false");
    if (!svg.hasAttribute("aria-hidden") && !svg.hasAttribute("aria-label")) {
      svg.setAttribute("aria-hidden", "true");
    }
    svg.setAttribute(DONE_ATTR, "true");
    svg.classList.add("icon");

    if (el.parentNode) {
      el.parentNode.replaceChild(svg, el);
    }
  }

  function renderAll(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[" + ATTR + "]:not([" + DONE_ATTR + "])");
    for (var i = 0; i < nodes.length; i++) {
      if (spriteReady) {
        renderIcon(nodes[i]);
      } else {
        pendingQueue.push(nodes[i]);
      }
    }
  }

  function flushPending() {
    var queue = pendingQueue;
    pendingQueue = [];
    for (var i = 0; i < queue.length; i++) renderIcon(queue[i]);
  }

  // ---------------------------------------------------------------------
  // 4. Watch for dynamically-added icons
  // ---------------------------------------------------------------------
  function observeDom() {
    if (!("MutationObserver" in window)) return;
    var observer = new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var added = mutations[m].addedNodes;
        for (var n = 0; n < added.length; n++) {
          var node = added[n];
          if (node.nodeType !== 1) continue; // element nodes only
          if (node.hasAttribute && node.hasAttribute(ATTR)) {
            spriteReady ? renderIcon(node) : pendingQueue.push(node);
          }
          if (node.querySelectorAll) {
            renderAll(node);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ---------------------------------------------------------------------
  // 5. Boot
  // ---------------------------------------------------------------------
  function init() {
    renderAll(document); // queue whatever is already in the DOM

    fetch(SPRITE_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (svgText) {
        injectSprite(svgText);
        flushPending();
        observeDom();
      })
      .catch(function (err) {
        console.error("[Icons] Failed to load icon sprite from " + SPRITE_URL + ":", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ---------------------------------------------------------------------
  // 6. Public API
  // ---------------------------------------------------------------------
  window.Icons = {
    render: function (root) {
      renderAll(root);
      if (spriteReady) flushPending();
    },
    url: SPRITE_URL
  };
})();
