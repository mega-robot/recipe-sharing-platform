# Supabase Database Setup

This directory contains SQL migration files for setting up the Recipe Sharing Platform database.

## Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com)
- Email authentication enabled in your Supabase project

## Setup Instructions

### 1. Run the Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** to execute the migration

Alternatively, you can use the Supabase CLI:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 2. Verify the Setup

After running the migration, verify that:

- Tables are created: `profiles` and `recipes`
- Row Level Security (RLS) is enabled on both tables
- Policies are created for appropriate access control

You can check this in the **Table Editor** section of your Supabase dashboard.

## Database Schema

### Tables

#### `profiles`
Extends the `auth.users` table with additional user information:
- `id` (UUID, Primary Key, references `auth.users`)
- `username` (TEXT, Unique)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `recipes`
Stores recipe information:
- `id` (UUID, Primary Key)
- `user_id` (UUID, references `auth.users`)
- `title` (TEXT, Required)
- `description` (TEXT)
- `ingredients` (JSONB, Required) - Array of ingredient objects
- `steps` (JSONB, Required) - Array of step objects
- `image_url` (TEXT)
- `category` (recipe_category enum, Required)
- `prep_time` (INTEGER) - in minutes
- `cook_time` (INTEGER) - in minutes
- `servings` (INTEGER)
- `difficulty` (TEXT) - 'easy', 'medium', or 'hard'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Enums

#### `recipe_category`
- appetizers
- main-courses
- desserts
- beverages
- salads
- soups
- breakfast
- snacks

## Row Level Security (RLS)

### Profiles Policies
- **View**: Anyone can view profiles
- **Update**: Users can only update their own profile
- **Insert**: Users can only insert their own profile

### Recipes Policies
- **View**: Anyone can view all recipes
- **Insert**: Authenticated users can create recipes
- **Update**: Users can only update their own recipes
- **Delete**: Users can only delete their own recipes

## Automatic Features

1. **Auto Profile Creation**: When a user signs up, a profile is automatically created via a database trigger
2. **Auto Timestamp Updates**: The `updated_at` field is automatically updated when records are modified

## Example Data Structures

### Ingredients (JSONB)
```json
[
  {"name": "All-purpose flour", "amount": "2", "unit": "cups"},
  {"name": "Sugar", "amount": "1", "unit": "cup"},
  {"name": "Eggs", "amount": "2", "unit": "large"}
]
```

### Steps (JSONB)
```json
[
  {"step_number": 1, "instruction": "Preheat oven to 350°F"},
  {"step_number": 2, "instruction": "Mix dry ingredients in a bowl"},
  {"step_number": 3, "instruction": "Add wet ingredients and mix until combined"}
]
```

## Next Steps

After setting up the database:

1. Get your Supabase project URL and anon key from **Settings > API**
2. Create environment variables file (`.env.local`) with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Set up the Supabase client in your Next.js application

