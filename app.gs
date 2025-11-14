'use strict';

/**
 * Configurações principais
 */

// Top por marketcap disponivel na api usada (DYDX)
const CONFIG = {
  TOKENS: [
    'BTC',
    'ETH',
    'SOL' ,
    'DOGE',
    "PAXG",
  ],
  
  RECIPIENT_EMAILS: [
   /////// adm
  "daniel.10007959931@gmail.com",
   ////////// user genesis
  "annemann.neto@gmail.com",
  "wagnercp@whbbrasil.com.br", 
  "huancpt01@gmail.com",
  "davi.araujo0813@gmail.com",
  "concursosmarcos097@gmail.com",
  "Magnum.acs@gmail.com",
  "gorniakric@gmail.com",
  ],

  EMAIL_SUBJECTS: {
    default: '  INDICADOR DIRECIONAL TRADER',
    warn:    '⚠️ INDICADOR DIRECIONAL TRADER',
    success: '⭐ INDICADOR DIRECIONAL TRADER'
  }
};

/**
 * Ponto de entrada manual
 */
function start() {
  //Cache.resetCache();
  App.start();
}

/**
 * Classe principal do app
 */
class App {
  static start() {
    // Carrega ou inicializa ativos
    let ativos = Cache.loadAtivosCache() || Cache.inicializaAtivos(CONFIG.TOKENS);

    // Obter dados de preços e processar
    this.fetchPrices(ativos);
    this.computeTrends(ativos);
    this.applyStrategy(ativos);

    // Enviar notificações e salvar cache
    Email.enviar(ativos);
    Cache.saveAtivosCache(ativos);
   //////
   ////robo
   //enviarTeste(ativos);
   //runCycle();

    // Log para depuração
    ativos.forEach(a => {
      Print.console(`Ativo: ${a.nome}`);
      Print.console(`Preços (${a.precos.length}): ${a.precos}`);
      Print.console(`Tendências: ${a.tendencias}`);
      Print.console(`Estratégia: ${a.estrategia}`);
      Print.console(`Status: ${a.status}`);
      Print.console('------------');
    });
  }

  /**
   * Busca preços de cada ativo via API
   */
  static fetchPrices(ativos) {
    ativos.forEach((ativo, i) => {
      ativo.precos = ApiDxDy.precos(ativo.nome);
      Utilities.sleep(1000); // pausa 1s evitando bloqueio
    });
  }

  /**
   * Calcula tendência para cada ativo
   */
  static computeTrends(ativos) {
    ativos.forEach(ativo => {
      ativo.tendencias.push(Metodologia.tendencia(ativo.precos));
    });
  }

  /**
   * Aplica estratégia direcional e atualiza status
   */
  static applyStrategy(ativos) {
    ativos.forEach(ativo => {
      const anterior = ativo.estrategia;
      const atual    = Estrategia.direcional(ativo.tendencias);
      ativo.estrategia = atual;

      // " " sem mudança, ⭐ mudança detectada
      ativo.status = (atual === anterior) ? ' ' : '⭐';
    });
  }
}
