const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Caesar Cipher
function caesarCipher(text, shift = 3) {
     return text.split('').map(char => {
          let code = char.charCodeAt(0);

          if (code >= 65 && code <= 90)
               return String.fromCharCode((code - 65 + shift) % 26 + 65);

          if (code >= 97 && code <= 122)
               return String.fromCharCode((code - 97 + shift) % 26 + 97);

          return char;
     }).join('');
}

// AES Encryption
function aesEncrypt(text, key) {
     const cipher = crypto.createCipheriv(
          "aes-256-cbc",
          crypto.createHash("sha256").update(key).digest(),
          Buffer.alloc(16, 0)
     );

     let encrypted = cipher.update(text, "utf8", "hex");
     encrypted += cipher.final("hex");

     return encrypted;
}

// API Route
app.post("/encrypt", (req, res) => {
     const { text, algorithm, key } = req.body;

     if (!text || !algorithm) {
          return res.status(400).json({ error: "Missing input" });
     }

     let result;

     try {
          if (algorithm === "caesar") {
               result = caesarCipher(text);
          }
          else if (algorithm === "aes") {
               if (!key) return res.status(400).json({ error: "Key required" });
               result = aesEncrypt(text, key);
          }
          else if (algorithm === "base64") {
               result = Buffer.from(text).toString("base64");
          }
          else {
               return res.status(400).json({ error: "Invalid algorithm" });
          }

          res.json({ ciphertext: result });

     } catch (err) {
          res.status(500).json({ error: "Encryption failed" });
     }
});

app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
});