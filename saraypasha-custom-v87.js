(function () {
  "use strict";

  var VERSION = "1.56.4";
  var BANK_TRANSFER_ENDPOINT = "https://saraypasha.com/api/bank-transfer-config.php";
  var STYLE_ID = "sp-custom-js-styles";
  var GLOBAL_KEY = "__sarayPashaCustom";
  var previousRuntime = window[GLOBAL_KEY];

  if (previousRuntime && previousRuntime.version === VERSION) {
    if (typeof previousRuntime.refresh === "function") previousRuntime.refresh();
    return;
  }
  if (previousRuntime && typeof previousRuntime.destroy === "function") previousRuntime.destroy();
  var cleanupFns=[];
  try{
    var initialRouteParams=new URLSearchParams(window.location.search||"");
    if(String(initialRouteParams.get("t")||"").toLowerCase()==="withdrawal"){
      document.documentElement.classList.add("sp-withdrawal-preparing");
    }
  }catch(_){}

  function listenGlobal(target,type,handler,options){
    target.addEventListener(type,handler,options);
    cleanupFns.push(function(){target.removeEventListener(type,handler,options);});
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html body form.sp-bank-transfer-form.sp-bank-transfer-form::before{content:none!important;display:none!important}
      form.sp-bank-transfer-form .app-ltr-19sk4h4:has(input.sp-bank-hidden-field){display:none!important}
      form.sp-bank-transfer-form div:has(>div>input.sp-bank-hidden-field){display:none!important}
      form.sp-bank-transfer-form .sp-bank-native-title{display:none!important}
      .sp-trc20-heading,.sp-txid-heading{display:block!important;color:rgba(242,247,222,.9)!important;font-family:inherit!important;font-weight:800!important;line-height:1.3!important}
      .sp-trc20-heading{margin:0 0 7px!important;font-size:11px!important;letter-spacing:.45px!important;text-transform:uppercase!important}
      .sp-txid-heading{margin:2px 0 7px!important;font-size:12px!important}
      .sp-trc20-address-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:stretch!important;gap:8px!important;width:100%!important;box-sizing:border-box!important;margin:0 0 12px!important;overflow:visible!important}
      .sp-trc20-address-row>label{display:flex!important;align-items:center!important;min-width:0!important;width:100%!important;min-height:44px!important;margin:0!important;padding:9px 11px!important;box-sizing:border-box!important;border:1px solid rgba(174,255,45,.25)!important;border-radius:10px!important;background:rgba(5,19,2,.66)!important;box-shadow:inset 0 1px rgba(255,255,255,.025)!important;color:rgba(239,245,216,.94)!important;font-family:inherit!important;font-weight:600!important;line-height:1.35!important;user-select:text!important}
      .sp-trc20-prefix{flex:0 0 auto!important;margin-right:7px!important;color:#dfff86!important;font-size:10px!important;font-weight:900!important;letter-spacing:.2px!important}
      .sp-trc20-address-value{display:block!important;flex:1 1 auto!important;min-width:0!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;font-size:10.5px!important;font-weight:650!important;line-height:1.35!important;letter-spacing:0!important;overflow-wrap:anywhere!important;word-break:break-all!important;white-space:normal!important;user-select:text!important}
      .sp-trc20-copy-button{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;appearance:none!important;min-width:72px!important;min-height:44px!important;padding:8px 11px!important;border:1px solid rgba(174,255,45,.72)!important;border-radius:10px!important;background:rgba(143,213,0,.16)!important;color:#dfff86!important;font-family:inherit!important;font-size:10px!important;font-weight:850!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important}
      .sp-trc20-copy-button:hover{background:rgba(143,213,0,.27)!important;border-color:rgba(174,255,45,.95)!important}.sp-trc20-copy-button:active{transform:scale(.96)!important}
      input.sp-trc20-txid-input::placeholder{color:rgba(224,232,194,.48)!important;opacity:1!important;font-size:13px!important}
      input.sp-trc20-txid-input.sp-txid-invalid{border-color:#ff6b6b!important;box-shadow:0 0 0 3px rgba(255,74,74,.14)!important}
      .sp-copy-toast{position:fixed!important;left:50%!important;bottom:84px!important;z-index:2147483647!important;transform:translate(-50%,12px)!important;max-width:calc(100vw - 32px)!important;padding:11px 16px!important;border:1px solid rgba(174,255,45,.7)!important;border-radius:12px!important;background:rgba(13,32,4,.96)!important;box-shadow:0 10px 30px rgba(0,0,0,.35)!important;color:#e8ffb0!important;font-family:inherit!important;font-size:13px!important;font-weight:700!important;text-align:center!important;opacity:0!important;pointer-events:none!important;transition:opacity .18s ease,transform .18s ease!important}.sp-copy-toast.sp-copy-toast-visible{opacity:1!important;transform:translate(-50%,0)!important}
      .sp-keyboard-page-shield{position:fixed!important;inset:0!important;width:100vw!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;background:#1a1f04!important;background-image:linear-gradient(180deg,#1a2607 0%,#121d03 100%)!important;pointer-events:none!important}
      @media(max-width:768px){
        html.sp-deposit-scroll-locked,
        body.sp-deposit-scroll-locked{overflow:hidden!important;overscroll-behavior:none!important}
        body.sp-deposit-scroll-locked{
          position:fixed!important;
          left:0!important;
          right:0!important;
          top:var(--sp-page-lock-top,0px)!important;
          width:100%!important;
          height:100%!important
        }
        .sp-trc20-address-row{grid-template-columns:minmax(0,1fr) 72px!important;gap:7px!important}
        .sp-trc20-address-row>label{min-height:46px!important;padding:8px 10px!important}
        .sp-trc20-prefix{margin-right:6px!important;font-size:9.5px!important}
        .sp-trc20-address-value{font-size:9.8px!important}
        .sp-trc20-copy-button{min-width:72px!important;min-height:46px!important;padding:7px 9px!important;font-size:9.5px!important}
        input.sp-trc20-txid-input::placeholder{font-size:12px!important}
        body.sp-trc20-input-focused{background:#1a1f04!important}
        body.sp-trc20-input-focused .sp-trc20-modal-overlay{
          position:fixed!important;
          inset:0!important;
          width:100vw!important;
          height:var(--sp-deposit-cover-height,100vh)!important;
          min-height:var(--sp-deposit-cover-height,100vh)!important;
          max-height:none!important;
          overflow:hidden!important;
          background:#1a1f04!important;
          background-image:linear-gradient(180deg,#1a2607 0%,#121d03 100%)!important
        }
        body.sp-trc20-input-focused .sp-trc20-modal-surface{
          min-height:var(--sp-deposit-cover-height,100vh)!important;
          max-height:none!important;
          background:#1a1f04!important
        }
      }
      .sp-bonus-embed-pane{display:flex!important;flex-direction:column!important;width:100%!important;max-width:100%!important;min-width:0!important;min-height:0!important;overflow:hidden!important}
      .sp-bonus-embed-content{display:flex!important;flex:1 1 auto!important;width:100%!important;max-width:100%!important;min-width:0!important;min-height:0!important;padding:0!important;overflow:hidden!important;background:#101d08!important}
      .sp-bonus-embed-frame{display:block!important;width:100%!important;height:100%!important;min-height:560px!important;border:0!important;background:#101d08!important}
      @media(max-width:768px){.sp-bonus-embed-pane,.sp-bonus-embed-content{width:100vw!important;max-width:100vw!important}.sp-bonus-embed-frame{width:100vw!important;max-width:100vw!important;min-height:calc(100dvh - 58px)!important}}
      .sp-quick-actions{position:fixed!important;left:auto!important;right:18px!important;bottom:86px!important;z-index:2147483000!important;display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:10px!important;font-family:inherit!important;pointer-events:none!important}
      .sp-quick-actions-menu{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:9px!important;opacity:0!important;transform:translateY(12px) scale(.96)!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .2s ease,transform .2s ease,visibility .2s!important}
      .sp-quick-actions.sp-quick-actions-open .sp-quick-actions-menu{opacity:1!important;transform:translateY(0) scale(1)!important;visibility:visible!important;pointer-events:auto!important}
      .sp-quick-action{display:flex!important;align-items:center!important;gap:9px!important;min-height:42px!important;padding:8px 14px 8px 10px!important;border:1px solid rgba(208,174,67,.72)!important;border-radius:22px!important;background:linear-gradient(135deg,rgba(41,65,9,.98),rgba(18,35,5,.98))!important;box-shadow:0 8px 24px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.08)!important;color:#fff8d5!important;font-family:inherit!important;font-size:13px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;pointer-events:auto!important}
      .sp-quick-action-icon{display:grid!important;place-items:center!important;width:27px!important;height:27px!important;border-radius:50%!important;background:linear-gradient(145deg,#e8ce72,#9d7218)!important;color:#172803!important;font-size:15px!important;font-weight:900!important;box-shadow:inset 0 1px rgba(255,255,255,.5)!important}
      .sp-quick-action-main{display:grid!important;place-items:center!important;width:62px!important;height:62px!important;padding:8px!important;overflow:hidden!important;border:1px solid rgba(222,195,105,.92)!important;border-radius:50%!important;background:linear-gradient(145deg,#626b34 0%,#4d5926 47%,#313e13 100%)!important;box-shadow:0 10px 27px rgba(0,0,0,.42),0 0 0 4px rgba(126,177,24,.15),inset 0 1px 4px rgba(255,255,255,.22)!important;cursor:pointer!important;pointer-events:auto!important;transition:transform .2s ease,filter .2s ease!important}
      .sp-quick-action-main img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;pointer-events:none!important;filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))!important}
      .sp-quick-actions.sp-quick-actions-open .sp-quick-action-main{transform:rotate(12deg) scale(1.04)!important;filter:brightness(1.08)!important}
      @media(max-width:768px){.sp-quick-actions{left:auto!important;right:13px!important;bottom:82px!important}.sp-quick-action-main{width:58px!important;height:58px!important;padding:8px!important}.sp-quick-action{min-height:40px!important;font-size:12px!important}}
      .sp-provider-shortcuts{display:none}
      @media(max-width:768px){
        .sp-provider-shortcuts{display:grid!important;grid-template-columns:1fr!important;gap:8px!important;width:calc(100% - 48px)!important;margin:44px auto 20px!important;font-family:inherit!important}
        .sp-provider-shortcut{position:relative!important;display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:58px!important;padding:0 20px 0 25px!important;overflow:hidden!important;border:0!important;border-radius:0!important;clip-path:polygon(13px 0,100% 0,100% 100%,13px 100%,0 50%)!important;box-sizing:border-box!important;box-shadow:0 7px 18px rgba(0,0,0,.28)!important;color:#fff!important;text-decoration:none!important;transform:translateZ(0)!important}
        .sp-provider-shortcut:before{content:"";position:absolute!important;inset:0!important;background:linear-gradient(100deg,rgba(255,255,255,.13),transparent 43%,rgba(0,0,0,.25))!important;pointer-events:none!important}
        .sp-provider-shortcut-name{position:relative!important;z-index:1!important;font-size:19px!important;font-weight:950!important;line-height:1!important;letter-spacing:-.55px!important;text-transform:uppercase!important;text-shadow:0 2px 5px rgba(0,0,0,.3)!important}
        .sp-provider-shortcut-action{position:relative!important;z-index:1!important;display:flex!important;align-items:center!important;gap:7px!important;font-size:13px!important;font-weight:750!important;white-space:nowrap!important}
        .sp-provider-shortcut-arrow{color:#3dff18!important;font-size:27px!important;font-weight:950!important;line-height:1!important}
        .sp-provider-pragmatic{background:linear-gradient(100deg,#eda900 0%,#a46d00 42%,#263702 100%)!important}
        .sp-provider-egt{background:linear-gradient(100deg,#2b7500 0%,#205900 44%,#122b02 100%)!important}
        .sp-provider-amusnet{background:linear-gradient(100deg,#a000d8 0%,#70009a 43%,#32123d 100%)!important}
        .sp-provider-shortcuts{width:calc(100% - 24px)!important;margin:12px auto 18px!important;gap:7px!important}
        .sp-provider-shortcut{display:block!important;position:relative!important;min-height:0!important;height:clamp(50px,10.2vw,58px)!important;padding:0!important;overflow:hidden!important;border:1px solid rgba(221,205,125,.13)!important;border-radius:7px!important;background:none!important;clip-path:polygon(10px 0,100% 0,100% 100%,10px 100%,0 calc(100% - 10px),0 10px)!important;box-shadow:0 7px 18px rgba(0,0,0,.24),inset 0 1px rgba(255,255,255,.08)!important}
        .sp-provider-shortcut:before{content:""!important;display:block!important;position:absolute!important;z-index:1!important;inset:0!important;background:linear-gradient(90deg,rgba(255,255,255,.05),transparent 42%,rgba(5,15,0,.2))!important;pointer-events:none!important}
        .sp-provider-shortcut img{display:block!important;width:100%!important;height:100%!important;margin:0!important;object-fit:cover!important;object-position:center center!important}
        .sp-banner-dots{display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;width:100%!important;height:18px!important;margin:-40px 0 0!important;padding:0!important}
        .sp-banner-dot{display:block!important;width:7px!important;height:7px!important;margin:0!important;padding:0!important;border:0!important;border-radius:50%!important;background:#354412!important;box-shadow:inset 0 1px rgba(255,255,255,.035)!important;transition:width .18s ease,height .18s ease,background .18s ease!important}
        .sp-banner-dot.sp-banner-dot-active{width:11px!important;height:11px!important;background:#e1c363!important;transform:none!important;box-shadow:0 0 6px rgba(225,195,99,.24),inset 0 1px rgba(255,255,255,.3)!important}
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

  var bankAccountCache={value:null,expiresAt:0,promise:null};

  function loadBankAccount(){
    var now=Date.now();
    if(bankAccountCache.value&&bankAccountCache.expiresAt>now){
      return Promise.resolve(bankAccountCache.value);
    }
    if(bankAccountCache.promise) return bankAccountCache.promise;
    bankAccountCache.promise=fetch(BANK_TRANSFER_ENDPOINT,{method:"GET",mode:"cors",cache:"no-store",credentials:"omit"})
      .then(function(response){if(!response.ok) throw new Error("bank-config-"+response.status);return response.json();})
      .then(function(data){
        var result={
          active:Boolean(data&&data.active),
          account_name:String(data&&data.account_name||"").trim(),
          iban:String(data&&data.iban||"").replace(/\s+/g,"").toUpperCase()
        };
        if(result.active&&(!result.account_name||!/^TR\d{24}$/.test(result.iban))) throw new Error("bank-config-invalid");
        bankAccountCache.value=result;
        bankAccountCache.expiresAt=Date.now()+15000;
        return result;
      })
      .finally(function(){bankAccountCache.promise=null;});
    return bankAccountCache.promise;
  }

  function setNativeInputValue(input,value){
    if(!input) return;
    var descriptor=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value");
    if(descriptor&&descriptor.set) descriptor.set.call(input,value); else input.value=value;
    input.dispatchEvent(new Event("input",{bubbles:true}));
    input.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function formatIban(iban){return String(iban||"").replace(/(.{4})/g,"$1 ").trim();}

  var activeBankForm=null;
  var activeBankPanel=null;
  var bankPositionEventsBound=false;
  var nonBankMethodSwitchUntil=0;
  var paymentSwitchGeneration=0;

  function getBankPortal(){
    var panel=document.getElementById("sp-bank-account-portal");
    if(!panel){
      panel=document.createElement("section");
      panel.id="sp-bank-account-portal";
      panel.className="sp-bank-account-panel";
      document.body.appendChild(panel);
    }
    return panel;
  }

  function placeBankPortal(form,panel){
    if(!form||!panel||!document.contains(form)) return;
    activeBankForm=form;
    activeBankPanel=panel;
    panel.classList.add("sp-bank-inline-panel");
    if(panel.parentElement!==form) form.insertBefore(panel,form.firstChild);
    form.style.setProperty("--sp-bank-panel-space","0px");
    panel.style.removeProperty("left");
    panel.style.removeProperty("top");
    panel.style.removeProperty("width");
  }

  function isPaymentLogoSelected(logo){
    if(!logo||!logo.parentElement) return false;
    var style=getComputedStyle(logo.parentElement);
    var border=String(style.borderColor||"").replace(/\s+/g,"").toLowerCase();
    return border!=="transparent"&&border!=="rgba(0,0,0,0)";
  }

  function getSelectedPaymentIds(){
    return Array.prototype.slice.call(document.querySelectorAll('img[alt="payment-logo"]')).filter(isPaymentLogoSelected).map(function(logo){
      return (String(logo.getAttribute("src")||logo.src||"").match(/\/payments\/(\d+)/)||[])[1]||"";
    }).filter(Boolean);
  }

  function isBankTransferSelected(){
    var selected=getSelectedPaymentIds();
    /* React gecisinde eski ve yeni kart kisa sure birlikte secili olabilir.
       Bu aralikta Bank Transfer formu kesinlikle uygulanmamalidir. */
    return selected.length===1&&selected[0]==="275";
  }

  function isBankTransferDepositRoute(){
    try{
      var params=new URLSearchParams(window.location.search||"");
      return String(params.get("m")||"").toLowerCase()==="account"&&
        String(params.get("t")||"").toLowerCase()==="deposit";
    }catch(_){
      return false;
    }
  }

  function isBankTransferWithdrawalRoute(){
    try{
      var params=new URLSearchParams(window.location.search||"");
      return String(params.get("m")||"").toLowerCase()==="account"&&
        String(params.get("t")||"").toLowerCase()==="withdrawal";
    }catch(_){
      return false;
    }
  }

  function formatBankLimit(value){
    var digits=String(value||"").replace(/[^0-9]/g,"");
    var number=parseInt(digits,10);
    if(!Number.isFinite(number)) return "";
    return number.toLocaleString("tr-TR")+" TRY";
  }

  function readBankTransferLimits(){
    var result={minimum:"",maximum:""};
    var logo=document.querySelector('img[alt="payment-logo"][src*="/payments/275"]');
    var card=logo&&logo.parentElement&&logo.parentElement.parentElement;
    if(!card) return result;
    var text=(card.innerText||card.textContent||"").replace(/\s+/g," ").trim();
    var minimum=text.match(/(?:Min|Minimum)\s*([0-9][0-9.,]*)\s*(?:TRY|TL|₺)?/i);
    var maximum=text.match(/(?:Maks|Maksimum|Max|Maximum)\s*([0-9][0-9.,]*)\s*(?:TRY|TL|₺)?/i);
    result.minimum=formatBankLimit(minimum&&minimum[1]);
    result.maximum=formatBankLimit(maximum&&maximum[1]);
    return result;
  }

  function clearBankTransferFormState(){
    Array.prototype.slice.call(document.querySelectorAll("form.sp-bank-transfer-form")).forEach(function(form){
      form.classList.remove("sp-bank-transfer-form");
      form.style.removeProperty("--sp-bank-panel-space");
      Array.prototype.slice.call(form.querySelectorAll(".sp-bank-native-title")).forEach(function(item){item.classList.remove("sp-bank-native-title");});
      Array.prototype.slice.call(form.querySelectorAll("input.sp-bank-hidden-field")).forEach(function(input){
        /* Lynon yöntem değiştirirken inputs.0.value düğümünü TXID alanı için
           yeniden kullanabiliyor. Bank Transfer IBAN'ını yeni yönteme taşıma. */
        setNativeInputValue(input,"");
        input.classList.remove("sp-bank-hidden-field");
        input.readOnly=false;
        input.removeAttribute("tabindex");
      });
      Array.prototype.slice.call(form.querySelectorAll("button.sp-bank-submit")).forEach(function(button){
        button.classList.remove("sp-bank-submit");
        button.removeAttribute("data-sp-label");
      });
    });
  }

  function canApplyBankTransferResult(form,requestGeneration){
    return !!form&&document.contains(form)&&isBankTransferDepositRoute()&&
      requestGeneration===paymentSwitchGeneration&&
      isBankTransferSelected()&&
      !document.documentElement.classList.contains("sp-payment-method-switching")&&
      Date.now()>=nonBankMethodSwitchUntil;
  }

  function enhanceBankTransfer(){
    var bankFormFound=false;
    /* Bank Transfer kimliği yatırma ve çekmede ortak kullanılabiliyor.
       Özel banka hesabı/IBAN görünümü yalnızca yatırma rotasına aittir. */
    if(!isBankTransferDepositRoute()||!isBankTransferSelected()||Date.now()<nonBankMethodSwitchUntil){
      document.documentElement.classList.remove("sp-bank-transfer-selected");
      clearBankTransferFormState();
      var inactivePortal=document.getElementById("sp-bank-account-portal");
      if(inactivePortal) inactivePortal.remove();
      activeBankForm=null;
      activeBankPanel=null;
      return;
    }
    document.documentElement.classList.add("sp-bank-transfer-selected");
    Array.prototype.slice.call(document.querySelectorAll("form")).forEach(function(form){
      var amount=form.querySelector('input[placeholder="Tutarı Girin"],input[placeholder*="Tutar"]');
      if(!amount) return;
      var rect=form.getBoundingClientRect();
      if(rect.width<1||rect.height<1) return;
      bankFormFound=true;
      form.classList.add("sp-bank-transfer-form");
      Array.prototype.slice.call(form.querySelectorAll("p,span,div")).forEach(function(element){
        if(element.children.length) return;
        var nativeTitle=normalizeTurkish(element.textContent||"").replace(/\s+/g," ").trim();
        if(nativeTitle==="MANUAL HAVALE"||nativeTitle==="HEMEN HAVALE"||nativeTitle==="BANK TRANSFER"||nativeTitle==="BANKA HAVALESI") element.classList.add("sp-bank-native-title");
      });
      if(form.dataset.spBankLoading==="1") return;
      form.dataset.spBankLoading="1";
      var bankRequestGeneration=paymentSwitchGeneration;
      loadBankAccount().then(function(account){
        /* Banka bilgisi gecikmeli donerse Lynon ayni form dugumunu Tether
           icin yeniden kullanmis olabilir. Secim degistiyse sonucu uygulama. */
        if(!canApplyBankTransferResult(form,bankRequestGeneration)) return;
        var limits=readBankTransferLimits();
        var minimumLimit=limits.minimum||"250 TRY";
        var maximumLimit=limits.maximum||"200.000 TRY";
        var textInputs=Array.prototype.slice.call(form.querySelectorAll('input[type="text"],input:not([type])')).filter(function(input){return input!==amount;});
        var bankInput=textInputs[0]||null;
        var nameInput=textInputs[1]||null;
        [bankInput,nameInput].forEach(function(input){if(input){input.classList.add("sp-bank-hidden-field");input.readOnly=true;input.tabIndex=-1;}});
        setNativeInputValue(bankInput,account.active?account.iban:"");
        setNativeInputValue(nameInput,account.active?account.account_name:"");

        var legacyPanel=form.querySelector(".sp-bank-account-panel:not(#sp-bank-account-portal)");
        if(legacyPanel) legacyPanel.remove();
        var panel=getBankPortal();
        var accountKey=account.active?("active|"+account.account_name+"|"+account.iban+"|"+minimumLimit+"|"+maximumLimit):"inactive";
        if(panel.dataset.spAccountKey!==accountKey){
          panel.dataset.spAccountKey=accountKey;
          if(!account.active){
            panel.innerHTML='<div class="sp-bank-unavailable">Şu anda aktif banka hesabı bulunmamaktadır. Lütfen daha sonra tekrar deneyiniz.</div>';
          }else{
            panel.innerHTML='<div class="sp-bank-limits"><span>İŞLEM LİMİTLERİ</span><div><strong>Minimum Yatırım</strong><b></b></div><div><strong>Maksimum Yatırım</strong><b></b></div><div class="sp-bank-fast-logo"><img src="https://cdn.jsdelivr.net/gh/ceibkese/SarayPashaCasino@main/fast-logo-v1.png?v=1" alt="FAST"></div></div>'+
              '<div class="sp-bank-instruction">Gönderiminizi yaptıktan sonra tutarı girerek talep iletiniz.</div>'+
              '<div class="sp-bank-row"><div><small>HESAP SAHİBİ</small><strong></strong></div><button type="button">Kopyala</button></div>'+
              '<div class="sp-bank-row"><div><small>IBAN</small><strong></strong></div><button type="button">Kopyala</button></div>';
            var limitValues=panel.querySelectorAll(".sp-bank-limits b");
            limitValues[0].textContent=minimumLimit;
            limitValues[1].textContent=maximumLimit;
            var rows=panel.querySelectorAll(".sp-bank-row");
            rows[0].querySelector("strong").textContent=account.account_name;
            rows[1].querySelector("strong").textContent=formatIban(account.iban);
            [[rows[0],account.account_name,"Hesap sahibi kopyalandı."],[rows[1],account.iban,"IBAN kopyalandı."]].forEach(function(item){
              item[0].querySelector("button").addEventListener("click",function(){copyAddress(item[1]).then(function(){showToast(item[2]);}).catch(function(){showToast("Kopyalama tamamlanamadı.");});});
            });
          }
        }
        var submit=form.querySelector('button[type="submit"]');
        if(submit){submit.classList.add("sp-bank-submit");submit.setAttribute("data-sp-label","TALEP İLET");submit.disabled=!account.active;submit.setAttribute("aria-disabled",account.active?"false":"true");}
        placeBankPortal(form,panel);
      }).catch(function(){
        if(!canApplyBankTransferResult(form,bankRequestGeneration)) return;
        var legacyPanel=form.querySelector(".sp-bank-account-panel:not(#sp-bank-account-portal)");if(legacyPanel) legacyPanel.remove();
        var panel=getBankPortal();
        if(panel.dataset.spAccountKey!=="error"){panel.dataset.spAccountKey="error";panel.innerHTML='<div class="sp-bank-unavailable">Banka hesabı bilgisi şu anda alınamıyor. Lütfen kısa süre sonra tekrar deneyiniz.</div>';}
        var submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.setAttribute("aria-disabled","true");}
        placeBankPortal(form,panel);
      }).finally(function(){form.dataset.spBankLoading="0";});
    });
    if(!bankFormFound){var stalePortal=document.getElementById("sp-bank-account-portal");if(stalePortal) stalePortal.remove();activeBankForm=null;activeBankPanel=null;}
  }

  function clearBankWithdrawalState(){
    Array.prototype.slice.call(document.querySelectorAll("form.sp-bank-withdrawal-form")).forEach(function(form){
      form.classList.remove("sp-bank-withdrawal-form");
      var limitsPanel=form.querySelector(".sp-bank-withdrawal-limits");
      if(limitsPanel) limitsPanel.remove();
      var bankPicker=form.querySelector(".sp-bank-withdrawal-bank-picker");
      if(bankPicker) bankPicker.remove();
      Array.prototype.slice.call(form.querySelectorAll(".sp-bank-withdrawal-native-bank")).forEach(function(item){item.classList.remove("sp-bank-withdrawal-native-bank");});
      Array.prototype.slice.call(form.querySelectorAll(".sp-bank-withdrawal-native-meta")).forEach(function(item){item.classList.remove("sp-bank-withdrawal-native-meta");});
      Array.prototype.slice.call(form.querySelectorAll(".sp-bank-withdrawal-submit")).forEach(function(button){
        button.classList.remove("sp-bank-withdrawal-submit");
      });
    });
    document.documentElement.classList.remove("sp-bank-withdrawal-selected");
  }

  function enhanceWithdrawalFrames(){
    var forms=Array.prototype.slice.call(document.querySelectorAll("form"));
    if(!isBankTransferWithdrawalRoute()){
      forms.forEach(function(form){form.classList.remove("sp-withdrawal-method-frame");});
      document.documentElement.classList.remove("sp-withdrawal-preparing");
      return;
    }
    var found=false;
    forms.forEach(function(form){
      var amount=form.querySelector('input[placeholder="Tutarı Girin"],input[placeholder*="Tutar"]');
      var text=normalizeTurkish(form.textContent||"");
      if(!amount||form.getClientRects().length===0||text.indexOf("KILITLI BAKIYE")===-1) return;
      form.classList.add("sp-withdrawal-method-frame");
      found=true;
    });
    if(found) document.documentElement.classList.remove("sp-withdrawal-preparing");
  }

  function enhanceDepositFrames(){
    var forms=Array.prototype.slice.call(document.querySelectorAll("form"));
    if(!isBankTransferDepositRoute()){
      forms.forEach(function(form){form.classList.remove("sp-deposit-method-frame");});
      return;
    }
    forms.forEach(function(form){
      var amount=form.querySelector('input[placeholder="Tutarı Girin"],input[placeholder*="Tutar"]');
      if(!amount||form.getClientRects().length===0) return;
      if(window.matchMedia("(max-width: 768px)").matches&&isBankTransferSelected()&&form.dataset.spBankLoading!=="0"){
        form.classList.remove("sp-deposit-method-frame");
        return;
      }
      form.classList.add("sp-deposit-method-frame");
    });
  }

  function beginNonBankPaymentSwitch(event){
    if(!isBankTransferDepositRoute()) return;
    var target=event&&event.target;
    if(!target||!target.closest) return;
    var logo=target.closest('img[alt="payment-logo"]');
    /* Lynon logolara pointer-events:none verebildigi icin olay bazen resmi
       saran kutuya gelir. Tek bir odeme logosu iceren en yakin kutuyu bul. */
    if(!logo){
      var cursor=target;
      for(var depth=0;cursor&&depth<7;depth++,cursor=cursor.parentElement){
        if(!cursor.querySelectorAll) continue;
        var nested=cursor.querySelectorAll('img[alt="payment-logo"]');
        if(nested.length===1){logo=nested[0];break;}
        if(nested.length>1) break;
      }
    }
    if(!logo) return;
    var source=String(logo.getAttribute("src")||logo.src||"");
    if(source.indexOf("/payments/275")!==-1){
      /* Yeni Bank Transfer secimi, onceki Tether/Havale gecisinin bekleyen
         zamanlayicilarini gecersiz kilar. */
      paymentSwitchGeneration++;
      nonBankMethodSwitchUntil=0;
      document.documentElement.classList.remove("sp-payment-method-switching");
      setTimeout(refresh,0);
      setTimeout(refresh,80);
      return;
    }

    /* React yeni odeme formunu cizmeden once Bank Transfer'a ait katmani
       kaldir. Boylece Tether/Havale gecisinde eski banka formu parlamaz. */
    var generation=++paymentSwitchGeneration;
    var startedAt=Date.now();
    var paymentId=(source.match(/\/payments\/(\d+)/)||[])[1]||"";
    nonBankMethodSwitchUntil=startedAt+1800;
    document.documentElement.classList.add("sp-payment-method-switching");

    /* Pointerdown sirasinda DOM'u degistirmek Lynon'un ardindan gelecek click
       olayini yutabiliyor. Ilk anda CSS eski formu saklar; temizlik native
       click tamamlandiktan sonraki goreve birakilir. */
    setTimeout(function(){
      if(generation!==paymentSwitchGeneration) return;
      clearBankTransferFormState();
      var portal=document.getElementById("sp-bank-account-portal");
      if(portal) portal.remove();
      activeBankForm=null;
      activeBankPanel=null;
      document.documentElement.classList.remove("sp-bank-transfer-selected");
      refresh();
    },0);

    var delays=[30,80,150,260,420,700,1050];
    delays.forEach(function(delay){
      setTimeout(function(){
        if(generation!==paymentSwitchGeneration) return;
        refresh();
        if(!document.contains(logo)) return;
        var holder=logo.parentElement;
        var style=holder?getComputedStyle(holder):null;
        var border=style?String(style.borderColor||"").replace(/\s+/g,"").toLowerCase():"";
        var selected=border&&border!=="transparent"&&border!=="rgba(0,0,0,0)";
        var forms=Array.prototype.slice.call(document.querySelectorAll("form")).filter(function(form){return form.getClientRects&&form.getClientRects().length>0;});
        var targetReady=forms.some(function(form){
          if(paymentId==="277"){
            return !!form.querySelector('input[placeholder*="TXID"],input[placeholder*="TX ID"]')||normalizeTurkish(form.textContent||"").indexOf("TRC20")!==-1;
          }
          return Date.now()-startedAt>=140&&!form.classList.contains("sp-bank-transfer-form");
        });
        if(selected&&targetReady){
          nonBankMethodSwitchUntil=0;
          document.documentElement.classList.remove("sp-payment-method-switching");
          refresh();
        }
      },delay);
    });
    setTimeout(function(){
      if(generation!==paymentSwitchGeneration) return;
      nonBankMethodSwitchUntil=0;
      document.documentElement.classList.remove("sp-payment-method-switching");
      refresh();
    },1850);
  }

  function enhanceBankWithdrawal(){
    if(!isBankTransferWithdrawalRoute()||!isBankTransferSelected()){
      clearBankWithdrawalState();
      return;
    }
    var found=false;
    Array.prototype.slice.call(document.querySelectorAll("form")).forEach(function(form){
      var amount=form.querySelector('input[placeholder="Tutarı Girin"],input[placeholder*="Tutar"]');
      var iban=form.querySelector('input[name="inputs.0.value"]');
      var bank=form.querySelector('input[name="inputs.1.value"]');
      if(!amount||!iban||!bank||form.getClientRects().length===0) return;
      found=true;
      document.documentElement.classList.add("sp-bank-withdrawal-selected");
      form.classList.add("sp-bank-withdrawal-form");
      var nativeBankGroup=bank.closest(".app-ltr-19sk4h4")||bank.parentElement;
      if(nativeBankGroup) nativeBankGroup.classList.add("sp-bank-withdrawal-native-bank");
      if(!form.querySelector(".sp-bank-withdrawal-bank-picker")){
        var banks=[
          "Fast Havale Çekim","TEB","Akbank","Enpara","Denizbank","Fiba Bank",
          "Odea Bank","İNG Bank","Vakıf Bank","Yapı Kredi","Şeker Bank","Kuveyt Türk",
          "Halk Bankası","İş Bankası","Albaraka Türk","QNB Finansbank","Ziraat Bankası",
          "Garanti Bankası","T.Finans Bankası"
        ];
        var picker=document.createElement("div");
        picker.className="sp-bank-withdrawal-bank-picker";
        var pickerLabel=document.createElement("label");
        pickerLabel.textContent="Banka :";
        var selectButton=document.createElement("button");
        selectButton.type="button";
        selectButton.className="sp-bank-picker-trigger";
        selectButton.setAttribute("aria-haspopup","listbox");
        selectButton.setAttribute("aria-expanded","false");
        selectButton.textContent=String(bank.value||"").trim()||"SEÇİNİZ";
        var menu=document.createElement("div");
        menu.className="sp-bank-picker-menu";
        menu.hidden=true;
        var search=document.createElement("input");
        search.type="search";
        search.className="sp-bank-picker-search";
        search.placeholder="Ara";
        search.setAttribute("aria-label","Banka ara");
        var options=document.createElement("div");
        options.className="sp-bank-picker-options";
        options.setAttribute("role","listbox");
        banks.forEach(function(name){
          var option=document.createElement("button");
          option.type="button";
          option.className="sp-bank-picker-option";
          option.setAttribute("role","option");
          option.dataset.value=name;
          option.textContent=name;
          option.addEventListener("click",function(){
            setNativeInputValue(bank,name);
            selectButton.textContent=name;
            selectButton.setAttribute("aria-expanded","false");
            menu.hidden=true;
          });
          options.appendChild(option);
        });
        search.addEventListener("input",function(){
          var query=normalizeTurkish(search.value||"");
          Array.prototype.forEach.call(options.children,function(option){
            option.hidden=query&&normalizeTurkish(option.dataset.value||"").indexOf(query)===-1;
          });
        });
        selectButton.addEventListener("click",function(){
          var willOpen=menu.hidden;
          menu.hidden=!willOpen;
          selectButton.setAttribute("aria-expanded",willOpen?"true":"false");
          if(willOpen){search.value="";Array.prototype.forEach.call(options.children,function(option){option.hidden=false;});setTimeout(function(){search.focus();},0);}
        });
        menu.appendChild(search);
        menu.appendChild(options);
        picker.appendChild(pickerLabel);
        picker.appendChild(selectButton);
        picker.appendChild(menu);
        if(nativeBankGroup&&nativeBankGroup.parentNode) nativeBankGroup.parentNode.insertBefore(picker,nativeBankGroup);
      }
      iban.placeholder="IBAN numaranızı girin";
      Array.prototype.slice.call(form.querySelectorAll("p,span,div")).forEach(function(element){
        if(element.children.length) return;
        var meta=normalizeTurkish(element.textContent||"").replace(/\s+/g," ").trim();
        if(meta==="MANUAL HAVALE"||/^MIN\s*[0-9]/.test(meta)||/^(MAKS|MAX)\s*[0-9]/.test(meta)){
          element.classList.add("sp-bank-withdrawal-native-meta");
        }
      });
      if(!form.querySelector(".sp-bank-withdrawal-limits")){
        var limits=readBankTransferLimits();
        var limitsPanel=document.createElement("section");
        limitsPanel.className="sp-bank-withdrawal-limits";
        limitsPanel.innerHTML='<div><small>Minimum Çekim</small><strong></strong></div><div><small>Maksimum Çekim</small><strong></strong></div>';
        var limitValues=limitsPanel.querySelectorAll("strong");
        limitValues[0].textContent=limits.minimum||"2.000 TRY";
        limitValues[1].textContent=limits.maximum||"500.000 TRY";
        form.insertBefore(limitsPanel,form.firstChild);
      }
      var submit=form.querySelector('button[type="submit"]');
      if(submit){
        submit.classList.add("sp-bank-withdrawal-submit");
      }
    });
    if(!found) clearBankWithdrawalState();
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

  function ensureKeyboardShield(overlay) {
    if(!overlay) return;
    var shield=document.querySelector(".sp-keyboard-page-shield");
    if(!shield){
      shield=document.createElement("div");
      shield.className="sp-keyboard-page-shield";
      shield.setAttribute("aria-hidden","true");
      document.body.appendChild(shield);
    }
    var overlayZ=parseInt(window.getComputedStyle(overlay).zIndex,10);
    if(!Number.isFinite(overlayZ)) overlayZ=1100;
    var shieldHeight=Math.max(
      window.screen&&window.screen.height||0,
      window.screen&&window.screen.availHeight||0,
      window.innerHeight||0,
      document.documentElement.clientHeight||0,
      Math.round(overlay.getBoundingClientRect().height)||0
    );
    shield.style.zIndex=String(Math.max(1,overlayZ-1));
    shield.style.height=shieldHeight+"px";
    shield.style.minHeight=shieldHeight+"px";
  }

  function normalizeTurkish(text){
    return String(text||"")
      .replace(/[Çç]/g,"C").replace(/[Ğğ]/g,"G")
      .replace(/[İIıi]/g,"I").replace(/[Öö]/g,"O")
      .replace(/[Şş]/g,"S").replace(/[Üü]/g,"U")
      .toUpperCase();
  }

  function isMoneyTransactionForm(form){
    if(!form) return false;
    var text=normalizeTurkish(form.textContent||"");
    return text.indexOf("YATIRIM")!==-1||text.indexOf("CEKIM")!==-1;
  }

  function isTransactionInput(element) {
    var form=element&&element.closest&&element.closest("form");
    return isMoneyTransactionForm(form);
  }

  var activeScrollLock=null;

  function getScrollableParents(input,overlay){
    var result=[];
    var current=input&&input.parentElement;
    while(current&&current!==document.body){
      var style=window.getComputedStyle(current);
      if(/auto|scroll/i.test(style.overflowY||"")&&current.scrollHeight>current.clientHeight){
        result.push({element:current,top:current.scrollTop});
      }
      if(current===overlay) break;
      current=current.parentElement;
    }
    return result;
  }

  function clampDepositScroll(){
    if(!activeScrollLock) return;
    activeScrollLock.parents.forEach(function(item){
      var min=Math.max(0,item.top-12);
      var max=item.top+12;
      if(item.element.scrollTop<min) item.element.scrollTop=min;
      if(item.element.scrollTop>max) item.element.scrollTop=max;
    });
  }

  function startDepositScrollLock(input,overlay){
    if(window.innerWidth>768) return;
    var pageX=window.pageXOffset||0;
    var pageY=window.pageYOffset||0;
    activeScrollLock={x:pageX,y:pageY,parents:getScrollableParents(input,overlay)};
    document.documentElement.classList.add("sp-deposit-scroll-locked");
    document.body.style.setProperty("--sp-page-lock-top",(-pageY)+"px");
    document.body.classList.add("sp-deposit-scroll-locked");
    [0,60,140,260,450,700].forEach(function(delay){setTimeout(clampDepositScroll,delay);});
  }

  function stopDepositScrollLock(){
    var previousLock=activeScrollLock;
    var pageX=previousLock?previousLock.x:(window.pageXOffset||0);
    var pageY=previousLock?previousLock.y:(window.pageYOffset||0);
    activeScrollLock=null;
    document.documentElement.classList.remove("sp-deposit-scroll-locked");
    document.body.classList.remove("sp-deposit-scroll-locked");
    document.body.classList.remove("sp-trc20-input-focused");
    document.body.style.removeProperty("--sp-page-lock-top");
    var shield=document.querySelector(".sp-keyboard-page-shield");
    if(shield) shield.remove();
    Array.prototype.slice.call(document.querySelectorAll(".sp-trc20-modal-overlay")).forEach(function(item){
      item.classList.remove("sp-trc20-modal-overlay");
      item.style.removeProperty("--sp-deposit-cover-height");
    });
    Array.prototype.slice.call(document.querySelectorAll(".sp-trc20-modal-surface")).forEach(function(item){item.classList.remove("sp-trc20-modal-surface");});
    if(previousLock) window.scrollTo(pageX,pageY);
  }

  if(window.visualViewport&&!window.__spDepositViewportLockReady){
    window.__spDepositViewportLockReady=true;
    var onDepositViewportChange=function(){setTimeout(function(){
      clampDepositScroll();
      if(activeBankForm&&activeBankPanel) placeBankPortal(activeBankForm,activeBankPanel);
    },0);};
    listenGlobal(window.visualViewport,"resize",onDepositViewportChange);
    listenGlobal(window.visualViewport,"scroll",onDepositViewportChange);
    cleanupFns.push(function(){delete window.__spDepositViewportLockReady;});
  }

  function bindKeyboard(input, overlay) {
    if(!input || input.dataset.spKeyboardReady==="1") return;
    input.dataset.spKeyboardReady="1";
    var form=input.closest("form");
    input.addEventListener("focus",function(){
      startDepositScrollLock(input,overlay);
      if(activeBankForm&&activeBankPanel){
        [0,60,140,260,450,700].forEach(function(delay){setTimeout(function(){placeBankPortal(activeBankForm,activeBankPanel);},delay);});
      }
      document.body.classList.add("sp-trc20-input-focused");
      if(overlay) {
        var coverHeight=Math.max(
          window.innerHeight||0,
          document.documentElement.clientHeight||0,
          Math.round(overlay.getBoundingClientRect().height)||0
        );
        overlay.classList.add("sp-trc20-modal-overlay");
        overlay.style.setProperty("--sp-deposit-cover-height",coverHeight+"px");
        ensureKeyboardShield(overlay);
      }
      var surface=overlay && overlay.querySelector(".modal"); if(surface) surface.classList.add("sp-trc20-modal-surface");
    });
    input.addEventListener("blur",function(){ setTimeout(function(){
      if(!isTransactionInput(document.activeElement)) {
        stopDepositScrollLock();
        document.body.classList.remove("sp-trc20-input-focused");
        var shield=document.querySelector(".sp-keyboard-page-shield");
        if(shield) shield.remove();
      }
    },260); });
  }

  function enhanceAllTransactionInputs() {
    Array.prototype.slice.call(document.querySelectorAll("form")).forEach(function(form){
      if(!isMoneyTransactionForm(form)) return;
      var overlay=findFixedOverlay(form);
      Array.prototype.slice.call(form.querySelectorAll("input,textarea")).forEach(function(input){
        var type=(input.getAttribute("type")||"text").toLowerCase();
        if(["hidden","checkbox","radio","button","submit","reset","file"].indexOf(type)!==-1) return;
        bindKeyboard(input,overlay);
      });
      form.classList.add("sp-trc20-form-ready");
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

  function isValidUsernameCandidate(value){
    value=String(value||"").trim();
    if(!/^[A-Za-z0-9._-]{3,50}$/.test(value)) return false;
    var blocked=["durum","dogrulandi","doğrulandı","kullanici","kullanıcı","bakiye","bonus","bildirimler","guvenlik","güvenlik","hesap"];
    return blocked.indexOf(value.toLocaleLowerCase("tr-TR"))===-1;
  }

  function readLoggedInUsername(allowSaved){
    if(typeof allowSaved==="undefined") allowSaved=true;
    var savedUsername="";
    try{ savedUsername=sessionStorage.getItem("spCurrentUsername")||""; }catch(e){}
    var labels=Array.prototype.slice.call(document.querySelectorAll("span"));
    for(var i=0;i<labels.length;i++){
      var label=labels[i];
      if((label.textContent||"").trim().toLocaleLowerCase("tr-TR")==="kullanıcı adı:"){
        var sibling=label.nextElementSibling;
        var value=sibling&&sibling.tagName==="P" ? (sibling.textContent||"").trim() : "";
        if(isValidUsernameCandidate(value)){
          try{sessionStorage.setItem("spCurrentUsername",value);}catch(e){}
          return value;
        }
        var labelRect=label.getBoundingClientRect();
        var aligned=Array.prototype.slice.call(document.querySelectorAll("span,p,div,strong"))
          .filter(function(item){
            if(item===label||item.children.length>0) return false;
            var candidate=(item.textContent||"").trim();
            if(!isValidUsernameCandidate(candidate)) return false;
            var rect=item.getBoundingClientRect();
            if(!rect.width||!rect.height) return false;
            var sameLine=Math.abs((rect.top+rect.height/2)-(labelRect.top+labelRect.height/2))<=10;
            return sameLine&&rect.left>=labelRect.right-2;
          })
          .sort(function(a,b){return a.getBoundingClientRect().left-b.getBoundingClientRect().left;});
        if(aligned.length){
          var alignedValue=(aligned[0].textContent||"").trim();
          try{sessionStorage.setItem("spCurrentUsername",alignedValue);}catch(e){}
          return alignedValue;
        }
      }
    }
    var pageText=(document.body.innerText||"")+"\n"+(document.body.textContent||"");
    var match=pageText.match(/Kullanıcı Adı:\s*([A-Za-z0-9._-]{3,50})/i);
    if(match&&isValidUsernameCandidate(match[1])){
      try{sessionStorage.setItem("spCurrentUsername",match[1]);}catch(e){}
      return match[1];
    }
    if(!allowSaved||!isValidUsernameCandidate(savedUsername)){
      if(!allowSaved) return "";
      try{sessionStorage.removeItem("spCurrentUsername");}catch(e){}
      return "";
    }
    return savedUsername;
  }

  function sendBonusUsername(frame){
    var currentUsername=readLoggedInUsername();
    if(!currentUsername||!frame||!frame.contentWindow) return;
    frame.contentWindow.postMessage({type:"sp-bonus-username",username:currentUsername},"https://saraypasha.com");
  }

  function hideStaleBonusError(dialog,pane,content){
    if(!dialog) return;
    /* Giriş dönüşünde platform hata kolonunu panel hazırlandıktan sonra yeniden
       oluşturabiliyor. Iframe ve başlığı koruyup yalnız hata metnini taşıyan
       en geniş güvenli kapsayıcıyı gizle. */
    Array.prototype.forEach.call(dialog.querySelectorAll("*"),function(node){
      if(node===pane||node===content||node.querySelector(".sp-bonus-embed-frame")) return;
      var ownText=(node.innerText||node.textContent||"").replace(/\s+/g," ").trim().toLowerCase();
      if(ownText!=="something went wrong") return;
      var target=node;
      while(target.parentElement&&target.parentElement!==dialog&&target.parentElement!==pane&&target.parentElement!==content){
        var parent=target.parentElement;
        if(parent.querySelector(".sp-bonus-embed-frame")||parent.querySelector('button[aria-label="close"],button[name="close"]')) break;
        target=parent;
      }
      target.style.setProperty("display","none","important");
      target.setAttribute("aria-hidden","true");
    });
    Array.prototype.forEach.call(dialog.children,function(child){
      if(child!==pane&&/something\s+went\s+wrong/i.test((child.innerText||child.textContent||"").trim())){
        child.style.setProperty("display","none","important");
        child.setAttribute("aria-hidden","true");
      }
    });
  }

  function enhanceBonusRequestPage(){
    var params=new URLSearchParams(window.location.search);
    if(params.get("t")!=="instant_cashback") return;
    var dialog=document.querySelector('[role="alertdialog"]');
    if(!dialog) return;
    var panes=Array.prototype.slice.call(dialog.children);
    var pane=panes.find(function(item){return !!item.querySelector('button[aria-label="close"],button[name="close"]');});
    if(!pane||pane.children.length<2) return;
    var content=pane.children[1];
    if(content.dataset.spBonusEmbedReady==="1"){
      hideStaleBonusError(dialog,pane,content);
      sendBonusUsername(content.querySelector(".sp-bonus-embed-frame"));
      return;
    }
    pane.classList.add("sp-bonus-embed-pane");
    content.classList.add("sp-bonus-embed-content");
    /* Platform bazen giris sonrasi eski hata kolonunu dialog icinde birakiyor.
       Bonus paneli disindaki bu artik kolonlari tamamen gizle. */
    Array.prototype.forEach.call(dialog.children,function(child){
      if(child!==pane) child.style.setProperty("display","none","important");
    });
    Array.prototype.forEach.call(pane.children,function(child,index){
      if(child!==content&&index!==0) child.style.setProperty("display","none","important");
    });
    content.dataset.spBonusEmbedReady="1";
    content.textContent="";
    var frame=document.createElement("iframe");
    frame.className="sp-bonus-embed-frame";
    frame.title="SarayPasha Bonus Talep Merkezi";
    frame.src="https://saraypasha.com/bonus-embed.php";
    frame.setAttribute("loading","eager");
    frame.setAttribute("allow","autoplay");
    frame.addEventListener("load",function(){
      sendBonusUsername(frame);
      setTimeout(function(){sendBonusUsername(frame);},500);
    });
    content.appendChild(frame);
    hideStaleBonusError(dialog,pane,content);
    setTimeout(function(){hideStaleBonusError(dialog,pane,content);},250);
    setTimeout(function(){hideStaleBonusError(dialog,pane,content);},1000);
  }

  function findDepositButton(){
    var candidates=Array.prototype.slice.call(document.querySelectorAll("button,a,[role='button']"))
      .filter(function(item){
        return !(item.closest&&item.closest(".sp-quick-actions"));
      })
      .map(function(item){
        var raw=[
          item.innerText||"",
          item.textContent||"",
          item.getAttribute("aria-label")||"",
          item.getAttribute("title")||""
        ].join(" ").replace(/\s+/g," ").trim();
        return {
          item:item,
          text:normalizeTurkish(raw),
          top:item.getBoundingClientRect().top,
          inHeader:!!(item.closest&&item.closest("header"))
        };
      })
      .filter(function(entry){
        return entry.text.indexOf("PARA YATIR")!==-1||/(^|\s)YATIR($|\s)/.test(entry.text);
      });
    candidates.sort(function(a,b){
      if(a.inHeader!==b.inHeader) return a.inHeader?-1:1;
      return a.top-b.top;
    });
    return candidates.length?candidates[0].item:null;
  }

  function navigateToDeposit(){
    var language=(window.location.pathname.match(/^\/(tr|en)(?:\/|$)/i)||[])[1]||"tr";
    window.location.href=window.location.origin+"/"+language+"/?m=account&t=deposit";
  }

  function openDepositPanel(){
    if(isVisitorLoggedOut()){
      try{sessionStorage.removeItem("spCurrentUsername");}catch(e){}
      rememberPendingAction("deposit");
      showToast("Para yatırma işlemi için lütfen üyelik hesabınıza giriş yapınız.");
      var login=findVisibleActionButton(["GIRIS YAP","LOGIN","SIGN IN"]);
      if(login) login.click();
      return;
    }
    navigateToDeposit();
    return;
    var target=findDepositButton();
    if(target){ target.click(); return; }
    showToast("Para yatırma alanı açılamadı. Lütfen üst menüdeki Yatır butonunu kullanınız.");
  }

  function findVisibleActionButton(names){
    var candidates=Array.prototype.slice.call(document.querySelectorAll("button,a,[role='button']"));
    return candidates.find(function(item){
      if(item.closest&&item.closest(".sp-quick-actions")) return false;
      var text=normalizeTurkish((item.innerText||item.textContent||"").replace(/\s+/g," ").trim());
      var visible=!!(item.offsetWidth||item.offsetHeight||item.getClientRects().length);
      return visible&&names.indexOf(text)!==-1;
    })||null;
  }

  function isVisitorLoggedOut(){
    return !!findVisibleActionButton(["GIRIS YAP","LOGIN","SIGN IN"]);
  }

  function openLoginForBonus(){
    try{sessionStorage.removeItem("spCurrentUsername");}catch(e){}
    rememberPendingAction("bonus");
    showToast("Bonus talep edebilmek için lütfen üyelik hesabınıza giriş yapınız.");
    var login=findVisibleActionButton(["GIRIS YAP","LOGIN","SIGN IN"]);
    if(login) login.click();
  }

  function openBonusRequestPage(){
    if(isVisitorLoggedOut()){
      openLoginForBonus();
      return;
    }
    openBonusPageAfterUsernameCapture();
  }

  function navigateToBonusRequest(){
    var language=(window.location.pathname.match(/^\/(tr|en)(?:\/|$)/i)||[])[1]||"tr";
    window.location.href=window.location.origin+"/"+language+"?m=account&t=instant_cashback";
  }

  function openBonusPageAfterUsernameCapture(){
    if(readLoggedInUsername(false)){
      navigateToBonusRequest();
      return;
    }
    try{sessionStorage.removeItem("spCurrentUsername");}catch(e){}
    showToast("Kullanıcı adınız otomatik okunamadı. Bonus sayfasında kullanıcı adınızı yazabilirsiniz.");
    navigateToBonusRequest();
  }

  function rememberPendingAction(action){
    try{sessionStorage.setItem("spPendingQuickAction",JSON.stringify({action:action,createdAt:Date.now()}));}catch(e){}
  }

  function readPendingAction(){
    try{
      var raw=sessionStorage.getItem("spPendingQuickAction");
      if(!raw) return "";
      var data=JSON.parse(raw);
      if(!data||["deposit","bonus"].indexOf(data.action)===-1||Date.now()-Number(data.createdAt)>10*60*1000){
        sessionStorage.removeItem("spPendingQuickAction");
        return "";
      }
      return data.action;
    }catch(e){return "";}
  }

  function clearPendingAction(){
    try{sessionStorage.removeItem("spPendingQuickAction");}catch(e){}
  }

  function continuePendingAction(){
    var action=readPendingAction();
    if(!action||isVisitorLoggedOut()) return;
    /* Girişten kalan hızlı işlem başka bir içerik sayfasını ele geçirmesin.
       Yalnızca giriş dönüşünün yapıldığı ana sayfada devam eder. */
    if(!isHomePage()) return;
    if(action==="bonus"){
      clearPendingAction();
      openBonusPageAfterUsernameCapture();
      return;
    }
    clearPendingAction();
    navigateToDeposit();
  }

  function enhanceQuickActions(){
    if(document.querySelector(".sp-quick-actions")) return;
    var root=document.createElement("div");
    root.className="sp-quick-actions";
    root.innerHTML='<div class="sp-quick-actions-menu"><button type="button" class="sp-quick-action sp-quick-deposit"><span class="sp-quick-action-icon">₺</span><span>Para Yatır</span></button><button type="button" class="sp-quick-action sp-quick-bonus"><span class="sp-quick-action-icon">🎁</span><span>Bonus Talep</span></button></div><button type="button" class="sp-quick-action-main" aria-label="Hızlı işlemler" aria-expanded="false"><img src="https://cdn.jsdelivr.net/gh/ceibkese/SarayPashaCasino@main/saray-dollar-icon-v1.png" alt="" aria-hidden="true"></button>';
    document.body.appendChild(root);
    var main=root.querySelector(".sp-quick-action-main");
    function closeMenu(){root.classList.remove("sp-quick-actions-open");main.setAttribute("aria-expanded","false");}
    main.addEventListener("click",function(event){event.preventDefault();event.stopPropagation();var opening=!root.classList.contains("sp-quick-actions-open");root.classList.toggle("sp-quick-actions-open",opening);main.setAttribute("aria-expanded",opening?"true":"false");});
    root.querySelector(".sp-quick-deposit").addEventListener("click",function(){closeMenu();openDepositPanel();});
    root.querySelector(".sp-quick-bonus").addEventListener("click",function(){closeMenu();openBonusRequestPage();});
    listenGlobal(document,"click",function(event){if(!root.contains(event.target))closeMenu();});
    listenGlobal(document,"keydown",function(event){if(event.key==="Escape")closeMenu();});
  }

  function isHomePage(){
    if(!/^\/(tr|en)\/?$/i.test(window.location.pathname)) return false;
    var routeParams=new URLSearchParams(window.location.search);
    return !routeParams.get("m") && !routeParams.get("t");
  }

  function syncPageMode(){
    if(!document.body) return;
    var home=isHomePage();
    var sports=/^\/(tr|en)\/sport(?:\/|$)/i.test(window.location.pathname);
    document.body.classList.toggle("sp-home-page",home);
    document.body.classList.toggle("sp-sports-page",sports);
    if(!home) removeHomeBannerExtras();
    if(!sports) document.documentElement.style.removeProperty("--sp-sports-frame-h");
  }

  var sportsFrameHeightSignature="";
  var sportsFrameViewportWidth=0;

  function syncSportsIframeHeight(){
    if(!window.matchMedia("(max-width: 768px)").matches||!document.body||!document.body.classList.contains("sp-sports-page")){
      sportsFrameHeightSignature="";
      sportsFrameViewportWidth=0;
      document.documentElement.style.removeProperty("--sp-sports-frame-h");
      return;
    }
    var frame=document.querySelector('[data-mj="page-content"] iframe');
    var bottomNav=document.querySelector('[data-mj="bottom-nav"]');
    if(!frame||!bottomNav) return;

    /* Mobil klavye acilirken yalnizca ekran yuksekligi degisir. Odak spor
       iframe'indeyse mevcut form yuksekligini koru; kupon iki ayri kartmis
       gibi kopmasin ve tutar alani ekranda ziplamasin. */
    if(document.activeElement===frame&&sportsFrameHeightSignature&&Math.abs(window.innerWidth-sportsFrameViewportWidth)<2) return;

    var navTop=bottomNav.getBoundingClientRect().top;
    var current=bottomNav;
    while(current&&current!==document.body){
      var style=getComputedStyle(current);
      var rect=current.getBoundingClientRect();
      if((style.position==="fixed"||style.position==="sticky")&&rect.width>=window.innerWidth*.6&&rect.bottom>=window.innerHeight-12){
        navTop=Math.min(navTop,rect.top);
      }
      current=current.parentElement;
    }

    var frameTop=Math.max(0,Math.round(frame.getBoundingClientRect().top));
    /* Kuponun kendi yüzen düğmesi alt menüye değmesin: Taco düzenindeki
       ayrımı koruyup SarayPasha için yalnızca 10px nefes payı bırak. */
    var available=Math.max(320,Math.floor(navTop-frameTop-10));
    var value=available+"px";
    if(value===sportsFrameHeightSignature) return;
    sportsFrameHeightSignature=value;
    sportsFrameViewportWidth=window.innerWidth;
    document.documentElement.style.setProperty("--sp-sports-frame-h",value);
  }

  var bannerDotsTimer=0;

  function removeHomeBannerExtras(){
    if(bannerDotsTimer){clearInterval(bannerDotsTimer);bannerDotsTimer=0;}
    document.querySelectorAll(".sp-provider-shortcuts,.sp-banner-dots").forEach(function(item){item.remove();});
  }

  function enhanceProviderShortcuts(){
    if(!isHomePage()){removeHomeBannerExtras();return;}
    if(document.querySelector(".sp-provider-shortcuts")) return;
    var banner=document.querySelector('section[data-mj="widget-banner"]');
    if(!banner) return;
    var language=(window.location.pathname.match(/^\/(tr|en)(?:\/|$)/i)||[])[1]||"tr";
    var root=document.createElement("nav");
    root.className="sp-provider-shortcuts";
    root.setAttribute("aria-label","Oyun sağlayıcıları");
    root.innerHTML=
      '<a class="sp-provider-shortcut sp-provider-pragmatic" href="/'+language+'/casino?provider=pragmatic-play"><img src="https://cdn.jsdelivr.net/gh/ceibkese/SarayPashaCasino@main/pragmatic-play-hemen-oyna.png" alt="Pragmatic Play - Hemen Oyna"></a>'+ 
      '<a class="sp-provider-shortcut sp-provider-egt" href="/'+language+'/casino?provider=egt-digital"><img src="https://cdn.jsdelivr.net/gh/ceibkese/SarayPashaCasino@main/egt-digital-bell-link-hemen-oyna.png" alt="EGT Digital Bell Link - Hemen Oyna"></a>'+ 
      '<a class="sp-provider-shortcut sp-provider-amusnet" href="/'+language+'/casino?provider=amusnet"><img src="https://cdn.jsdelivr.net/gh/ceibkese/SarayPashaCasino@main/amusnet-egt-hemen-oyna.png" alt="Amusnet EGT - Hemen Oyna"></a>';
    banner.insertAdjacentElement("afterend",root);
  }

  function enhanceBannerDots(){
    if(!isHomePage()){removeHomeBannerExtras();return;}
    if(document.querySelector(".sp-banner-dots")) return;
    var banner=document.querySelector('section[data-mj="widget-banner"]');
    if(!banner) return;
    var slides=Array.prototype.slice.call(banner.querySelectorAll(".keen-slider__slide"));
    if(slides.length<2) return;
    var dots=document.createElement("div");
    dots.className="sp-banner-dots";
    dots.setAttribute("aria-hidden","true");
    slides.forEach(function(){var dot=document.createElement("i");dot.className="sp-banner-dot";dots.appendChild(dot);});
    banner.insertAdjacentElement("afterend",dots);
    function updateDots(){
      var box=banner.getBoundingClientRect();
      var center=box.left+box.width/2;
      var active=0,nearest=Infinity;
      slides.forEach(function(slide,index){var r=slide.getBoundingClientRect();var distance=Math.abs((r.left+r.width/2)-center);if(distance<nearest){nearest=distance;active=index;}});
      Array.prototype.forEach.call(dots.children,function(dot,index){dot.classList.toggle("sp-banner-dot-active",index===active);});
    }
    updateDots();
    if(bannerDotsTimer) clearInterval(bannerDotsTimer);
    bannerDotsTimer=setInterval(function(){
      if(!document.documentElement.contains(banner)||!document.documentElement.contains(dots)){
        clearInterval(bannerDotsTimer);
        bannerDotsTimer=0;
        return;
      }
      updateDots();
    },500);
  }

  function enhanceAnnouncementBar(){
    document.querySelectorAll(".sp-stable-announcement").forEach(function(item){item.remove();});
    if(!window.matchMedia("(max-width: 768px)").matches){
      return;
    }
    var root=document.querySelector('[data-mj="announcement"]');
    if(!root) return;
    var candidates=root.querySelectorAll("p,span,div");
    var message=null;
    var messageLength=0;
    for(var i=0;i<candidates.length;i++){
      var candidate=candidates[i];
      if(candidate.closest('button,[role="button"]')) continue;
      if(candidate.querySelector('button,[role="button"]')) continue;
      var text=(candidate.textContent||"").replace(/\s+/g," ").trim();
      if(text.length<=messageLength) continue;
      message=candidate;
      messageLength=text.length;
    }
    if(message) message.setAttribute("data-sp-announcement-text","");
  }

  var withdrawalPanelWasOpen=false;
  var depositPanelWasOpen=false;

  function isWithdrawalPanelOpen(){
    return Array.prototype.slice.call(document.querySelectorAll('[role="alertdialog"],form')).some(function(item){
      if(!item.getClientRects||item.getClientRects().length===0) return false;
      var text=normalizeTurkish(item.textContent||"");
      return /PARA\s*CEK|CEKIM/.test(text);
    });
  }

  function isDepositPanelOpen(){
    return Array.prototype.slice.call(document.querySelectorAll('[role="alertdialog"],form')).some(function(item){
      if(!item.getClientRects||item.getClientRects().length===0) return false;
      var text=normalizeTurkish(item.textContent||"");
      return /PARA\s*YATIR|YATIRIM/.test(text);
    });
  }

  function restartAnnouncementMarquee(){
    var lines=document.querySelectorAll('[data-mj="announcement"] p,.sp-stable-announcement p');
    Array.prototype.forEach.call(lines,function(line){
      line.style.setProperty("animation","none","important");
      void line.offsetWidth;
      requestAnimationFrame(function(){line.style.removeProperty("animation");});
    });
  }

  function watchWithdrawalPanel(){
    var open=isWithdrawalPanelOpen();
    if(withdrawalPanelWasOpen&&!open){
      /* Para cekme katmani kapanirken mobil tarayicinin dondurdugu
         duyuru animasyonunu yalnizca bu geciste yeniden baslat. */
      setTimeout(restartAnnouncementMarquee,40);
      setTimeout(restartAnnouncementMarquee,220);
    }
    withdrawalPanelWasOpen=open;
  }

  function watchDepositPanel(){
    var open=isDepositPanelOpen();
    if(depositPanelWasOpen&&!open){
      stopDepositScrollLock();
      setTimeout(restartAnnouncementMarquee,40);
      setTimeout(restartAnnouncementMarquee,220);
    }
    depositPanelWasOpen=open;
  }

  function refresh(){ syncPageMode(); syncSportsIframeHeight(); enhanceDepositFrames(); enhanceBankTransfer(); enhanceWithdrawalFrames(); enhanceBankWithdrawal(); enhance(); enhanceAllTransactionInputs(); enhanceBonusRequestPage(); enhanceQuickActions(); enhanceProviderShortcuts(); enhanceBannerDots(); enhanceAnnouncementBar(); watchWithdrawalPanel(); watchDepositPanel(); continuePendingAction(); }

  function refreshAfterRouteChange(){
    syncPageMode();
    removeHomeBannerExtras();
    setTimeout(refresh,60);
    setTimeout(refresh,260);
  }

  var historyOriginals={};
  ["pushState","replaceState"].forEach(function(method){
    var original=history[method];
    if(typeof original!=="function") return;
    historyOriginals[method]=original;
    var wrapped=function(){var result=original.apply(this,arguments);refreshAfterRouteChange();return result;};
    history[method]=wrapped;
    cleanupFns.push(function(){if(history[method]===wrapped) history[method]=original;});
  });
  listenGlobal(window,"popstate",refreshAfterRouteChange);
  listenGlobal(window,"hashchange",refreshAfterRouteChange);
  listenGlobal(window,"resize",syncSportsIframeHeight);
  listenGlobal(window,"orientationchange",function(){setTimeout(syncSportsIframeHeight,160);});
  listenGlobal(document,"pointerdown",beginNonBankPaymentSwitch,true);

  function markCustomUiReady(){
    var root=document.documentElement;
    if(!root) return;
    root.classList.remove("sp-custom-loading");
    root.classList.add("sp-custom-ready");
    var bootStyle=document.getElementById("sp-critical-loading-style");
    if(bootStyle) setTimeout(function(){bootStyle.remove();},260);
  }

  var refreshObserver=null;
  var maintenanceTimer=0;

  function destroy(){
    stopDepositScrollLock();
    if(refreshObserver){refreshObserver.disconnect();refreshObserver=null;}
    if(maintenanceTimer){clearInterval(maintenanceTimer);maintenanceTimer=0;}
    if(bannerDotsTimer){clearInterval(bannerDotsTimer);bannerDotsTimer=0;}
    while(cleanupFns.length){try{cleanupFns.pop()();}catch(error){}}
    document.querySelectorAll(".sp-provider-shortcuts,.sp-banner-dots,.sp-quick-actions,.sp-copy-toast,.sp-keyboard-page-shield").forEach(function(item){item.remove();});
    document.documentElement.classList.remove("sp-bank-transfer-selected");
    document.documentElement.classList.remove("sp-payment-method-switching");
    paymentSwitchGeneration++;
    document.documentElement.style.removeProperty("--sp-sports-frame-h");
  }

  window[GLOBAL_KEY]={version:VERSION,refresh:refresh,destroy:destroy};

  addStyles(); refresh();
  if(window.requestAnimationFrame){
    requestAnimationFrame(function(){requestAnimationFrame(markCustomUiReady);});
  }else{
    setTimeout(markCustomUiReady,40);
  }
  /* Yukleme sirasinda beklenmeyen bir hata olsa bile arayuz kapali kalmaz. */
  setTimeout(markCustomUiReady,1800);
  var timer=0; refreshObserver=new MutationObserver(function(){ clearTimeout(timer); timer=setTimeout(refresh,100); });
  refreshObserver.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(refresh,700); setTimeout(refresh,1800);
  maintenanceTimer=setInterval(function(){
    syncPageMode();
    syncSportsIframeHeight();
    enhanceAnnouncementBar();
  },500);
  console.info("SarayPasha özel JavaScript yüklendi:",VERSION);
})();
