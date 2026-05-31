# Jawrah Pixel - Premium Digital Agency

A premium full-stack digital agency website built for **Jawrah Pixel**.

## 🚀 Tech Stack

- **Frontend:** React (Vite / React Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend/DB:** Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Vercel / GitHub ready

## 🛠️ Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=jawrahpixel@gmail.com
   FROM_EMAIL=projects@jawrahpixel.com
   ```
4. Run the Supabase SQL Schema located in `supabase/schema.sql` on your Supabase dashboard to provision tables and RLS policies.
5. Start the dev server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to Vercel

1. Push code to GitHub.
2. Connect repository to Vercel.
3. Set Supabase and Resend environment variables in the Vercel dashboard. Keep `RESEND_API_KEY` and `FROM_EMAIL` server-only; do not create `VITE_` versions.
4. Deploy!

## 🔐 Admin Access
To access the `/admin` dashboard, ensure your profile record in the Supabase `profiles` table has `role` set to `'admin'`.
