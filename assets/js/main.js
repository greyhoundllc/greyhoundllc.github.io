/* Greyhound LLC — tab navigation, menu and contact form.
   Each section is a "tab": only one is visible at a time, the address bar
   shows #section-name so every tab can be linked to or bookmarked. */
(function () {
  "use strict";

  var root = document.documentElement;
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var slugs = panels.map(function (p) { return p.id; });
  var labels = panels.map(function (p) { return p.getAttribute("data-label"); });
  var tabLinks = Array.prototype.slice.call(document.querySelectorAll(".tabs a"));
  var tabsEl = document.getElementById("tabs");
  var menuBtn = document.querySelector(".menu-btn");
  var prevLink = document.querySelector(".pager__prev");
  var nextLink = document.querySelector(".pager__next");
  var nowEl = document.querySelector(".pager__now");
  var current = null;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  // Stagger index for the entrance animation
  panels.forEach(function (p) {
    Array.prototype.forEach.call(p.querySelectorAll(".reveal"), function (el, i) {
      el.style.setProperty("--i", i);
    });
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function slugFromHash() {
    var h = "";
    try { h = decodeURIComponent(location.hash.replace(/^#\/?/, "")); } catch (e) {}
    return slugs.indexOf(h) > -1 ? h : "home";
  }

  function setPagerLink(link, idx) {
    if (idx < 0 || idx >= slugs.length) { link.classList.add("is-hidden"); link.setAttribute("tabindex", "-1"); return; }
    link.classList.remove("is-hidden"); link.removeAttribute("tabindex");
    link.setAttribute("href", "#" + slugs[idx]);
    link.querySelector("b").textContent = labels[idx];
  }

  function show(slug, userInitiated) {
    if (slug === current) return;
    var idx = slugs.indexOf(slug);
    current = slug;

    panels.forEach(function (p) {
      var on = p.id === slug;
      p.hidden = !on;
      p.classList.remove("enter");
    });
    var panel = panels[idx];
    void panel.offsetWidth; // restart the animation
    panel.classList.add("enter");

    tabLinks.forEach(function (a) {
      if (a.getAttribute("data-tab") === slug) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    document.title = panel.getAttribute("data-title") || document.title;
    nowEl.textContent = pad(idx);
    setPagerLink(prevLink, idx - 1);
    // On the last tab, "next" loops back to Home
    setPagerLink(nextLink, idx + 1 < slugs.length ? idx + 1 : 0);

    window.scrollTo(0, 0);
    if (userInitiated) {
      var h = panel.querySelector("h1, h2");
      if (h) h.focus({ preventScroll: true });
    }
    closeMenu();
  }

  /* ---- Menu (small screens) ---- */
  function openMenu() {
    tabsEl.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.querySelector(".menu-btn__label").textContent = "Close";
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    tabsEl.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.querySelector(".menu-btn__label").textContent = "Menu";
    document.body.style.overflow = "";
  }
  menuBtn.addEventListener("click", function () {
    if (tabsEl.classList.contains("open")) closeMenu(); else openMenu();
  });
  tabLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1200) closeMenu();
  });

  /* ---- Routing ---- */
  window.addEventListener("hashchange", function () { show(slugFromHash(), true); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (t && t.isContentEditable) return;
    var idx = slugs.indexOf(slugFromHash());
    if (e.key === "ArrowRight" && idx < slugs.length - 1) location.hash = slugs[idx + 1];
    if (e.key === "ArrowLeft" && idx > 0) location.hash = slugs[idx - 1];
  });

  show(slugFromHash(), false);
  root.classList.add("ready");

  // Once the page has loaded, quietly fetch the other tabs' photos so tab changes feel instant.
  window.addEventListener("load", function () {
    var go = function () {
      Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = "eager"; });
    };
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1200);
  });

  /* ---- Contact form (Web3Forms) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var say = function (msg, cls) { status.textContent = msg; status.className = "form-status" + (cls ? " " + cls : ""); };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll(".field"), function (f) {
        var input = f.querySelector("input, textarea");
        var bad = !input.value.trim() || (input.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim()));
        f.classList.toggle("invalid", bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) { say("Please fill in your name, a valid email and a message.", "err"); return; }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (!data.access_key || data.access_key === "YOUR_ACCESS_KEY_HERE") {
        say("This form is not connected yet. Add the Web3Forms access key in index.html.", "err");
        return;
      }

      btn.disabled = true; say("Sending…");
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.success) { form.reset(); say("Thank you. We will be in touch soon.", "ok"); }
          else { say("Something went wrong. Please try again in a moment.", "err"); }
        })
        .catch(function () { say("Could not send. Please check your connection and try again.", "err"); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
