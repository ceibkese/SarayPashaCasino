(function () {
  "use strict";

  var VERSION = "1.6.0";
  var STYLE_ID = "sp-custom-js-styles";

  if (window.__sarayPashaCustom && window.__sarayPashaCustom.version === VERSION) return;
  window.__sarayPashaCustom = { version: VERSION };

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .sp-trc20-heading,.sp-txid-heading{display:block!important;color:rgba(242,247,222,.9)!important;font-family:inherit!important;font-weight:800!important;line-height:1.3!important}
      .sp-trc20-heading{margin:0 0 7px!important;font-size:11px!important;letter-spacing:.45px!important;text-transform:uppercase!important}
      .sp-txid-heading{margin:2px 0 7px!important;font-size:12px!important}
      .sp-trc20-address-row{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:5px!important;width:100%!important;box-sizing:border-box!important;margin:0 0 10px!important;overflow:hidden!important}
      .sp-trc20-address-row>label{display:inline-flex!important;align-items:center!important;flex:0 1 auto!important;min-width:0!important;width:auto!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;color:rgba(239,245,216,.9)!important;font-family:inherit!important;font-size:12px!important;font-weight:600!important;line-height:1.45!important;white-space:nowrap!important;user-select:text!important}
      .sp-trc20-prefix{flex:0 0 auto!important;margin-right:4px!important;font-weight:800!important}
      .sp-trc20-address-value{flex:0 1 auto!important;min-width:0!important;font-size:10px!important;font-weight:600!important;letter-spacing:-.12px!important;white-space:nowrap!important;user-select:text!important}
      .sp-trc20-copy-button{flex:0 0 auto!important;appearance:none!important;min-width:58px!important;padding:7px 9px!important;border:1px solid rgba(174,255,45,.72)!important;border-radius:9px!important;background:rgba(143,213,0,.16)!important;color:#dfff86!important;font-family:inherit!important;font-size:10px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important}
      .sp-trc20-copy-button:hover{background:rgba(143,213,0,.27)!important;border-color:rgba(174,255,45,.95)!important}.sp-trc20-copy-button:active{transform:scale(.96)!important}
      input.sp-trc20-txid-input::placeholder{color:rgba(224,232,194,.48)!important;opacity:1!important;font-size:13px!important}
      input.sp-trc20-txid-input.sp-txid-invalid{border-color:#ff6b6b!important;box-shadow:0 0 0 3px rgba(255,74,74,.14)!important}
      .sp-copy-toast{position:fixed!important;left:50%!important;bottom:84px!important;z-index:2147483647!important;transform:translate(-50%,12px)!important;max-width:calc(100vw - 32px)!important;padding:11px 16px!important;border:1px solid rgba(174,255,45,.7)!important;border-radius:12px!important;background:rgba(13,32,4,.96)!important;box-shadow:0 10px 30px rgba(0,0,0,.35)!important;color:#e8ffb0!important;font-family:inherit!important;font-size:13px!important;font-weight:700!important;text-align:center!important;opacity:0!important;pointer-events:none!important;transition:opacity .18s ease,transform .18s ease!important}.sp-copy-toast.sp-copy-toast-visible{opacity:1!important;transform:translate(-50%,0)!important}
      @media(max-width:768px){
        .sp-trc20-address-row{gap:4px!important}
        .sp-trc20-address-row>label{font-size:9px!important}
        .sp-trc20-prefix{margin-right:2px!important}
        .sp-trc20-address-value{font-size:8.3px!important;letter-spacing:-.28px!important}
        .sp-trc20-copy-button{min-width:52px!important;padding:6px 7px!important;font-size:9px!important}
        input.sp-trc20-txid-input::placeholder{font-size:12px!important}
        body.sp-trc20-input-focused{background:#1a1f04!important}
        body.sp-trc20-input-focused .sp-trc20-modal-overlay{background:#1a1f04!important;background-image:linear-gradient(180deg,#1a2607 0%,#121d03 100%)!important;min-height:100dvh!important}
        body.sp-trc20-input-focused .sp-trc20-modal-surface{background:#1a1f04!important;min-height:100%!important}
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message) {
    var old = document.querySelector(".sp-copy-toast"); if (old) old.remove();
    var toast = document.createElement("div"); toast.className = "sp-copy-toast"; toast.textContent = message; document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("sp-copy-toast-visible"); });
    setTimeout(function () { toast.classList.remove("sp-copy-toast-visible"); setTimeout(function () { toast.remove(); }, 200); }, 2200);
  }

  function fallbackCopy(text) {
    var area=document.createElement("textarea"); area.value=text; area.readOnly=true; area.style.cssText="position:fixed;left:-9999px;opacity:0"; document.body.appendChild(area); area.select(); area.setSelectionRange(0,text.length);
    var ok=false; try { ok=document.execCommand("copy"); } catch (_) {} area.remove(); return ok;
  }

  function copyAddress(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { if (!fallbackCopy(text)) throw new Error("copy"); });
    return new Promise(function (resolve,reject) { fallbackCopy(text) ? resolve() : reject(new Error("copy")); });
  }

  function findAddress(label) {
    var text=(label.textContent||"").replace(/\s+/g," ").trim();
    var match=text.match(/TRC20(?:\s*ADRES[İI])?\s*:\s*([A-Za-z0-9]{20,})/i);
    return match ? match[1] : "";
  }

  function findInputGroup(label) {
    var current=label.parentElement;
    while(current && current!==document.body){ if(current.querySelector('input[name="inputs.0.value"]')) return current; current=current.parentElement; }
    return null;
  }

  function findFixedOverlay(element) {
    var current=element.parentElement;
    while(current && current!==document.body){ if(getComputedStyle(current).position==="fixed") return current; current=current.parentElement; }
    return null;
  }

  function bindKeyboard(input, overlay) {
    if(!input || input.dataset.spKeyboardReady==="1") return;
    input.dataset.spKeyboardReady="1";
    var form=input.closest("form");
    input.addEventListener("focus",function(){
      document.body.classList.add("sp-trc20-input-focused");
      if(overlay) overlay.classList.add("sp-trc20-modal-overlay");
      var surface=overlay && overlay.querySelector(".modal"); if(surface) surface.classList.add("sp-trc20-modal-surface");
      setTimeout(function(){ input.scrollIntoView({behavior:"smooth",block:"center"}); },250);
    });
    input.addEventListener("blur",function(){ setTimeout(function(){ if(!form || !document.activeElement || !form.contains(document.activeElement)) document.body.classList.remove("sp-trc20-input-focused"); },180); });
  }

  function enhanceAllDepositAmountInputs() {
    Array.prototype.slice.call(document.querySelectorAll("form")).forEach(function(form){
      if(!/YATIRIM/i.test(form.textContent||"")) return;
      var amount=null;
      Array.prototype.slice.call(form.querySelectorAll("input")).some(function(input){
        if((input.placeholder||"").toLocaleLowerCase("tr-TR").includes("tutarı girin")){ amount=input; return true; }
        return false;
      });
      if(!amount) return;
      form.classList.add("sp-trc20-form-ready");
      bindKeyboard(amount,findFixedOverlay(form));
    });
  }

  function bindValidation(group,input) {
    var form=input && input.closest("form"); if(!form) return;
    input.required=true; input.autocomplete="off";
    function valid(){ return (input.value||"").trim().length>0; }
    function check(event){
      if(valid()){ input.classList.remove("sp-txid-invalid"); input.removeAttribute("aria-invalid"); return true; }
      if(event){ event.preventDefault(); event.stopPropagation(); if(event.stopImmediatePropagation) event.stopImmediatePropagation(); }
      input.classList.add("sp-txid-invalid"); input.setAttribute("aria-invalid","true"); showToast("Lütfen gönderim işleminizin TXID bilgisini giriniz."); input.focus(); return false;
    }
    if(input.dataset.spValidationInputReady!=="1"){ input.dataset.spValidationInputReady="1"; input.addEventListener("input",function(){ if(valid()){ input.classList.remove("sp-txid-invalid"); input.removeAttribute("aria-invalid"); } }); }
    if(form.dataset.spTxidValidationReady==="1") return;
    form.dataset.spTxidValidationReady="1";
    form.addEventListener("submit",check,true);
    form.addEventListener("click",function(e){ var b=e.target.closest('button[type="submit"]'); if(b && form.contains(b)) check(e); },true);
  }

  function enhance() {
    Array.prototype.slice.call(document.querySelectorAll("label")).forEach(function(label){
      var address=findAddress(label); if(!address) return;
      var group=findInputGroup(label); if(!group) return;
      var form=group.closest("form"); if(!form || !/YATIRIM/i.test(form.textContent||"")) return;
      group.classList.add("sp-trc20-form-ready");
      var txid=group.querySelector('input[name="inputs.0.value"]'); if(!txid) return;
      var inputs=form.querySelectorAll("input"); var amount=null; Array.prototype.forEach.call(inputs,function(x){ if(x!==txid && !amount) amount=x; });
      txid.classList.add("sp-trc20-txid-input"); txid.placeholder="Gönderim yaptıktan sonra TXID giriniz."; txid.setAttribute("aria-label",txid.placeholder);
      var txWrap=txid.parentElement; var heading=group.querySelector(".sp-txid-heading");
      if(txWrap && !heading){ heading=document.createElement("div"); heading.className="sp-txid-heading"; heading.textContent="TX ID:"; txWrap.parentNode.insertBefore(heading,txWrap); }
      var row=label.closest(".sp-trc20-address-row");
      if(!row){ row=document.createElement("div"); row.className="sp-trc20-address-row"; label.parentNode.insertBefore(row,label); row.appendChild(label); }
      var addressHeading=row.previousElementSibling;
      if(!addressHeading || !addressHeading.classList.contains("sp-trc20-heading")){ addressHeading=document.createElement("div"); addressHeading.className="sp-trc20-heading"; addressHeading.textContent="Gönderim Yapacağınız Adres"; row.parentNode.insertBefore(addressHeading,row); }
      if(!label.querySelector(".sp-trc20-address-value")){ label.textContent=""; var prefix=document.createElement("span"); prefix.className="sp-trc20-prefix"; prefix.textContent="TRC20:"; var value=document.createElement("span"); value.className="sp-trc20-address-value"; value.textContent=address; label.appendChild(prefix); label.appendChild(value); }
      var button=row.querySelector(".sp-trc20-copy-button");
      if(!button){ button=document.createElement("button"); button.type="button"; button.className="sp-trc20-copy-button"; button.textContent="Kopyala"; button.setAttribute("aria-label","TRC20 adresini kopyala"); row.appendChild(button); }
      button.dataset.address=address;
      if(button.dataset.spCopyReady!=="1"){ button.dataset.spCopyReady="1"; button.addEventListener("click",function(e){ e.preventDefault(); e.stopPropagation(); var b=e.currentTarget; copyAddress(b.dataset.address).then(function(){ b.textContent="Kopyalandı"; showToast("TRC20 adresi kopyalandı."); setTimeout(function(){b.textContent="Kopyala";},1800); }).catch(function(){showToast("Adres kopyalanamadı. Lütfen tekrar deneyiniz.");}); }); }
      var overlay=findFixedOverlay(form); bindKeyboard(txid,overlay); bindKeyboard(amount,overlay); bindValidation(group,txid);
    });
  }

  function refresh(){ enhance(); enhanceAllDepositAmountInputs(); }

  addStyles(); refresh();
  var timer=0; new MutationObserver(function(){ clearTimeout(timer); timer=setTimeout(refresh,100); }).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(refresh,700); setTimeout(refresh,1800);
  console.info("SarayPasha özel JavaScript yüklendi:",VERSION);
})();
