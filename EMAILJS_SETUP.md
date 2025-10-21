# EmailJS Setup Guide - Portfolio Contact Form

## Quick Setup (2 minutes)

### Step 1: Sign Up (30 seconds)
1. Go to: https://www.emailjs.com/
2. Click "Sign Up Free"
3. Enter your email: stanishka047@gmail.com
4. Create a password
5. Check your inbox and verify email

---

### Step 2: Connect Gmail (1 minute)
Once logged in:

1. Click **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with **stanishka047@gmail.com** and allow access
6. **COPY YOUR SERVICE ID** (looks like: `service_abc123`)
   - You'll need this in Step 4!

---

### Step 3: Create Email Template (1 minute)
1. Click **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Fill in these exact values:

**Template Settings:**
- **Template Name**: Portfolio Contact Form

**Email Content:**
- **To Email**: `stanishka047@gmail.com` (or use `{{to_email}}`)
- **From Name**: `{{from_name}}`
- **From Email**: `{{from_email}}`
- **Reply To**: `{{from_email}}`
- **Subject**: `New message from {{from_name}}`

**Message Body** (copy this exactly):
```
From: {{from_name}} <{{from_email}}>

Message:
{{message}}
```

4. Click **"Save"**
5. **COPY YOUR TEMPLATE ID** (looks like: `template_xyz789`)

---

### Step 4: Get Your Public Key
1. Click **"Account"** in the left sidebar
2. Go to **"General"** tab
3. Find **"Public Key"** (looks like: `abc123XYZ`)
4. **COPY IT**

---

### Step 5: Update Your Code (final step!)

Open `contact-emailjs.js` and replace these 3 values:

**Line 3:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```
Replace with:
```javascript
emailjs.init("your_actual_public_key_here");
```

**Line 43:**
```javascript
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
```
Replace with:
```javascript
emailjs.send("service_abc123", "template_xyz789", {
```

---

## Test It!
1. Open `index.html` in your browser
2. Fill the contact form
3. Click "SEND MESSAGE"
4. Check stanishka047@gmail.com inbox!

---

## Troubleshooting
- **"emailjs is not defined"**: Clear browser cache and refresh
- **"Service ID not found"**: Double-check you copied the right ID
- **Email not arriving**: Check spam folder; verify template saved correctly
- **Still stuck**: Share the browser console error and I'll fix it

---

That's it! No servers, no passwords, no headaches. Just works. 🚀
