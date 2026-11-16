/* Route101 Banking AI — site behaviour
   - Navigation (all pages)
   - Amara avatar: native looping video with existing living motion on home page
   - Scroll reveal and greeting typewriter
*/
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  function initAvatar() {
    var card = document.querySelector(".portrait-card.amara-living");
    var stage = document.querySelector(".amara-stage");
    if (!card || !stage) return;
    var media = stage.querySelector("video.amara-motion");
    if (!media) return;

    if (reduceMotion()) {
      media.pause();
      return;
    }

    startLiving(card, stage, media);
    startTypewriter(card.querySelector(".speech p"));

    var played = media.play();
    if (played && played.catch) played.catch(function () {});
  }

  function startLiving(cardEl, stage, media) {
    var visible = true;
    var tx = 0, ty = 0;
    var px = 0, py = 0;
    var start = performance.now();
    var TAU = Math.PI * 2;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) {
          var p = media.play && media.play();
          if (p && p.catch) p.catch(function () {});
        } else if (media.pause) {
          media.pause();
        }
      }).observe(stage);
    }

    cardEl.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
      ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
    });
    cardEl.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      var t = (now - start) / 1000;
      px += (tx - px) * 0.035;
      py += (ty - py) * 0.035;
      var breathe = 1 + Math.sin(t * TAU / 4.6) * 0.006;
      var sway = Math.sin(t * TAU / 9.7) * 2.2 + Math.sin(t * TAU / 5.3 + 1.3) * 1.1;
      var bob = Math.sin(t * TAU / 6.1 + 0.4) * 1.4;
      var tilt = Math.sin(t * TAU / 11.3 + 0.6) * 0.45;
      var x = sway + px * 12;
      var y = bob + py * 8;
      media.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) rotate(" + tilt.toFixed(3) + "deg) scale(" + breathe.toFixed(4) + ")";
    }
    requestAnimationFrame(frame);
  }

  function startTypewriter(el) {
    if (!el) return;
    var full = el.dataset.text || el.textContent;
    el.setAttribute("aria-label", full);
    var caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    var i = 0;
    setTimeout(function type() {
      el.textContent = full.slice(0, i);
      el.appendChild(caret);
      if (i < full.length) {
        i += 1;
        setTimeout(type, 32 + Math.random() * 30);
      } else {
        setTimeout(function () { caret.remove(); }, 1400);
      }
    }, 900);
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion()) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  }

  function initNav() {
    var menu = document.querySelector(".menu");
    var nav = document.querySelector(".nav-links");
    if (menu && nav) {
      menu.setAttribute("type", "button");
      menu.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(open));
      });
    }
    var page = document.body.dataset.page;
    document.querySelectorAll("[data-page]").forEach(function (link) {
      if (link.dataset.page === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initAvatar();
    initReveal();
  });
})();
