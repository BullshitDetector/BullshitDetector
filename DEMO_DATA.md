# 📊 Demo Data Setup Guide

This guide explains how to seed demo data into the BullshitDetector database for development and testing.

## Overview

The demo data includes:
- **5 Sample Users** - with different roles (admin, editor, user)
- **5 Validation Records** - with various verdicts and analysis modes
- **3 Sentiment Analyses** - covering different topics
- **7 System Settings** - app configuration

## Files

### Data Files
- **`src/data/demo-data.json`** - Complete demo dataset in JSON format
- **`src/lib/seed-demo-data.ts`** - TypeScript seeder for client-side usage
- **`scripts/seed-demo-data.js`** - Node.js script for server-side seeding

## Usage

### Option 1: Seed via NPM Script (Recommended)

Requires: `SUPABASE_SERVICE_ROLE_KEY` in `.env`

```bash
npm run seed:demo
```

This command will:
1. Read demo data from `src/data/demo-data.json`
2. Insert all records into Supabase
3. Display a summary of results

### Option 2: Programmatic Seeding

In your TypeScript code:

```typescript
import { seedDemoData, clearDemoData, getDemoDataStats } from '@/lib/seed-demo-data';

// Seed the demo data
const result = await seedDemoData();
console.log(result.message);
console.log(`Users: ${result.counts.users}`);
console.log(`Validations: ${result.counts.validations}`);
console.log(`Sentiments: ${result.counts.sentiments}`);

// Get stats without seeding
const stats = getDemoDataStats();
console.log(`Total demo validations: ${stats.totalValidations}`);

// Clear demo data (only removes records marked as demo_data: true)
const clearResult = await clearDemoData();
console.log(clearResult.message);
```

## Demo Data Details

### Users

| Email | Role | Mode | Status |
|-------|------|------|--------|
| admin@bullshitdetector.com | admin | professional | Active |
| editor@bullshitdetector.com | editor | professional | Active |
| alice.voter@bullshitdetector.com | user | voter | Active |
| bob.analyst@bullshitdetector.com | user | professional | Active |
| carol.inactive@bullshitdetector.com | user | voter | Inactive |

### Sample Validations

1. **"The Earth is flat"**
   - Verdict: Bullshit (99% confidence)
   - Mode: Voter
   - Score: 0.98

2. **"Drinking lemon water in the morning has scientifically proven health benefits"**
   - Verdict: Neutral (65% confidence)
   - Mode: Voter
   - Score: 0.52

3. **"Renewable energy can meet 100% of global energy needs by 2030"**
   - Verdict: Uncertain (55% confidence)
   - Mode: Professional
   - Score: 0.48

4. **"Coffee consumption reduces risk of Parkinson's disease"**
   - Verdict: Mostly True (78% confidence)
   - Mode: Professional
   - Score: 0.74

5. **"5G networks cause COVID-19"**
   - Verdict: Bullshit (99% confidence)
   - Mode: Professional
   - Score: 0.99

### Sample Sentiments

1. **Electric Vehicles**
   - Positive: 245 | Neutral: 156 | Negative: 89
   - Trending Score: 87.5

2. **Cryptocurrency Market**
   - Positive: 189 | Neutral: 203 | Negative: 198
   - Trending Score: 52.3 (polarized)

3. **Artificial Intelligence**
   - Positive: 312 | Neutral: 178 | Negative: 110
   - Trending Score: 73.8

### System Settings

| Key | Value | Public |
|-----|-------|--------|
| maintenance_mode | false | No |
| max_free_validations_daily | 50 | No |
| max_pro_validations_daily | 500 | No |
| default_model | "grok-3" | Yes |
| available_models | ["grok-3", "grok-4", "gpt-4o", ...] | Yes |
| app_version | "2.0.1" | Yes |
| api_rate_limit | 100 | No |

## Important Notes

### Data Isolation
- All demo records include `metadata: { demo_data: true }`
- The `clearDemoData()` function only removes records with this flag
- User-created data is preserved

### RLS Policies
- Demo users have full access to their own records
- Admin users can see all records
- System settings follow configured access policies

### Re-initialization
If you need to reset the database:

1. **Delete demo data:**
   ```bash
   npm run seed:demo:clear
   ```

2. **Reseed fresh demo data:**
   ```bash
   npm run seed:demo
   ```

## Environment Setup

Ensure your `.env` file includes:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for seeding
```

The service role key is required for the NPM script because it needs elevated permissions to insert data across multiple tables without authentication.

## Troubleshooting

### "Missing Supabase credentials"
- Verify `.env` file has all required keys
- Check `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)

### "User already exists"
- Existing users are updated via `upsert`
- Email conflicts will update the existing record

### "Failed to insert validation"
- Check that user_id references an existing user
- Verify RLS policies allow inserts

### "RLS policy violation"
- Ensure authenticated context when using client-side seeder
- Use service role key for NPM script (already done)

## Modifying Demo Data

To customize demo data:

1. Edit `src/data/demo-data.json`
2. Update relevant fields
3. Re-run seeding script

Example: Add a new validation record:

```json
{
  "id": "unique-uuid",
  "user_id": "user-uuid",
  "claim": "Your claim here",
  "verdict": "bullshit|mostly true|neutral|uncertain",
  "score": 0.75,
  "confidence": 85,
  "mode": "voter|professional",
  "explanation": "Your explanation...",
  "created_at": "2024-12-20T10:00:00Z"
}
```

## Performance Considerations

- Seeding ~15 records (5 users + 5 validations + 3 sentiments + 2 settings) takes ~5-10 seconds
- Bulk operations use batch inserts where applicable
- Demo data is optimized for typical usage patterns

## Support

For issues:
1. Check error messages from seeding script
2. Verify database connectivity
3. Ensure RLS policies are correctly configured
4. Check Supabase logs for detailed errors
