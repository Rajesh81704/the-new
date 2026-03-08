# ConnectPro - Client Roles & Permissions Guide (Hinglish)

Yeh document explain karta hai ki **ConnectPro** platform kaise kaam karta hai, aur isme kitne types ke users (roles) hain, aur har user ko kya-kya permissions hain.

## 🏢 System Architecture (Multi-Tenant Model)

ConnectPro ek B2B2C (Business-to-Business-to-Consumer) platform hai. Iska matlab yeh sirf ek single social network nahi hai, balki isme client apni khud ki **independent community/company** bana sakte hain.

1. **Main Platform:** Jo log software own karte hain (SaaS Founders).
2. **Clients (Companies):** Businesses jo subscription buy karte hain taaki unhe unki khud ki private network/community mil sake (apne custom domain ke sath).
3. **End Users (Members):** Wo log jo kisi ek particular company ki network mein account banate hain.

---

## 👥 User Roles & Permissions ki Hierarchy

ConnectPro database mein **3 alag levels** ke users hote hain:

### 1. 👑 Super Admin (Platform Owner)
**Yeh kaun hain:** ConnectPro software ke owners/creators.
**Access:** Inke pass ek global dashboard hota hai (`/super-admin`). Yeh kisi ek company se belong nahi karte, yeh saari companies ko manage karte hain.

**Permissions:**
- ✅ **Company Management:** Nayi companies/clientes create karna, unka data dekhna, ya kisi company ko delete/suspend karna.
- ✅ **Billing Management:** Stripe ke through subscription plans (Basic, Pro, Enterprise) set karna.
- ✅ **Module Control:** Decide karna ki kis company ko konsa feature dena hai (e.g. kisi ko podcast module dena, kisi ko nahi) based on unka plan.
- ✅ **Subscription Freezing:** Agar kisi company ka subscription expire ho jata hai aur 5 din ka grace period cross ho jata hai, toh us company ka account automatically freeze ho jata hai.
- ❌ **Restrictions:** Inka kaam infrastructure aur billing manage karna hai, toh ideally yeh kisi company ke andhar ke private messages ya unke daily posts interfere nahi karte.

---

### 2. 🛡️ Company Admin (The Client)
**Yeh kaun hain:** Yeh wo clients hain jo subscription pay karte hain. Yeh apni community ya private network ke managers hote hain.
**Access:** Inko apna ek corporate dashboard (`/admin`) milta hai. Yeh sirf aur sirf apni hi Company (`companyId`) ka data dekh sakte hain.

**Permissions:**
- ✅ **Community Setup:** Apni community ka naam, logo, aur custom domain set karna.
- ✅ **Member Management:** Apni network ke saare members dekhna, unko block karna, delete karna, ya naye members ko approve karna.
- ✅ **Events Management:** Apni community ke liye offline/online events create karna jisme members RSVP kar sakein.
- ✅ **Content Management:** Blogs, Podcasts aur Resources (files/documents) upload karna jo sirf unke members consume kar sakein.
- ✅ **Legal:** Apni community ke liye specific Terms and Conditions aur Privacy Policy add karna.
- ❌ **Restrictions:** Multi-tenant architecture ki wajah se, yeh dusri companies ka data, unke members ya unke posts bilkul access nahi kar sakte. Unka control strictly unke apney group tak limited hai.
- ❌ **Restrictions:** Agar inka subscription expire ho jaye (aur 5 din se zyada ho), toh inka admin panel lock ho jayega jab tak renewal nahi hota.

---

### 3. 👤 Member (End User)
**Yeh kaun hain:** Normal users, employees, ya customers jo kisi particular Company ke network join karte hain.
**Access:** Yeh public app ya feed (`/`) interface use karte hain.

**Permissions:**
- ✅ **Public Profile:** Apna public profile, bio, display picture aur digital business card (`/my-profile`) setup karna.
- ✅ **Feed Interaction:** Social feed (`/`) pe posts, text aur images upload karna. Apne network ke dusre members ke posts par like aur comment karna.
- ✅ **Content Consumption:** Company Admin ne jo bhi Blogs, Podcasts ya Events daale hain, unhe dekhna aur participate karna.
- ✅ **Networking:** Community mein dusre members ki profile (`/card/:id`) dekhna aur unse "connect" karke friends banana (`/friends`).
- ❌ **Restrictions:** Inke paas koi bhi admin panel ka access nahi hota. Yeh nayi events create nahi kar sakte, podcast upload nahi kar sakte, ya community ke rules change nahi kar sakte. Yeh sirf socialize aur consume karte hain.

---

## 🔄 Daily Workflow Kaise Chalta Hai?

1. **Client Acquisition:** Ek client ConnectPro pe aata hai aur subscription buy karta hai.
2. **Super Admin Setup:** Super admin us account ko approve karta hai aur "Company A" database me live ho jati hai.
3. **Admin Setup:** Client (Company Admin) login karta hai. Apni branding (logo, domain) lagata hai aur apni community ke liye pehla "Welcome Event" create karta hai.
4. **Invite Users:** Admin apna signup link apne audience ya employees ko bhejta hai.
5. **Members Activity:** Members signup karte hain, apna digital business card populate karte hain, aur Home Feed pe Linkedin ki tarah ek dusre ke sath posts share karke network karte hain.
6. **Grace Period/Billing:** Month end pe agar Company Admin bill pay nahi karta, toh grace period start hota hai. 5 din baad Super Admin ka system automatically us community ka feed aur admin panel freeze kar deta hai jab tak payment nahi aati.

---

## 🔒 Security & Privacy Flow (Technique)
Jab bhi koi user Backend / Database se baat karta hai, backend hamesha check karta hai:
- User ka `role` kya hai? (Admin ya Member?)
- User ka `companyId` kya hai?

Iska faida yeh hai ki:
- Agar Member event bananey ki try karey, toh API block maar degi ("Only Admins allowed").
- Agar Company A ka Admin chahey bhi toh wo Company B ke members chori nahi kar sakta, unka view puri tarah isolate rakha gaya hai database level par.

Ye document client ko bhej do, isme pura system architecture unhe simple samajh aa jayega.
