(function () {
  "use strict";

  var VERSION = "1.2.0";

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
      .sp-trc20-address-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        width: 100% !important;
        margin-bottom: 8px !important;
      }

      .sp-trc20-address-row label {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        color: inherit !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }

      .sp-trc20-copy-button {
        flex: 0 0 auto !important;
        appearance: none !important;
        min-width: 72px !important;
        padding: 7px 11px !important;
        border: 1px solid rgba(174, 255, 45, 0.72) !important;
        border-radius: 9px !important;
        background: rgba(143, 213, 0, 0.16) !important;
        color: #dfff86 !important;
        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        text-align: center !important;
        white-space: nowrap !important;
        cursor: pointer !important;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          transform 160ms ease !important;
      }

      .sp-trc20-copy-button:hover {
        background: rgba(143, 213, 0, 0.27) !important;
        border-color: rgba(174, 255, 45, 0.95) !important;
      }

      .sp-trc20-copy-button:active {
        transform: scale(0.96) !important;
      }

      input.sp-trc20-txid-input::placeholder {
        color: rgba(255, 255, 255, 0.48) !important;
        opacity: 1 !important;
        font-size: 13px !important;
      }

      .sp-copy-toast {
        position: fixed !important;
        left: 50% !important;
        bottom: 84px !important;
        z-index: 2147483647 !important;
        transform: translate(-50%, 12px) !important;
        max-width: calc(100vw - 32px) !important;
        padding: 11px 16px !important;
        border: 1px solid rgba(174, 255, 45, 0.7) !important;
        border-radius: 12px !important;
        background: rgba(13, 32, 4, 0.96) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
        color: #e8ffb0 !important;
        font-family: inherit !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        text-align: center !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transition:
          opacity 180ms ease,
          transform 180ms ease !important;
      }

      .sp-copy-toast.sp-copy-toast-visible {
        opacity: 1 !important;
        transform: translate(-50%, 0) !important;
      }

      @media (max-width: 600px) {
        .sp-trc20-address-row {
          align-items: flex-start !important;
          gap: 7px !important;
        }

        .sp-trc20-address-row label {
          font-size: 11px !important;
          line-height: 1.5 !important;
        }

        .sp-trc20-copy-button {
          min-width: 66px !important;
          padding: 7px 8px !important;
          font-size: 10px !important;
        }

        input.sp-trc20-txid-input::placeholder {
          font-size: 12px !important;
        }
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
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    var copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    textarea.remove();
    return copied;
  }

  function copyAddress(address) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard
        .writeText(address)
        .then(function () {
          showToast("TRC20 adresi kopyalandı.");
        })
        .catch(function () {
          if (fallbackCopy(address)) {
            showToast("TRC20 adresi kopyalandı.");
          } else {
            showToast("Adres kopyalanamadı. Basılı tutarak kopyalayabilirsiniz.");
          }
        });

      return;
    }

    if (fallbackCopy(address)) {
      showToast("TRC20 adresi kopyalandı.");
    } else {
      showToast("Adres kopyalanamadı. Basılı tutarak kopyalayabilirsiniz.");
    }
  }

  function isDepositPanel(element) {
    var panel =
      element.closest('[role="alertdialog"]') ||
      element.closest('[role="dialog"]') ||
      element.closest("form") ||
      element.parentElement;

    if (!panel) {
      return false;
    }

    var text = (panel.textContent || "").toLocaleLowerCase("tr-TR");

    return (
      text.includes("para yatır") &&
      !text.includes("para çek")
    );
  }

  function findInputGroup(label) {
    var current = label.parentElement;

    while (current && current !== document.body) {
      if (current.querySelector("input")) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }

  function prepareTrc20Area() {
    var labels = Array.prototype.slice.call(
      document.querySelectorAll("label")
    );

    labels.forEach(function (label) {
      var text = (label.textContent || "").trim();

      var match = text.match(
        /TRC20\s*ADRES[İI]\s*:\s*([A-Za-z0-9]{20,})/i
      );

      if (!match) {
        return;
      }

      if (!isDepositPanel(label)) {
        return;
      }

      var address = match[1];
      var inputGroup = findInputGroup(label);

      if (!inputGroup) {
        return;
      }

      var txidInput = inputGroup.querySelector("input");

      if (txidInput) {
        txidInput.classList.add("sp-trc20-txid-input");
        txidInput.setAttribute(
          "placeholder",
          "Gönderim yaptıktan sonra TXID giriniz."
        );
        txidInput.setAttribute(
          "aria-label",
          "Gönderim yaptıktan sonra TXID giriniz."
        );
      }

      var row = label.closest(".sp-trc20-address-row");

      if (!row) {
        row = document.createElement("div");
        row.className = "sp-trc20-address-row";

        label.parentNode.insertBefore(row, label);
        row.appendChild(label);
      }

      var existingButton = row.querySelector(
        ".sp-trc20-copy-button"
      );

      if (existingButton) {
        existingButton.dataset.address = address;
        return;
      }

      var button = document.createElement("button");
      button.type = "button";
      button.className = "sp-trc20-copy-button";
      button.textContent = "Kopyala";
      button.dataset.address = address;
      button.setAttribute("aria-label", "TRC20 adresini kopyala");

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        copyAddress(button.dataset.address);
      });

      row.appendChild(button);
    });
  }

  function applyChanges() {
    addStyles();
    prepareTrc20Area();
  }

  var scanScheduled = false;

  function scheduleScan() {
    if (scanScheduled) {
      return;
    }

    scanScheduled = true;

    requestAnimationFrame(function () {
      scanScheduled = false;
      applyChanges();
    });
  }

  applyChanges();

  var observer = new MutationObserver(function () {
    scheduleScan();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  /*
   * Sayfa içi geçişlerde ödeme alanı geç oluşabildiği için
   * ilk 30 saniye boyunca ek güvenlik kontrolü yapılır.
   */
  var scanCount = 0;

  var scanTimer = window.setInterval(function () {
    applyChanges();
    scanCount += 1;

    if (scanCount >= 30) {
      window.clearInterval(scanTimer);
    }
  }, 1000);

  console.info(
    "SarayPasha özel JavaScript yüklendi: " + VERSION
  );
})();
