/**
 * Cálculo de tendência via Médias Móveis Exponenciais
 */
const CONFIG_EMA = {
  '1':   { lambda: 0.5,        norm: 1.0   },
  '2.5': { lambda: 0.757858283, norm: 1.0   },
  '5':   { lambda: 0.870550563, norm: 1.0   },
  '10':  { lambda: 0.933032992, norm: 1.0   },
  '20':  { lambda: 0.965936329, norm: 1.002 },
  '40':  { lambda: 0.982820599, norm: 1.0462 }
};
const PARES_EMA = [[1,5],[2.5,10],[5,20],[10,40]];



class Metodologia {
  static tendencia(precos) {
    if (precos.length !== 180) throw new Error('Requer 180 preços');
    const comps = PARES_EMA.map(([c,l]) => this._sinal(c, l, precos));
    const media = comps.reduce((s,v) => s+v, 0) / comps.length;
    return this._mapear(media);
  }

  static _sinal(curto, longo, precos) {
    const mC = this._ema(precos, curto);
    const mL = this._ema(precos, longo);
    return (mC >= mL) ? 1 : -1;
  }

  static _ema(precos, halfLife) {
    const { lambda, norm } = CONFIG_EMA[halfLife];
    return precos.reduce((sum,p,i) => sum + p * (1-lambda)*Math.pow(lambda, i), 0) * norm;
  }

  static _mapear(v) {
    const x = Number(v.toFixed(2));
    if (x >= 0.75) return 1;
    if (x >= 0.25) return 0.5;
    if (x >= -0.25) return 0;
    if (x >= -0.75) return -0.5;
    return -1;
  }
}

/**
 * Cliente API Coinbase
 */