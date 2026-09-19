# Convene AI — Deployment & Google OAuth Setup Guide

> **Target Audience:** Repository Owner & Vercel / Supabase Administrator  
> **Repository:** [jeetptl1503/convene-ai](https://github.com/jeetptl1503/convene-ai)

---

## 📌 Executive Summary

The frontend application code is **already 100% written and wired up** to `supabase.auth.signInWithOAuth({ provider: 'google' })`. No additional coding is required.

To make the Google Sign-In button trigger real Google authentication, the repository owner only needs to complete a **one-time setup**:
1. Retrieve the callback URL from **Supabase**.
2. Create OAuth credentials in **Google Cloud Console**.
3. Enable the Google Provider in **Supabase**.
4. Configure the **Vercel** domain whitelist.
5. Redeploy the latest commit on **Vercel**.

---

## Part 1: Retrieve the OAuth Callback URL from Supabase

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and select your **Convene AI** project.
2. In the left sidebar, click **Authentication** (the user icon) → **Providers**.
3. Scroll down to **Google** and click to expand it.
4. Locate the field labeled:
   ```text
   Callback URL (for OAuth)
   ```
   It will look like:
   ```text
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
5. **Copy this exact URL.** Keep this tab open.

---

## Part 2: Create Credentials in Google Cloud Console

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/) and sign in with your Google account.
2. Click the top project dropdown → **New Project** → Name it **Convene AI** → Click **Create**.
3. In the left navigation menu or search bar, open **OAuth consent screen**:
   - **User Type:** Select **External** → Click **Create**.
   - **App Name:** `Convene AI`
   - **User support email:** Select your email address.
   - **Developer contact email:** Enter your email address.
   - Click **Save and Continue** through the Scopes and Test Users screens (default settings are fine).
4. In the left sidebar, click **Credentials**:
   - Click **+ CREATE CREDENTIALS** at the top → select **OAuth client ID**.
   - **Application type:** Select **Web application**.
   - **Name:** `Convene AI Web Client`
   - Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
     - `https://<your-project-id>.supabase.co`
     - `https://<your-app-name>.vercel.app` (your live Vercel domain)
     - `http://localhost:3000` (for local development)
     - `http://localhost:3003` (if testing on port 3003)
   - Under **Authorized redirect URIs**, click **+ ADD URI** and paste the exact Supabase callback URL from Part 1:
     - `https://<your-project-id>.supabase.co/auth/v1/callback`
   - Click **Create**.
5. A popup will display your credentials:
   - **Client ID** (e.g. `123456789-abcdef.apps.googleusercontent.com`)
   - **Client Secret** (e.g. `GOCSPX-xxxxxxxxxxxxxx`)
6. **Copy both values.**

---

## Part 3: Enable the Google Provider in Supabase

1. Return to the **Supabase Dashboard** → **Authentication** → **Providers** → **Google**.
2. Toggle the switch to **ON** (Enable Sign in with Google).
3. Paste the **Client ID** into the `Client ID` field.
4. Paste the **Client Secret** into the `Client Secret` field.
5. Click **Save** at the bottom of the section.

---

## Part 4: Configure Supabase Redirect URLs for Vercel

1. In Supabase, navigate to **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```text
   https://<your-app-name>.vercel.app
   ```
3. Under **Redirect URLs**, click **Add URL** and add the wildcard entry:
   ```text
   https://<your-app-name>.vercel.app/**
   ```
   *(Also keep `http://localhost:3000/**` if you want local testing).*
4. Click **Save**.

---

## Part 5: Vercel Redeployment & Environment Variables

1. Log in to [vercel.com](https://vercel.com) and open the **convene-ai** project.
2. Go to **Settings** → **Environment Variables** and confirm these 4 keys are present:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
3. Go to the **Deployments** tab.
4. Click **Redeploy** on the latest commit (`main` branch).

---

## Part 6: Verified End-to-End User Flow

Once configured, the user experience functions as follows:

| Step | URL / Route | User Action & Experience |
| :--- | :--- | :--- |
| **1** | `https://convene-ai.vercel.app/` | Visitor arrives on the public Landing Page and clicks **"Sign in with Google"**. |
| **2** | `/signin` | Dedicated Google login screen. Clicking **"Continue with Google"** triggers Supabase OAuth. |
| **3** | Google Consent Screen | Google prompts the user to select their account and verifies identity. |
| **4** | `/account-creation` | Supabase redirects the user to the in-app onboarding page with their email pre-verified. The user selects their Role (Club President, Lead, Volunteer) and names their Club & upcoming Event. |
| **5** | `/dashboard` | Clicking **"Complete Setup & Launch Dashboard"** brings them directly to their operational command center. |
