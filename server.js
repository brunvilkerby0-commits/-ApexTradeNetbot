const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 1. KONFIGIRASYON KLE SEKRÈ (12 MO TRUST WALLET)
// ----------------------------------------------------
const MNEMONIC = process.env.MNEMONIC || "broom comic render raw admit opera liquid bottom ecology ordinary ten more";
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";

// Kreye Bous la ak 12 mo yo
let wallet;
try {
  wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
  console.log("Bous la konfigire ak siksè. Adrès la se:", wallet.address);
} catch (error) {
  console.error("Gen yon erè nan konfigirasyon bous la:", error.message);
}

// ----------------------------------------------------
// 2. ROUTE PRENSIPAL POU TCHEKE SÈVÈ A
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Sèvè Backend ApexTrade Pro ap kouri san pwoblèm",
    walletAddress: wallet ? wallet.address : "Pa konfigire"
  });
});

// ----------------------------------------------------
// 3. ROUTE POU TRANZAKSYON (DEPO / RETRÈ)
// ----------------------------------------------------
app.post('/api/transaction', async (req, res) => {
  try {
    const { userId, type, amount, destinationAddress } = req.body;

    if (!amount || !destinationAddress) {
      return res.status(400).json({ success: false, message: "Mank montan oswa adrès." });
    }

    // Trete demann lan
    res.status(200).json({
      success: true,
      message: `Tranzaksyon ${type || 'retrait'} anrejistre ak siksè.`,
      details: {
        userId: userId || "anonyme",
        amount,
        destinationAddress,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 4. LANSE SÈVÈ A
// ----------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Sèvè a kòmanse kouri sou pòt ${PORT}`);
});
