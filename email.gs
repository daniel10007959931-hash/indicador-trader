/**
 * Comunicação por email - Versão Minimalista Aprimorada
 */
class Email{
  static enviar(ativos) {
    const now = Utilities.formatDate(new Date(), 'GMT-3', 'dd/MM/yyyy HH:mm');
    
    // Determina assunto conforme status
    const hasWarn  = ativos.some(a => a.status === '⚠️');
    const hasPatch = ativos.some(a => a.status === '⭐');
    const subject  = hasWarn ? CONFIG.EMAIL_SUBJECTS.warn
                     : hasPatch ? CONFIG.EMAIL_SUBJECTS.success
                     : CONFIG.EMAIL_SUBJECTS.default;

    const emojis = { comprar: '🟢', vender: '🔴', fechar: '🟡' };
    
    // Cabeçalho clean
    let body = `Análise: ${now}\n\n`;
    
    // Lista direta de ativos
    ativos.forEach(a => {
      const emo = emojis[a.estrategia] || '⚠️';
      body += `${emo} ${a.nome.toUpperCase()} ${a.estrategia.toUpperCase()}\n`;
    });

    // Assinatura minimalista com links e PIX
    body += "\n\n🔍Desenvolvedor  |  Daniel Mota de Aguiar Rodrigues\n";
    body += "✉️ Email:\n daniel.10007959931@gmail.com\n";
    body += "📞 WhatsApp:\n https://wa.me/5541984439025\n";
    body += "👔 LinkedIn:\n https://linkedin.com/in/daniel-mota-de-aguiar-rodrigues-16b73a165\n";
    body += "💳 Chave PIX:\n 100.079.599-31\n\n";
    body += "⚠️ ATENÇÃO: Este relatório contém análises técnicas para fins informativos.\n";
    body += "Não constitui aconselhamento financeiro.";

    CONFIG.RECIPIENT_EMAILS.forEach(email => {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: body
      });
    });
    Logger.log(`Relatório enviado: ${now}`);
  }
}