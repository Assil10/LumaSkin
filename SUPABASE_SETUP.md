# Supabase Setup for LumaSkin

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be ready

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - Anon (public) key

## 3. Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create the Database Table

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `scripts/supabase-setup.sql`
4. Run the script

## 5. Import Your CSV

Once the table is created, you can import your skincare CSV:

```bash
# Using curl (Windows)
curl.exe -X POST -F 'file=@"C:\path\to\your\skincare_products_clean.csv";type=text/csv' 'http://localhost:3000/api/products/import'

# Using PowerShell 7+
$form = @{ file = Get-Item 'C:\path\to\your\skincare_products_clean.csv' }
Invoke-RestMethod -Uri 'http://localhost:3000/api/products/import' -Method Post -Form $form
```

## 6. Test the Setup

1. Start your dev server: `npm run dev`
2. Visit `/products` to see your imported data
3. Use the filters to test the functionality

## CSV Format Expected

Your CSV should have headers like:
- `product_name` (or `name`, `product`)
- `brand` (or `brand name`, `manufacturer`)
- `price` (will handle £, $, € symbols)
- `category` (or `product_type`, `type`)
- `clean_ingreds` (or `ingredients`, `ingredient list`)
- `rating`, `reviews` (optional)
- `skin_type`, `concerns` (optional)

## Troubleshooting

- **"No valid rows found"**: Check your CSV headers and make sure they contain product name and brand
- **Database connection error**: Verify your Supabase credentials in `.env.local`
- **Import fails**: Check the browser console and server logs for detailed error messages

## Current Status

✅ Supabase client configured  
✅ Product table schema created  
✅ API endpoints created  
✅ Frontend connected to API  
✅ CSV import functionality ready  

Your frontend design remains exactly the same - only the data source has changed from mock data to Supabase!
