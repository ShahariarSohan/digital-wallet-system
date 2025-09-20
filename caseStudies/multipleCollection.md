## 🧠 Problem Statement – Role Management & Collections
Initially, I designed separate MongoDB collections for `users`, `agents`, and `admins`.  
This worked fine for basic CRUD, but when I tried to implement **Google OAuth login**,  
I realized a **serious problem**:

- Google returns a single user identity (no concept of role).
- With multiple collections, I would have to **duplicate logic** and add role handling manually.
- This approach was **unrealistic and hard to scale** for a real-world system.

### 🚩 Key Learning
I recognized why **enterprise companies (Meta, YouTube, Netflix, Google)** use a **single collection with discriminators or role fields**.  
It simplifies authentication, avoids duplication, and scales with new roles in the future.

### ✅ Decision
For now, I kept separate collections to **show my implementation skills**.  
But in the future, I plan to **merge them into a single collection** (with role-based discrimination)  
to demonstrate my **engineering mindset and ability to evolve architecture**.
