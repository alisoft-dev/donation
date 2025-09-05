const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

let donations = { goal: 100, raised: 0 }; // هدف نمونه
let alerts = [];

// API برای گرفتن وضعیت پروگرس
app.get("/api/progress", (req, res) => {
  res.json(donations);
});

// API برای گرفتن آخرین الارت‌ها
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

// Webhook NOWPayments
app.post("/ipn", (req, res) => {
  const data = req.body;
  const amount = parseFloat(data.payment_amount_usd || 0);
  const payer = data.order_description || "Anonymous";

  donations.raised += amount;
  fs.writeFileSync("donations.json", JSON.stringify(donations, null, 2));

  alerts.push({ payer, amount });
  if (alerts.length > 5) alerts.shift();
  fs.writeFileSync("alerts.json", JSON.stringify(alerts, null, 2));

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
