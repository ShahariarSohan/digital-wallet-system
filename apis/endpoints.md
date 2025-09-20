# ePay Digital Wallet API – Key Endpoints

## 🌐 Base URL
[https://epay-wallet-server.vercel.app/api/v1](https://epay-wallet-server.vercel.app/api/v1)


## > For local development:
[http://localhost:5000/api/v1](http://localhost:5000/api/v1)


---

## 📋 Core API Endpoints

| Endpoint                      | Method | Role      | Description                     |
|-------------------------------|--------|-----------|---------------------------------|
| `/user/register`              | POST   | Public    | Register a new user             |
| `/agent/apply`                | POST   | Public    | Agent applies for approval      |
| `/auth/login`                 | POST   | Public    | Login & receive JWT             |
| `/wallet/deposit`             | POST   | User      | Deposit money into wallet       |
| `/wallet/withdraw`            | POST   | User      | Withdraw money from wallet      |
| `/wallet/send`                | POST   | User      | Send money to another user      |
| `/wallet/cashIn`              | POST   | Agent     | Add money to user wallet        |
| `/wallet/cashOut`             | POST   | Agent     | Withdraw money from user wallet |
| `/transaction/me`             | GET    | User      | View own transaction history    |
| `/agent/update/:id`           | PATCH  | Admin     | Update agent status/details     |
| `/transaction`                | GET    | Admin     | View all transactions           |
