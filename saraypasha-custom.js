(function () {
  "use strict";

  var VERSION = "1.1.0";

  if (
    window.__sarayPashaCustom &&
    window.__sarayPashaCustom.version === VERSION
  ) {
    return;
  }

  window.__sarayPashaCustom = {
    version: VERSION
  };

  function addStyles() {
    if (document.getElementById("sp-custom-js-styles")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "sp-custom-js-styles";
    style.textContent = `
      .sp-trc20-copy-label {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        flex-wrap: wrap !important;
      }

      .sp-trc20-copy-button {
        appearance: none;
        border: 1px solid rgba(174, 255, 45, 0.65);
        border-radius: 9px;
        padding: 6px 10px;
        background: rgba(143, 213, 0, 0.14);
        color: #d9ff7a;
        font: inherit;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        white-space: nowrap;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          transform 160ms ease;
      }

      .sp-trc20-copy-button:hover {
        background: rgba(143, 213, 0, 0.24);
        border-color: rgba(174, 255, 45, 0.9);
      }

      .sp-trc20-copy-button:active {
        transform: scale(0.96);
      }

      .sp-copy-toast {
        position: fixed;
        left: 50%;
        bottom: 84px;
        z-index: 2147483647;
        transform: translate(-50%, 12px);
        max-width: calc(100vw - 32px);
        padding: 11px 16px;
        border: 1px solid rgba(174, 255, 45, 0.7);
        border-radius: 12px;
        background: rgba(13, 32, 4, 0.96);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        color: #e8ffb0;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 180ms ease,
          transform 180ms ease;
      }

      .sp-copy-toast.sp-copy-toast-visible {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    `;

    document.head.appendChild(style);
  }

  function showToast(message) {
    var oldToast = document.querySelector(".sp-copy-toast");

    if (oldToast) {
      oldToast.remove();
    }

    var toast = document.createElement("div");
    toast.className = "sp-copy-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("sp-copy-toast-visible");
    });

    window.setTimeout(function () {
      toast.classList.remove("sp-copy-toast-visible");

      window.setTimeout(function () {
        toast.remove();
      }, 200);
    }, 2200);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    var copied = document.execCommand("copy");
    textarea.remove();

    return copied;
  }

  function copyAddress(address) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(address);
    }

    return new Promise(function (resolve, reject) {
      if (fallbackCopy(address)) {
        resolve();
      } else {
        reject(new Error("Kopyalama başarısız"));
      }
    });
  }

  function findAddress(label) {
    var text = (label.textContent || "").replace(/\s+/g, " ").trim();

    var match = text.match(
      /TRC20\s*ADRES[İI]\s*:\s*([A-Za-z0-9]{20,})/i
    );

    return match ? match[1] : "";
  }

  function isDepositPanel(label) {
    var panel = label.closest(
      '[role="alertdialog"], [role="dialog"]'
    );

    if (!panel) {
      return true;
    }

    var panelText = (panel.textContent || "").toLocaleLowerCase("tr-TR");

    return (
      panelText.includes("para yatır") &&
      !panelText.includes("para çek")
    );
  }

  function enhanceTrc20Address() {
    var labels = document.querySelectorAll("label");

    labels.forEach(function (label) {
      if (label.dataset.spTrc20CopyReady === "1") {
        return;
      }

      var address = findAddress(label);

      if (!address || !isDepositPanel(label)) {
        return;
      }

      label.dataset.spTrc20CopyReady = "1";
      label.classList.add("sp-trc20-copy-label");

      var button = document.createElement("button");
      button.type = "button";
      button.className = "sp-trc20-copy-button";
      button.textContent = "KOPYALA";
      button.setAttribute(
        "aria-label",
        "TRC20 adresini kopyala"
      );

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        copyAddress(address)
          .then(function () {
            button.textContent = "KOPYALANDI";
            showToast("TRC20 adresi kopyalandı.");

            window.setTimeout(function () {
              button.textContent = "KOPYALA";
            }, 1800);
          })
          .catch(function () {
            showToast(
              "Adres kopyalanamadı. Lütfen tekrar deneyiniz."
            );
          });
      });

      label.appendChild(button);
    });
  }

  function refresh() {
    addStyles();
    enhanceTrc20Address();
  }

  var refreshTimer = 0;

  function scheduleRefresh() {
    window.clearTimeout(refreshTimer);

    refreshTimer = window.setTimeout(refresh, 120);
  }

  var observer = new MutationObserver(scheduleRefresh);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  refresh();

  console.info(
    "SarayPasha özel JavaScript yüklendi:",
    VERSION
  );
})();
