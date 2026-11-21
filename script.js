// Ano automático no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Quando você criar o webhook no n8n (ex: https://n8n.ritmolab.com.br/webhook/contato),
// basta colar a URL aqui! Enquanto estiver vazio, o formulário envia direto pro WhatsApp.
const N8N_WEBHOOK_URL = '';

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: form.nome.value.trim(),
    empresa: form.empresa.value.trim(),
    whatsapp: form.whatsapp.value.trim(),
    email: form.email.value.trim(),
    mensagem: form.mensagem.value.trim(),
    origem: 'ritmolab.com.br',
    timestamp: new Date().toISOString(),
  };

  if (N8N_WEBHOOK_URL) {
    statusEl.textContent = 'Enviando sua solicitação...';
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha ao enviar');
      statusEl.textContent = 'Recebido! Em breve entraremos em contato pelo WhatsApp.';
      form.reset();
    } catch {
      statusEl.textContent = 'Não foi possível enviar agora. Redirecionando para o WhatsApp...';
      abrirWhatsApp(data);
    }
  } else {
    statusEl.textContent = 'Abrindo WhatsApp com sua mensagem preenchida...';
    abrirWhatsApp(data);
  }
});

function abrirWhatsApp(data) {
  const texto = `Olá, RitmoLab! Sou ${data.nome} da empresa ${data.empresa}.\nEmail: ${data.email}\nDesafio: ${data.mensagem}`;
  const url = `https://wa.me/5541992247130?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
}
