(function () {
  "use strict";

  var VERSION = "1.4.0";

  if (window.__sarayPashaCustom && window.__sarayPashaCustom.version === VERSION) {
    return;
  }

  window.__sarayPashaCustom = { version: VERSION };

  function addStyles() {
    var oldStyle = document.getElementById("sp-custom-js-styles");
    if (oldStyle) oldStyle.remove();

    var style = document.createElement("style");
    style.id = "sp-custom-js-styles";
    style.textContent = `
      .sp-trc20-heading {
        display: block !important;
        margin: 0 0 7px !important;
        color: rgba(242, 247, 222, .88) !important;
        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.3 !important;
        letter-spacing: .45px !important;
        text-transform: uppercase !important;
      }

      .sp-trc20-address-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 0 10px !important;
      }

      .sp-trc20-address-row > label {
        display: flex !important;
        align-items: center !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: rgba(239, 245, 216, .88) !important;
        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        line-height: 1.45 !important;
        white-space: nowrap !important;
        user-select: text !important;
      }

      .sp-trc20-prefix {
        flex: 0 0 auto !important;
        margin-right: 4px !important;
        font-weight: 800 !important;
      }

      .sp-trc20-address-value {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        letter-spacing: -.12px !important;
        white-space: nowrap !important;
        user-select: text !important;
      }

      .sp-txid-heading {
        display: block !important;
        margin: 2px 0 7px !important;
        color: rgba(242, 247, 222, .88) !important;
        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 1.3 !important;
      }

      .sp-trc20-copy-button {
        flex: 0 0 auto !important;
        appearance: none !important;
        min-width: 72px !important;
        padding: 7px 11px !important;
        border: 1px solid rgba(174, 255, 45, .72) !important;
        border-radius: 9px !important;
        background: rgba(143, 213, 0, .16) !important;
        color: #dfff86 !important;
        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        cursor: pointer !important;
      }

      .sp-trc20-copy-button:hover {
        background: rgba(143, 213, 0, .27) !important;
        border-color: rgba(174, 255, 45, .95) !important;
      }

      .sp-trc20-copy-button:active {
        transform: scale(.96) !important;
      }

      input.sp-trc20-txid-input::placeholder {
        color: rgba(224, 232, 194, .48) !important;
        opacity: 1 !important;
        font-size: 13px !important;
      }

      input.sp-trc20-txid-input.sp-txid-invalid {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 3px rgba(255, 74, 74, .14) !important;
      }

      .sp-copy-toast {
        position: fixed !important;
        left: 50% !important;
        bottom: 84px !important;
        z-index: 2147483647 !important;
        transform: translate(-50%, 12px) !important;
        max-width: calc(100vw - 32px) !important;
        padding: 11px 16px !important;
        border: 1px solid rgba(174, 255, 45, .7) !important;
        border-radius: 12px !important;
        background: rgba(13, 32, 4, .96) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, .35) !important;
        color: #e8ffb0 !important;
        font-family: inherit !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        text-align: center !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity .18s ease, transform .18s ease !important;
      }

      .sp-copy-toast.sp-copy-toast-visible {
        opacity: 1 !important;
        transform: translate(-50%, 0) !important;
      }

      @media (max-width: 768px) {
        .sp-trc20-address-row {
          gap: 8px !important;
        }

        .sp-trc20-address-row > label {
          font-size: 10px !important;
        }

        .sp-trc20-address-value {
          font-size: 9px !important;
          letter-spacing: -.2px !important;
        }

        .sp-trc20-copy-button {
          min-width: 66px !important;
          padding: 7px 9px !important;
          font-size: 10px !important;
        }

        input.sp-trc20-txid-input::placeholder {
          font-size: 12px !important;
        }

        .sp-trc20-keyboard-mode {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483001 !important;
          min-height: 100dvh !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          box-sizing: border-box !important;
          overflow-y: auto !important;
          overscroll-behavior: contain !important;
          background: #142403 !important;
          background-image: linear-gradient(180deg, #182b05 0%, #101d02 100%) !important;
          padding-bottom: max(30px, env(safe-area-inset-bottom)) !important;
        }

        .sp-keyboard-screen-cover {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483000 !important;
          background: #142403 !important;
          background-image: linear-gradient(180deg, #182b05 0%, #101d02 100%) !important;
          pointer-events: none !important;
        }

        body.sp-trc20-input-focused {
          overflow: hidden !important;
          background: #142403 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function showToast(message) {
    var oldToast = document.querySelector(".sp-copy-toast");
    if (oldToast) oldToast.remove();

    var toast = document.createElement("div");
    toast.className = "sp-copy-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("sp-copy-toast-visible");
    });

    window.setTimeout(function () {
      toast.classList.remove("sp-copy-toast-visible");
      window.setTimeout(function () { toast.remove(); }, 200);
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
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    var copied = false;
    try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
    textarea.remove();
    return copied;
  }

  function copyAddress(address) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(address).catch(function () {
        if (!fallbackCopy(address)) throw new Error("Kopyalama başarısız");
      });
    }

    return new Promise(function (resolve, reject) {
      fallbackCopy(address) ? resolve() : reject(new Error("Kopyalama başarısız"));
    });
  }

  function findAddress(label) {
    var text = (label.textContent || "").replace(/\s+/g, " ").trim();
    var match = text.match(/TRC20(?:\s*ADRES[İI])?\s*:\s*([A-Za-z0-9]{20,})/i);
    return match ? match[1] : "";
  }

  function getDialog(element) {
    return element.closest('[role="alertdialog"], [role="dialog"]');
  }

  function isDepositPanel(label) {
    var panel = getDialog(label);
    if (!panel) return true;

    var text = (panel.textContent || "").toLocaleLowerCase("tr-TR");
    return text.includes("para yatır") && !text.includes("para çek");
  }

  function findInputGroup(label) {
    var current = label.parentElement;
    while (current && current !== document.body) {
      if (current.querySelector('input[name="inputs.0.value"]')) return current;
      current = current.parentElement;
    }
    return null;
  }

  function bindKeyboardFix(input, dialog) {
    if (!input || input.dataset.spKeyboardReady === "1") return;
    input.dataset.spKeyboardReady = "1";

    input.addEventListener("focus", function () {
      document.body.classList.add("sp-trc20-input-focused");
      var keyboardPanel = dialog || input.closest("form");
      if (keyboardPanel) keyboardPanel.classList.add("sp-trc20-keyboard-mode");

      if (!document.querySelector(".sp-keyboard-screen-cover")) {
        var cover = document.createElement("div");
        cover.className = "sp-keyboard-screen-cover";
        cover.setAttribute("aria-hidden", "true");
        document.body.appendChild(cover);
      }

      window.setTimeout(function () {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 280);
    });

    input.addEventListener("blur", function () {
      window.setTimeout(function () {
        if (!document.activeElement || !document.activeElement.closest(".sp-trc20-form-ready")) {
          document.body.classList.remove("sp-trc20-input-focused");
          var keyboardPanel = dialog || input.closest("form");
          if (keyboardPanel) keyboardPanel.classList.remove("sp-trc20-keyboard-mode");
          var cover = document.querySelector(".sp-keyboard-screen-cover");
          if (cover) cover.remove();
        }
      }, 180);
    });
  }

  function bindTxidValidation(inputGroup, txidInput) {
    if (!inputGroup || !txidInput) return;

    var form = txidInput.closest("form");
    if (!form) return;

    txidInput.required = true;
    txidInput.setAttribute("autocomplete", "off");

    function txidIsValid() {
      return (txidInput.value || "").trim().length > 0;
    }

    function showTxidWarning(event) {
      if (txidIsValid()) {
        txidInput.classList.remove("sp-txid-invalid");
        txidInput.removeAttribute("aria-invalid");
        return true;
      }

      if (event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
      }

      txidInput.classList.add("sp-txid-invalid");
      txidInput.setAttribute("aria-invalid", "true");
      showToast("Lütfen gönderim işleminizin TXID bilgisini giriniz.");
      txidInput.focus();

      window.setTimeout(function () {
        txidInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 160);

      return false;
    }

    if (txidInput.dataset.spValidationInputReady !== "1") {
      txidInput.dataset.spValidationInputReady = "1";
      txidInput.addEventListener("input", function () {
        if (txidIsValid()) {
          txidInput.classList.remove("sp-txid-invalid");
          txidInput.removeAttribute("aria-invalid");
        }
      });
    }

    if (form.dataset.spTxidValidationReady === "1") return;
    form.dataset.spTxidValidationReady = "1";

    form.addEventListener("submit", function (event) {
      showTxidWarning(event);
    }, true);

    form.addEventListener("click", function (event) {
      var button = event.target.closest('button[type="submit"]');
      if (button && form.contains(button)) {
        showTxidWarning(event);
      }
    }, true);
  }

  function enhanceTrc20Address() {
    Array.prototype.slice.call(document.querySelectorAll("label")).forEach(function (label) {
      var address = findAddress(label);
      if (!address || !isDepositPanel(label)) return;

      var inputGroup = findInputGroup(label);
      if (!inputGroup) return;

      inputGroup.classList.add("sp-trc20-form-ready");
      var dialog = getDialog(label);
      var txidInput = inputGroup.querySelector('input[name="inputs.0.value"]');
      var amountInput = inputGroup.querySelector('input[placeholder="Tutarı Girin"]');

      if (txidInput) {
        txidInput.classList.add("sp-trc20-txid-input");
        txidInput.setAttribute("placeholder", "Gönderim yaptıktan sonra TXID giriniz.");
        txidInput.setAttribute("aria-label", "Gönderim yaptıktan sonra TXID giriniz.");

        var txidWrapper = txidInput.parentElement;
        if (txidWrapper) {
          var txidHeading = inputGroup.querySelector(".sp-txid-heading");
          if (!txidHeading) {
            txidHeading = document.createElement("div");
            txidHeading.className = "sp-txid-heading";
            txidHeading.textContent = "TX ID:";
            txidWrapper.parentNode.insertBefore(txidHeading, txidWrapper);
          }
        }
      }

      bindKeyboardFix(txidInput, dialog);
      bindKeyboardFix(amountInput, dialog);
      bindTxidValidation(inputGroup, txidInput);

      var oldButton = label.querySelector(".sp-trc20-copy-button");
      if (oldButton) oldButton.remove();

      var row = label.closest(".sp-trc20-address-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "sp-trc20-address-row";
        label.parentNode.insertBefore(row, label);
        row.appendChild(label);
      }

      var heading = row.previousElementSibling;
      if (!heading || !heading.classList.contains("sp-trc20-heading")) {
        heading = document.createElement("div");
        heading.className = "sp-trc20-heading";
        heading.textContent = "Gönderim Yapacağınız Adres";
        row.parentNode.insertBefore(heading, row);
      }

      var addressValue = label.querySelector(".sp-trc20-address-value");
      if (!addressValue) {
        label.textContent = "";

        var prefix = document.createElement("span");
        prefix.className = "sp-trc20-prefix";
        prefix.textContent = "TRC20:";

        addressValue = document.createElement("span");
        addressValue.className = "sp-trc20-address-value";
        addressValue.textContent = address;

        label.appendChild(prefix);
        label.appendChild(addressValue);
      } else if (addressValue.textContent !== address) {
        addressValue.textContent = address;
      }

      var button = row.querySelector(".sp-trc20-copy-button");
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = "sp-trc20-copy-button";
        button.textContent = "Kopyala";
        button.setAttribute("aria-label", "TRC20 adresini kopyala");
        row.appendChild(button);
      }

      button.dataset.address = address;
      if (button.dataset.spCopyReady !== "1") {
        button.dataset.spCopyReady = "1";
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          var currentButton = event.currentTarget;

          copyAddress(currentButton.dataset.address).then(function () {
            currentButton.textContent = "Kopyalandı";
            showToast("TRC20 adresi kopyalandı.");
            window.setTimeout(function () { currentButton.textContent = "Kopyala"; }, 1800);
          }).catch(function () {
            showToast("Adres kopyalanamadı. Lütfen tekrar deneyiniz.");
          });
        });
      }
    });
  }

  function refresh() {
    addStyles();
    enhanceTrc20Address();
  }

  var refreshTimer = 0;
  function scheduleRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(refresh, 100);
  }

  new MutationObserver(scheduleRefresh).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  refresh();
  window.setTimeout(refresh, 700);
  window.setTimeout(refresh, 1800);

  console.info("SarayPasha özel JavaScript yüklendi:", VERSION);
})();
