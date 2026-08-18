// Interactive logic for /shop/ (A loja). Renders the catalog and item detail
// from the JSON embedded by shop.html (_data/products.yml). No framework, no build.
(function () {
  "use strict";

  var WA = window.SHOP_WA || "";
  var data = [];
  try {
    data = JSON.parse(document.getElementById("shop-data").textContent) || [];
  } catch (e) {
    data = [];
  }

  var viewResults = document.getElementById("view-results");
  var viewDetail = document.getElementById("view-detail");
  var grid = document.getElementById("results-grid");
  var emptyBox = document.getElementById("results-empty");
  var countEl = document.getElementById("results-count");
  var searchEl = document.getElementById("search");
  var chipsEl = document.getElementById("family-chips");
  var maxPriceEl = document.getElementById("max-price");
  var maxPriceLabel = document.getElementById("max-price-label");

  var currentFamily = "todos";

  var PHOTO_ICON =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
  var WA_ICON =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';

  function fmt(n) {
    return "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function waLink(prod) {
    var msg = "Olá Artur! Tenho interesse no " + prod.title + " — " + fmt(prod.price) + ". Ainda está disponível?";
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  function slot(src, hint) {
    if (src) {
      return '<div class="img-slot"><img src="' + esc(src) + '" alt="' + esc(hint) + '" loading="lazy"></div>';
    }
    return '<div class="img-ph">' + PHOTO_ICON + "<span>" + esc(hint) + "</span></div>";
  }

  function buildVM(prod) {
    var hasDiscount = prod.original && prod.original > prod.price;
    var images = prod.images || [];
    return {
      id: prod.id,
      family: prod.family,
      title: prod.title,
      price: prod.price,
      priceLabel: fmt(prod.price),
      originalLabel: hasDiscount ? fmt(prod.original) : "",
      hasDiscount: hasDiscount,
      discountLabel: hasDiscount ? "-" + Math.round((1 - prod.price / prod.original) * 100) + "%" : "",
      condLabel: prod.condition === "novo" ? "Novo" : "Usado",
      condCls: prod.condition === "novo" ? "tag tag-accent" : "tag tag-neutral",
      short: prod.short || "",
      notes: prod.notes || "",
      vendor: prod.vendor || "",
      specs: prod.specs || [],
      images: images,
      hero: images[0] || null,
      thumbs: images.slice(1),
      photoHint: "Foto — " + prod.title,
      whatsapp: waLink(prod)
    };
  }

  // — results —

  function cardHtml(vm) {
    return (
      '<article class="product-card" data-open="' + esc(vm.id) + '" ' +
      'style="display:flex;flex-direction:column;background:var(--color-surface);cursor:pointer;border-radius:12px;overflow:hidden">' +
        '<div class="duotone" style="aspect-ratio:1/1;position:relative;pointer-events:none">' + slot(vm.hero, vm.photoHint) + "</div>" +
        '<div style="padding:var(--space-3);display:flex;flex-direction:column;gap:6px;flex:1">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px">' +
            '<span style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--color-accent);font-family:var(--font-heading)">' + esc(vm.family) + "</span>" +
            '<span class="' + vm.condCls + '" style="flex:none">' + esc(vm.condLabel) + "</span>" +
          "</div>" +
          '<div class="card-title" style="font-size:15px;line-height:1.2">' + esc(vm.title) + "</div>" +
          '<div style="margin-top:auto;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">' +
            '<span style="font-family:var(--font-heading);font-size:20px">' + esc(vm.priceLabel) + "</span>" +
            (vm.hasDiscount ? '<span class="text-muted" style="font-size:12px;text-decoration:line-through">' + esc(vm.originalLabel) + "</span>" : "") +
          "</div>" +
          '<span style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--color-accent);font-family:var(--font-heading)">Ver detalhes →</span>' +
        "</div>" +
      "</article>"
    );
  }

  function applyFilters() {
    var q = searchEl.value.trim().toLowerCase();
    var condEl = document.querySelector('input[name="cond"]:checked');
    var cond = condEl ? condEl.value : "todos";
    var maxPrice = +maxPriceEl.value;

    var filtered = data.filter(function (p) {
      var haystack = (p.title + " " + p.family + " " + (p.vendor || "") + " " + (p.notes || "")).toLowerCase();
      return (
        (currentFamily === "todos" || p.family === currentFamily) &&
        (cond === "todos" || p.condition === cond) &&
        p.price <= maxPrice &&
        (q === "" || haystack.indexOf(q) !== -1)
      );
    });

    countEl.textContent = filtered.length + " " + (filtered.length === 1 ? "resultado" : "resultados");

    if (filtered.length === 0) {
      grid.innerHTML = "";
      grid.style.display = "none";
      emptyBox.style.display = "block";
    } else {
      emptyBox.style.display = "none";
      grid.style.display = "grid";
      grid.innerHTML = filtered.map(function (p) { return cardHtml(buildVM(p)); }).join("");
    }
  }

  function buildChips() {
    var families = [];
    data.forEach(function (p) {
      if (families.indexOf(p.family) === -1) families.push(p.family);
    });
    var options = [{ value: "todos", label: "Todos" }].concat(
      families.map(function (f) { return { value: f, label: f }; })
    );
    chipsEl.innerHTML = options
      .map(function (c) {
        var cls = c.value === currentFamily ? "btn btn-primary" : "btn btn-secondary";
        return '<button type="button" class="' + cls + '" data-family="' + esc(c.value) + '" style="cursor:pointer;border-radius:999px;padding:6px 16px">' + esc(c.label) + "</button>";
      })
      .join("");
  }

  function setFamily(value) {
    currentFamily = value;
    Array.prototype.forEach.call(chipsEl.querySelectorAll("[data-family]"), function (btn) {
      var active = btn.getAttribute("data-family") === value;
      btn.className = active ? "btn btn-primary" : "btn btn-secondary";
    });
  }

  // — detail —

  function specRowsPadrao(specs) {
    return specs
      .map(function (s) {
        return (
          '<div style="display:flex;justify-content:space-between;gap:var(--space-4);padding-bottom:var(--space-2);border-bottom:1px solid var(--color-divider)">' +
            '<span class="text-muted" style="font-size:13px">' + esc(s[0]) + "</span>" +
            '<span style="font-family:var(--font-heading);text-align:right">' + esc(s[1]) + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function thumbsHtml(vm) {
    if (!vm.thumbs.length) return "";
    var inner = vm.thumbs
      .map(function (src, i) {
        return (
          '<div class="duotone" style="flex:1;aspect-ratio:1/1;border:1px solid var(--color-divider);position:relative">' +
          slot(src, "Foto " + (i + 2)) +
          "</div>"
        );
      })
      .join("");
    return '<div style="display:flex;gap:var(--space-2)">' + inner + "</div>";
  }

  function waButton(vm, extraStyle) {
    return (
      '<a class="btn btn-primary btn-block" href="' + esc(vm.whatsapp) + '" target="_blank" rel="noopener" ' +
      'style="' + extraStyle + '">' + WA_ICON + "Comprar no WhatsApp</a>"
    );
  }

  function detailHtml(vm) {
    return (
      '<button type="button" class="btn btn-ghost" data-back style="padding-left:0;margin-bottom:var(--space-6)">← Voltar aos resultados</button>' +

      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-8);align-items:start">' +
        '<div class="detail-media" style="display:flex;flex-direction:column;gap:var(--space-2)">' +
          '<figure class="blueprint duotone" style="margin:0;aspect-ratio:1/1;position:relative">' +
            '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
            slot(vm.hero, vm.photoHint) +
          "</figure>" +
          thumbsHtml(vm) +
        "</div>" +

        "<div>" +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-3)">' +
            "<div>" +
              '<span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--color-accent);font-family:var(--font-heading)">' + esc(vm.family) + "</span>" +
              '<h1 style="font-size:clamp(24px,7vw,32px);text-transform:uppercase;margin:4px 0 0;line-height:1.08">' + esc(vm.title) + "</h1>" +
            "</div>" +
            '<span class="' + vm.condCls + '" style="flex:none">' + esc(vm.condLabel) + "</span>" +
          "</div>" +

          '<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:var(--space-4) 0 var(--space-6)">' +
            '<span style="font-family:var(--font-heading);font-size:clamp(30px,9vw,38px)">' + esc(vm.priceLabel) + "</span>" +
            (vm.hasDiscount ? '<span class="text-muted" style="text-decoration:line-through">' + esc(vm.originalLabel) + "</span>" : "") +
            (vm.hasDiscount ? '<span class="tag tag-accent" style="flex:none">' + esc(vm.discountLabel) + "</span>" : "") +
          "</div>" +

          waButton(vm, "font-size:15px;min-height:48px;gap:9px;margin-top:0") +
          '<p class="text-muted" style="font-size:12px;margin:8px 0 0;text-align:center">Abre uma conversa comigo com o item já preenchido.</p>' +

          (vm.notes
            ? '<div style="margin-top:var(--space-8)">' +
                '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--color-accent);margin:0 0 var(--space-2)">Minhas notas</h2>' +
                '<p style="margin:0">' + esc(vm.notes) + "</p></div>"
            : "") +

          (vm.vendor
            ? '<div style="margin-top:var(--space-6)">' +
                '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--color-accent);margin:0 0 var(--space-2)">Descrição do fabricante</h2>' +
                '<p class="text-muted" style="margin:0">' + esc(vm.vendor) + "</p></div>"
            : "") +

          (vm.specs.length
            ? '<div style="margin-top:var(--space-6)">' +
                '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--color-accent);margin:0 0 var(--space-3)">Especificações</h2>' +
                '<div style="display:flex;flex-direction:column;gap:var(--space-2)">' + specRowsPadrao(vm.specs) + "</div></div>"
            : "") +

          waButton(vm, "margin-top:var(--space-8);min-height:48px;gap:9px;font-size:15px") +
        "</div>" +
      "</div>"
    );
  }

  // — lightbox —

  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = lightbox.querySelector("img");
  var lightboxClose = lightbox.querySelector(".lightbox-close");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.classList.add("lb-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lb-open");
  }

  // — views / routing —

  function showResults() {
    viewDetail.style.display = "none";
    viewDetail.innerHTML = "";
    viewResults.style.display = "block";
    applyFilters();
  }

  function showDetail(id) {
    var prod = data.find(function (p) { return p.id === id; });
    if (!prod) { showResults(); return; }
    viewDetail.innerHTML = detailHtml(buildVM(prod));
    viewResults.style.display = "none";
    viewDetail.style.display = "block";
    window.scrollTo(0, 0);
  }

  function route() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (id && data.some(function (p) { return p.id === id; })) {
      showDetail(id);
    } else {
      showResults();
    }
  }

  function goResults(family) {
    if (family) setFamily(family);
    if (location.hash) {
      location.hash = ""; // triggers hashchange -> route -> showResults
    } else {
      showResults();
    }
  }

  // — wiring —

  function init() {
    var prices = data.map(function (p) { return p.price; });
    var maxAll = prices.length ? Math.ceil(Math.max.apply(null, prices) / 100) * 100 : 1000;
    maxPriceEl.min = 0;
    maxPriceEl.max = maxAll;
    maxPriceEl.step = 50;
    maxPriceEl.value = maxAll;
    maxPriceLabel.textContent = fmt(maxAll);

    buildChips();

    searchEl.addEventListener("input", applyFilters);
    maxPriceEl.addEventListener("input", function () {
      maxPriceLabel.textContent = fmt(+maxPriceEl.value);
      applyFilters();
    });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="cond"]'), function (r) {
      r.addEventListener("change", applyFilters);
    });

    chipsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-family]");
      if (!btn) return;
      setFamily(btn.getAttribute("data-family"));
      applyFilters();
    });

    // Delegated clicks for cards (results), detail photos (lightbox), and controls (detail).
    document.addEventListener("click", function (e) {
      var photo = e.target.closest(".detail-media img");
      if (photo) { openLightbox(photo.getAttribute("src"), photo.getAttribute("alt")); return; }

      var card = e.target.closest("[data-open]");
      if (card) { location.hash = encodeURIComponent(card.getAttribute("data-open")); return; }

      var back = e.target.closest("[data-back], [data-crumb-home]");
      if (back) { e.preventDefault(); goResults(); return; }

      var crumbFam = e.target.closest("[data-crumb-family]");
      if (crumbFam) { e.preventDefault(); goResults(crumbFam.getAttribute("data-crumb-family")); return; }
    });

    lightbox.addEventListener("click", function () { closeLightbox(); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });

    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
