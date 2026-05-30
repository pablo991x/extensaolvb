// content.js - Versão Minimalista (Apenas Ponte para Sidepanel)
console.log("[FreeLovable] Content Script carregado");

// Injeta o hook para capturar Tokens e Project IDs
(function injectHook(){
  try {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL("pageHook.js");
    s.onload = () => s.remove();
    (document.documentElement || document.head || document.body).appendChild(s);
  } catch (e) {
    console.warn("[FreeLovable] Falha ao injetar pageHook", e);
  }
})();

// Escuta mensagens do pageHook.js
window.addEventListener("message", (event) => {
  try {
    if (event.source !== window) return;
    if (event.data && event.data.type === "lovableTokenFound") {
      const { token, projectId, sourceHost } = event.data;
      
      // Verifica se a extensão ainda está conectada antes de qualquer ação
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        chrome.storage.local.set({ 
          lovable_token: token, 
          lovable_projectId: projectId,
          lovable_sourceHost: sourceHost || ""
        }).catch(() => {});
      }
    }
    // Salva a URL real do endpoint de chat quando interceptada
    if (event.data && event.data.type === "lovableApiUrlFound") {
      const { url, projectId } = event.data;
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        chrome.storage.local.set({ lovable_api_url: url }).catch(() => {});
        console.log("[FreeLovable] URL real da API capturada:", url);
      }
    }
  } catch (e) {
    // Falha silenciosa
  }
});

// Ativa a interceptação automaticamente
setInterval(() => {
  const chatInput = document.querySelector('div[aria-label="Chat input"]');
  if (chatInput && !chatInput.dataset.flIntercepted) {
    chatInput.dataset.flIntercepted = "true";
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const prompt = chatInput.innerText.trim();
        if (prompt) {
          try {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            chatInput.innerHTML = '<p><br></p>';
            
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
              chrome.runtime.sendMessage({
                action: "OFFICIAL_PROMPT_CAPTURED",
                prompt: prompt
              }).catch(() => {});
            }
            
            showCaptureFeedback();
          } catch (err) {
            // Contexto invalidado ou erro de envio - falha silenciosa
          }
        }
      }
    }, true);
  }
}, 2000);

function showCaptureFeedback() {
  // Remove badge anterior se houver
  document.getElementById('fl-capture-toast')?.remove();

  const feedback = document.createElement('div');
  feedback.id = 'fl-capture-toast';
  feedback.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(16, 185, 129, 0.95);
    backdrop-filter: blur(8px);
    color: white;
    padding: 12px 20px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fl-slide-down 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;

  feedback.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Enviado via FreeLovable</span>
    </div>
    <div id="fl-toast-close" style="cursor: pointer; padding: 4px; display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.2); margin-left: 4px;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  `;

  // Estilos de animação
  if (!document.getElementById('fl-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'fl-toast-styles';
    style.textContent = `
      @keyframes fl-slide-down {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes fl-slide-up {
        to { opacity: 0; transform: translate(-50%, -20px); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(feedback);

  const closeToast = () => {
    feedback.style.animation = 'fl-slide-up 0.4s forwards';
    setTimeout(() => feedback.remove(), 400);
  };

  document.getElementById('fl-toast-close').onclick = closeToast;

  // Auto-fechar em 5 segundos
  setTimeout(closeToast, 5000);
}
