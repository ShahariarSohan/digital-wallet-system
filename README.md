# 💳 ePay – Digital Wallet API

A **secure, modular, and role-based backend API** for a digital wallet system – inspired by **Bkash/Nagad**.  
Built with **Express.js + Mongoose** following enterprise-grade architecture.

🚀 Designed to demonstrate **real-world financial operations**: authentication, wallet management, and transactions.

---

## ✨ Core Features

- 🔐 JWT Authentication + Role-based Access (`Admin | User | Agent`)
- 🏦 Wallet auto-creation with initial balance
- 💰 Transactions: Add Money | Withdraw | Send Money
- 🧾 Transaction history tracking
- 👮 Admin controls: Block/unblock wallets, Approve agents
- ⚡ Atomic balance updates for secure operations

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT, bcrypt
- **Architecture:** Modular, layered, REST API
- **Verification:** OTP
- **ImageUpload:** Multer,Cloudinary

---

## Apis

👉 [Necessary Apis Here](./apis/endpoints.md)

---

## Case Study

👉 [Multiple MongoDB Collection Problem](./caseStudies/multipleCollection.md)

---

## 📸 Demo

👉 [Test Endpoints In Postman](./epay.postman_collection.json)

---

## 🚀 Quick Start

```bash
git clone https://github.com/ShahariarSohan/digital-wallet-system.git
cd epay-api
npm install
npm run dev
```
