function calculateWyckoff(data) {
    try {
      const wyckoffIndicator = [];
  
      const closes = data.map(d => (parseFloat(d.bid.c) + parseFloat(d.ask.c)) / 2);
      const volumes = data.map(d => d.volume);
  
      let support = Infinity;
      let resistance = -Infinity;
  
      // Calculate Support/Resistance and Volume Trends
      closes.forEach((close, i) => {
        support = Math.min(support, close);
        resistance = Math.max(resistance, close);
  
        const volume = volumes[i];
        const phase =
          close < support + (resistance - support) * 0.25
            ? "Accumulation"
            : close > resistance - (resistance - support) * 0.25
            ? "Distribution"
            : "Neutral";
  
        wyckoffIndicator.push({
          Close: close,
          Support: support,
          Resistance: resistance,
          Phase: phase,
          Volume: volume
        });
      });
  
      return wyckoffIndicator;
    } catch (error) {
      console.error("Error calculating Wyckoff Indicator:", error);
      throw error;
    }
  }
  
  module.exports = { calculateWyckoff };
  