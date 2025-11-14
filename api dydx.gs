class ApiDxDy {
  static precos(sym) {
    // Formata o par de mercado, ex: BTC-USD
    const pair = `${sym.toUpperCase()}-USD`;

    // Datas ISO para um intervalo de 180 dias
    const nowIso = new Date().toISOString();
    const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const startIso = startDate.toISOString();

    // Base URL da Indexer API dYdX (mainnet)
    const baseURL = 'https://indexer.dydx.trade/v4';

    // Monta a URL com parâmetros: resolução diária, intervalo e limite de 180 velas
    const url = `${baseURL}/candles/perpetualMarkets/${pair}` +
      `?resolution=1DAY&fromISO=${encodeURIComponent(startIso)}` +
      `&toISO=${encodeURIComponent(nowIso)}` +
      `&limit=180`;

    const resp = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      muteHttpExceptions: true
    });

    if (resp.getResponseCode() !== 200) {
      throw new Error(`Erro na API dYdX: ${resp.getResponseCode()}`);
    }

    const body = JSON.parse(resp.getContentText());
    const candles = body.candles;
    if (!Array.isArray(candles) || candles.length === 0) {
      throw new Error('Sem dados históricos na dYdX');
    }

    // Extrai o preço de fechamento ("close") de cada vela
    return candles.map(c => {
      const close = Number(c.close);
      if (isNaN(close) || close <= 0) {
        throw new Error('Dado inválido na dYdX');
      }
      return close;
    });
  }
}