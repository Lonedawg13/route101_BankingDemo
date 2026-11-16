/* Route101 Banking AI — site behaviour
   - Navigation (all pages)
   - Amara avatar: living motion on the home page only; static on chat and voice
   - Public hook for integrations: window.AmaraAvatar.idle() / .speaking() / .setState()
*/
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var card = null;
  var living = null;

  /* ---------- Avatar state (images marked .amara-motion) ---------- */

  function motionMedia() {
    return document.querySelectorAll("video.amara-motion");
  }

  /* Each state is a video base name (without extension). "static" removes the
     sources so the poster image shows instead. */
  function applySource(video, state) {
    var base = state === "speaking" ? video.dataset.speakingSrc
             : state === "idle" ? video.dataset.idleSrc
             : null;
    var key = base || "static";
    if (video.dataset.current === key) return;
    video.dataset.current = key;

    while (video.firstChild) video.removeChild(video.firstChild);

    if (base) {
      [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(function (pair) {
        var source = document.createElement("source");
        source.src = base + "." + pair[0];
        source.type = pair[1];
        video.appendChild(source);
      });
      video.load();
      var played = video.play();
      if (played && played.catch) played.catch(function () {});
    } else {
      video.pause();
      video.load();
    }
  }

  function setState(state) {
    motionMedia().forEach(function (video) { applySource(video, state); });
    if (card) card.classList.toggle("is-speaking", state === "speaking");
    if (living) living.setSpeaking(state === "speaking");
  }

  window.AmaraAvatar = {
    idle: function () { setState("idle"); },
    speaking: function () { setState("speaking"); },
    setState: setState
  };

  window.addEventListener("amara:speaking", function () { setState("speaking"); });
  window.addEventListener("amara:idle", function () { setState("idle"); });

  /* ---------- Living motion (home page only) ---------- */

  function initAvatar() {
    card = document.querySelector(".portrait-card.amara-living");
    var stage = document.querySelector(".amara-stage");
    if (!card || !stage) return;

    if (reduceMotion()) {
      setState("static");
      return;
    }

    var media = stage.querySelector("video.amara-motion");
    if (!media) return;

    living = startLiving(card, stage, media);
    startTypewriter(card.querySelector(".speech p"));
  }

  /*
    Layered, non-repeating motion on the portrait:
    - breathing (slow scale)
    - gentle sway and a very small head tilt (sum of incommensurate sines, so it never looks looped)
    - the portrait eases towards the pointer, so Amara appears to notice the visitor
    Motion pauses when the hero is off-screen or the tab is hidden.
  */
  function startLiving(cardEl, stage, media) {
    var speaking = false;
    var visible = true;
    var tx = 0, ty = 0;   // pointer target, -0.5 .. 0.5
    var px = 0, py = 0;   // eased current value
    var start = performance.now();
    var TAU = Math.PI * 2;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        // Pause the video while it is off-screen to save battery and CPU
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
      var amp = speaking ? 1.6 : 1;

      px += (tx - px) * 0.035;
      py += (ty - py) * 0.035;

      var breathe = 1 + Math.sin(t * TAU / 4.6) * (speaking ? 0.011 : 0.006);
      var sway = Math.sin(t * TAU / 9.7) * 2.2 + Math.sin(t * TAU / 5.3 + 1.3) * 1.1;
      var bob = Math.sin(t * TAU / 6.1 + 0.4) * 1.4 * amp;
      var tilt = Math.sin(t * TAU / 11.3 + 0.6) * 0.45 * amp;

      var x = sway + px * 12;
      var y = bob + py * 8;

      media.style.transform =
        "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) " +
        "rotate(" + tilt.toFixed(3) + "deg) " +
        "scale(" + breathe.toFixed(4) + ")";
    }

    requestAnimationFrame(frame);

    return {
      setSpeaking: function (value) { speaking = !!value; }
    };
  }

  /* Greeting bubble: types out once, then rests */
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

  /* ---------- Scroll reveal ---------- */

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

  /* ---------- Navigation ---------- */

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
