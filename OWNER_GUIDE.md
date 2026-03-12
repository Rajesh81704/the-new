# 🌟 Magically Super — Complete Role & Feature Guide

> **Platform:** Multi-Tenant Professional Networking SaaS  
> **3 Roles:** Super Admin · Company Admin · Member (User)  
> **3 Portals:** `admin.*` · `company.*` · `user.*`

---

## 🔐 Role Overview — Ek Nazar Mein

| Role | Kaun hai? | Kahan login karta hai? | Kitne ho sakte hain? |
|---|---|---|---|
| **🛡️ Super Admin** | Platform ka maalik (aap) | `admin.yourdomain.com` | Sirf 1 (ya kuch trusted admins) |
| **🏢 Company Admin** | Har company ka manager | `company.yourdomain.com` | Har company mein 1 |
| **👤 Member / User** | Company ke normal members | `user.yourdomain.com` | Unlimited (per company plan) |

---

# 🛡️ SUPER ADMIN — Poori Powers

> Yeh platform ka GOD MODE hai. Koi bhi company admin ya user ke upar ye hote hain.

## Super Admin kya kya kar sakta hai?

### 🏢 Company Management (Poora Control)
- **Nayi company banana** — Name, subdomain, admin email, admin password set karke company create karo
  - Auto-generated Company Code milta hai (e.g., `TECHNETINDIA2026`) — members ise login ke liye use karte hain
  - Subdomain auto-generate hota hai company name se
- **Company edit karna** — Name, subdomain badal sakte ho
- **Company delete karna** — Company aur uska saara data hatao
- **Company suspend/activate karna** — Kisi bhi company ko band ya chalu karo ek click mein
- **Saari companies search karna** — Naam se filter karke dhundo
- **Har company ki real-time stats dekhna:**
  - Current members count vs max limit (progress bar ke saath)
  - Billing amount aur cycle
  - Kitne modules active hain
  - Company creation date
  - Domain / subdomain
  - Company ka status (Active / Suspended)

### 🪄 Company Admin Impersonation (Superpower)
- **"Enter Panel" button** — Kisi bhi company ke admin ki jagah login ho jao
  - Pehle apna super admin token save hota hai `superAdminToken` mein
  - Phir us company ka admin token set ho jaata hai
  - Directly company admin panel mein pahunch jaate ho
- **Back aa sakte ho** — Admin layout mein wapas super admin mein switch karo
- Kisi bhi company ki problem troubleshoot karne ke liye bohot useful hai

### 🔑 Admin Password Reset
- Kisi bhi company admin ka password reset karo — system ek naya temporary password generate karta hai (`CompanyName@1234` format mein)
- Popup mein naya password dikhta hai — copy karke admin ko bhejo

### 📦 Modules Control (Per Company)
- Har company ke liye alag alag modules on/off kar sakte ho during creation/edit:
  - Members Management
  - Events
  - Podcasts
  - Blogs
  - Resources
  - Friend System
  - News Feed
  - Messaging
  - Analytics
  - Settings
  - Membership Plans
- Jis company ke liye jitne modules on, sirf wahi features unke users ko dikhenge

### 💳 Billing & Subscriptions
- Har company ki subscription status manage karo: **ACTIVE**, **PAST_DUE**, **FROZEN**
- Subscription update karo — plan name, expiry date set karo
- Total platform revenue ek nazar mein dekho (saari companies ka sum)
- Package-based billing: monthly, quarterly, annual cycles

### 📦 Package / Plan Management
- Apne khud ke billing packages create karo:
  - Package ka naam (e.g., Starter, Pro, Enterprise)
  - Amount (₹ mein)
  - Billing cycle (monthly/quarterly/annual)
  - Package activate/deactivate karo
- Company create karte waqt koi bhi ek package assign karo

### 📝 Company Applications
- Log in platform join karne ke liye apply kar sakte hain
- Super Admin application dekh sakta hai
- Approve ya reject kar sakta hai

### 📊 Dashboard — Platform-wide Stats
- Total companies on platform
- Total users across all companies
- Revenue overview
- Pending applications count

### ⚙️ Super Admin Settings
- Platform ka naam badlo
- Super admin account configure karo
- Platform-level settings

---

# 🏢 COMPANY ADMIN — Company Ka Maalik

> Har company ka ek admin hota hai. Unhe sirf apni company ka data dikhta hai — doosri companies nahi.

## Company Admin kya kya kar sakta hai?

### 📊 Dashboard
- Company ke total members count
- Active events count
- Blog posts count
- Recent activity summary

### 👥 Member Management — Poora Control

**Members dekhna:**
- Apni company ke saare members ki list
- Naam, email, role, aur creation date ke saath

**Naya member banana:**
- Email, first name, last name enter karo
- Role assign karo: MEMBER ya ADMIN
- Custom password set karo (default: `Member@123`)
- Duplicate email check hota hai — same email dobara register nahi hoga

**Member edit karna:**
- Naam, email, role badal sakte ho

**Member delete karna:**
- Company se member hatao

**Member impersonation (Login As Member):**
- Kisi bhi member ki jagah login ho jao
- Unka user portal dekhne ke liye useful — support purpose
- Pehle admin token save hota hai, badmein wapas aa sakte ho

**Admin Password Reset:**
- Kisi bhi member ka password reset karo
- System auto-generate karta hai naya password (`CompanyName@XXXX` format)

### 📅 Event Management
- **Event banana:** Title, description, date/time, location
- **Event edit karna**
- **Event delete karna**
- Saare published events company ke members ko dikhte hain

### 🎙️ Podcast Management
- **Podcast banana:** Title, description, audio URL
- **Status:** Published (members ko dikhta hai) ya Draft (chhupa ke rakho)
- **Edit/Delete** karo

### 📰 Blog Management
- **Blog banana:** Title, description, full content (rich text)
- **Status:** Published ya Draft
- **Edit/Delete** karo
- Blog detail page bhi hai members ke liye

### 📁 Resource Library
- **Resource banana:** Title, description, URL link
- **Status:** Published ya Draft
- **Edit/Delete** karo

### 💎 Membership Plans
- Company-specific membership tiers banana
- Plan features aur pricing set karo

### ⚙️ Company Settings — 4 Tabs

**1. Branding Tab:**
- Company logo upload karo (PNG/SVG/JPG, max 5MB)
- Logo VPS par save hota hai (deployments ke baad bhi safe rehta hai)
- Members ke header mein logo dikhne lagta hai

**2. Domain Settings Tab:**
- Custom domain connect karo (e.g., `community.yourcompany.com`)
- DNS records (CNAME) instructions milte hain
- Portals: Login, Shop, Community, Finance, Admin Console

**3. Payment Gateways Tab — 6 Options:**
| Gateway | Use |
|---|---|
| 💳 Razorpay | India ka leading payment gateway |
| 🌐 Stripe | Global payments |
| 📱 PhonePe | UPI & wallet |
| ⚡ Cashfree | Next-gen payments |
| ₹ PayU India | All-in-one |
| 🏦 CCAvenue | Traditional banking |
- OAuth popup se connect karo — manual API keys ki zarurat nahi
- Disconnect bhi kar sakte ho

**4. Invoice Settings Tab:**
- Invoice template configure karo
- Company name, address, GST number, logo
- Default subscription amount set karo
- Live preview milta hai

---

# 👤 MEMBER (USER) — Normal Member Ki Powers

> Har company ka member sirf apni company ka data dekh sakta hai. Doosri companies ka kuch nahi dikhta.

## Member kya kya kar sakta hai?

### 🔐 Login / Auth
- **Login:** Email + Password + Company ID (company code) — teen cheez chahiye
- **Forgot Password:** Email pe secure reset link milta hai (1 ghante valid)
- **Reset Password:** Token se naya password set karo
- **Auto-logout:** Session expire hone par automatic logout

### 📰 My Feed (Social Posts)
- Company ke baaki members ke posts dekhna
- Nayi post banana (text + optional media/image)
- Real-time activity stream

### 👤 My Profile — Poora Edit Karo
- **Naam:** First name, last name
- **Avatar/Photo:** Profile picture
- **Bio:** Apne baare mein likhna
- **Headline:** Professional tagline (e.g., "CEO at TechCo")
- **City:** Shahar
- **Category:** Industry/category
- **Website:** Personal/company website URL
- **Metadata:** Additional info

### 🤝 Connections (Networking — Dosti System)

**My Connections tab:**
- Apne saare accepted connections ki list
- Naam, role, company ke saath
- Profile pe click karke unka profile dekho
- **Remove connection** option (dropdown mein)

**Requests tab:**
- **Incoming requests:** Baad mein kisi ne request bheja — Accept / Decline karo ek click mein
- **Sent requests:** Aapne jisko request bheja — Cancel bhi kar sakte ho
- **Pending count badge** — kitne requests pending hain

**Discover tab:**
- Company ke baaki members browse karo
- **Filtering:** Auto-filtered — self nahi dikhta, already connected nahi dikhte, pending requests wale nahi dikhte
- **Connect button** — request bhejo
- Pending request bheja toh button "Pending" ho jaata hai (grey, disabled)

### 📅 Events
- Company ke saare upcoming events dekho
- Event details: title, description, date/time, location

### 🎙️ Podcasts
- Company ke published podcasts browse karo
- Title, description, audio link dekho

### 📰 Blogs
- Company ke published blogs read karo
- Blog listing page + full blog detail page alag se

### 📁 Resources
- Company ka resource library access karo
- Documents, links, files download/view karo

### 👥 Members Directory
- Company ke saare members browse karo
- Naam, role, avatar ke saath
- Unka profile dekho

### 💳 My Invoices
- Personal billing history aur invoices dekho

### 🪪 Business Card & Sharing
- **Digital business card** generate karo
- **QR code** se share karo
- **Public URL** — kisi ko bhi apna profile share karo (login ke bina bhi dekh sakte hain)
- `PublicCardPage` — publicly accessible profile view

---

# 🔒 Kya Kar Sakta Hai, Kya Nahi — Complete Table

| Action | 🛡️ Super Admin | 🏢 Company Admin | 👤 Member |
|---|:---:|:---:|:---:|
| **Platform** ||||
| Saari companies dekho | ✅ | ❌ | ❌ |
| Nayi company banana | ✅ | ❌ | ❌ |
| Company delete karo | ✅ | ❌ | ❌ |
| Company suspend/activate | ✅ | ❌ | ❌ |
| Billing packages manage | ✅ | ❌ | ❌ |
| Platform revenue dekho | ✅ | ❌ | ❌ |
| Modules toggle karo | ✅ | ❌ | ❌ |
| **Impersonation** ||||
| Company admin ke roop mein login | ✅ | ❌ | ❌ |
| Member ke roop mein login | ✅ | ✅ | ❌ |
| Admin password reset karo | ✅ | ❌ | ❌ |
| Member password reset karo | ✅ | ✅ | ❌ |
| **Content** ||||
| Events banana/edit/delete | ✅ | ✅ | ❌ |
| Blogs banana/edit/delete | ✅ | ✅ | ❌ |
| Podcasts banana/edit/delete | ✅ | ✅ | ❌ |
| Resources banana/edit/delete | ✅ | ✅ | ❌ |
| Events/Blogs/Podcasts/Resources dekhna | ✅ | ✅ | ✅ |
| Post banana (social feed) | ❌ | ❌ | ✅ |
| **Members** ||||
| Member banana/edit/delete | ✅ | ✅ | ❌ |
| Members directory dekhna | ✅ | ✅ | ✅ |
| **Networking** ||||
| Connection request bhejo | ❌ | ❌ | ✅ |
| Connection accept/reject | ❌ | ❌ | ✅ |
| Connections dekho | ❌ | ❌ | ✅ |
| Discover (new people) | ❌ | ❌ | ✅ |
| **Profile** ||||
| Apna profile edit karo | ❌ | ❌ | ✅ |
| Kisi ka bhi profile dekho | ✅ | ✅ | ✅ |
| Business card share karo | ❌ | ❌ | ✅ |
| **Settings** ||||
| Company logo upload | ❌ | ✅ | ❌ |
| Custom domain connect | ❌ | ✅ | ❌ |
| Payment gateway connect | ❌ | ✅ | ❌ |
| Invoice template configure | ❌ | ✅ | ❌ |
| Membership plans banana | ❌ | ✅ | ❌ |
| **Billing** ||||
| Subscription status manage | ✅ | ❌ | ❌ |
| Apna invoice dekhna | ❌ | ❌ | ✅ |

---

# 🌐 Multi-Tenancy — Isolation Ka Niyam

> **Rule #1:** Company A ka koi bhi data Company B ko kabhi nahi dikhega.

- Har company ka **apna subdomain** (e.g., `technet.yourdomain.com`)
- Har company ka **optional custom domain** (e.g., `community.technet.com`)
- Har company ka **unique Company Code** (members login ke liye)
- Database level par `companyId` se poora data isolate hai
- Ek email multiple companies mein ho sakta hai — login mein Company Code se identify hota hai

---

# 🎨 Branding System

| Level | Kya control karte hain |
|---|---|
| **Platform level** | Super Admin — platform ka naam, overall look |
| **Company level** | Company Admin — company logo upload |
| **Login page** | Auto-detect karta hai subdomain aur relevant message dikhata hai |

- **user.\*** portal pe login → "Member Login Portal" message
- **company.\*** admin pe login → "Company Admin Portal" message  
- **admin.\*** pe login → "Super Admin Portal" message

---

# 📱 Platform Compatibility

- **Web App** — Browser mein kaam karta hai (desktop + mobile)
- **PWA** — Phone mein install kar sakte hain (Android + iOS)
- **Capacitor Android** — Native Android APK bhi available hai
- **Responsive Design** — Mobile, tablet, desktop — sabpe kaam karta hai

---

# 🔑 Login Credentials Summary

| Portal | URL | Required |
|---|---|---|
| Super Admin | `admin.yourdomain.com` | Email + Password (No Company Code) |
| Company Admin | `company.yourdomain.com` | Email + Password + Company Code |
| Member | `user.yourdomain.com` | Email + Password + Company Code |

> **Note:** Company Code aap (Super Admin) company create karte waqt auto-generate hota hai. Usse copy karke company admin ko dete hain.
