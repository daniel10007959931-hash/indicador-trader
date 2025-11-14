/**
 * Estratégia direcional
 */
class Estrategia {
  static direcional(L) {
    if (!Array.isArray(L) || L.length < 2) return 'fechar';
    const y = L[L.length-1];
    for (let i=L.length-2; i>=0; i--) {
      const x = L[i];
      if (x !== y) return this._trans[x][y] || 'fechar';
    }
    return 'fechar';
  }
}

Estrategia._trans = {
  '-1':   {'-0.5':'fechar','0':'fechar','0.5':'comprar','1':'comprar'},
  '-0.5': {'-1':'vender','0':'fechar','0.5':'comprar','1':'comprar'},
  '0':    {'-1':'vender','-0.5':'vender','0.5':'comprar','1':'comprar'},
  '0.5':  {'-1':'vender','-0.5':'vender','0':'fechar','1':'comprar'},
  '1':    {'-1':'vender','-0.5':'vender','0':'fechar','0.5':'fechar'}
};
