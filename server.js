const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 1. KONFIGIRASYON BOUS LA (SOU RENDER SÈLMAN)
// ----------------------------------------------------
// Kòd la ap li 12 mo yo nan Environment Variable sou Render
const MNEMONIC = process.env.MNEMONIC;

let wallet;
if (MNEMONIC) {
  try {
    wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
    console.log("Bous pou retrè otomatik aktif. Adrès:", wallet.address);
  } catch (error) {
    console.error("Erè nan konfigirasyon bous la:", error.message);
  }
} else {
  console.log("Mennonnik pa defini sou Render. Retrè otomatik desaktive.");
}

// ----------------------------------------------------
// 2. ROUTE PRENSIPAL
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Sèvè ApexTrade Pro aktif",
    walletConfigured: !!wallet
  });
});

// ----------------------------------------------------
// 3. ROUTE POU RETRÈ OTOMATIK
// ----------------------------------------------------
app.post('/api/transaction', async (req, res) => {
  try {
    const { userId, type, amount, destinationAddress } = req.body;

    // Tcheke si demann lan gen adrès ak montan
    if (!amount || !destinationAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Manke montan oswa adrès pou retrè a." 
      });
    }

    // Si se yon demann retrè
    if (type === 'retrait') {
      if (!wallet) {
        return res.status(500).json({ 
          success: false, 
          message: "Bous la pa konfigire sou sèvè a." 
        });
      }

      // Kòd sa a ap sèlman egzekite LÈ gen yon demann klè ki rive sou route sa a
      console.log(`Demann retrè ${amount} USDT pou adrès ${destinationAddress}`);

      return res.status(200).json({
        success: true,
        message: `Demann retrè valab. Peman anrejistre pou ${destinationAddress}`,
        details: { userId, amount, destinationAddress }
      });
    }

    // Si se yon lòt kalite aksyon (egzanp depo)
    res.status(200).json({
      success: true,
      message: "Demann trete ak siksè."
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
  console.log(`Sèvè a ap kouri sou pòt ${PORT}`);
});
