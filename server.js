const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// CoinGecko API endpoint for crypto prices
app.get('/api/price', async (req, res) => {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'CoinGecko API key not configured' });
    }

    // Fetch BTC and ETH prices from CoinGecko
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum',
        vs_currencies: 'usd',
        include_24hr_change: true
      },
      headers: {
        'x-cg-demo-api-key': apiKey
      }
    });

    const data = response.data;

    // Format response
    const prices = {
      BTC: {
        price: data.bitcoin.usd,
        change_24h: data.bitcoin.usd_24h_change
      },
      ETH: {
        price: data.ethereum.usd,
        change_24h: data.ethereum.usd_24h_change
      }
    };

    res.json(prices);
  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch crypto prices' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CoinGecko API key configured: ${process.env.COINGECKO_API_KEY ? 'Yes' : 'No'}`);
});
