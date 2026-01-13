# Supabase Backend Setup

To enable the "Secret Upload Mode", you need to set up a free Supabase project.

## 1. Create Project
1. Go to [database.new](https://database.new) and create a new project.
2. Once created, go to **Project Settings > API**.
3. Copy the **URL** and **anon public key**.

## 2. Configure Environment Variables
1. Open the `.env` file in your project root.
2. Paste your URL and Key:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_SECRET_PASSCODE=OurSecret123  <-- Choose a strong passcode here!
   ```

## 3. Run Database Setup
1. In Supabase Dashboard, go to **SQL Editor**.
2. Click **New Query**.
3. Copy the contents of `db_setup.sql` (located in your project root) and paste it into the editor.
4. Click **Run**.
5. Go to **Storage** in the sidebar.
6. Create a new bucket named **gallery-images**.
7. **Important**: Toggle "Public bucket" to ON.

## 4. Done!
Restart your dev server (`npm run dev`) and click "Add more memories" to test.
