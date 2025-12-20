import { createClient } from '@supabase/supabase-js';
import demoData from '../src/data/demo-data.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, ...args) {
  console.log(`${color}${args.join(' ')}${colors.reset}`);
}

async function seedData() {
  log(colors.blue, '🌱 Starting demo data seeding...\n');

  const results = {
    users: { success: 0, failed: 0 },
    validations: { success: 0, failed: 0 },
    sentiments: { success: 0, failed: 0 },
    settings: { success: 0, failed: 0 },
  };

  const errors = [];

  try {
    // Seed Users
    log(colors.blue, '👥 Seeding users...');
    for (const user of demoData.users) {
      try {
        const { error } = await supabase.from('user_profiles').upsert(
          {
            id: user.id,
            user_id: user.id,
            email: user.email,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
            role: user.role,
            mode: user.mode,
            is_active: user.is_active,
            created_at: user.created_at,
            last_login_at: user.last_login_at,
            metadata: { demo_data: true },
          },
          { onConflict: 'email' }
        );

        if (error) {
          errors.push(`User ${user.email}: ${error.message}`);
          results.users.failed++;
        } else {
          results.users.success++;
        }
      } catch (err) {
        errors.push(`User ${user.email}: ${err.message}`);
        results.users.failed++;
      }
    }
    log(colors.green, `✓ Users: ${results.users.success} created`);

    // Seed Validation History
    log(colors.blue, '📋 Seeding validation history...');
    for (const validation of demoData.validation_history) {
      try {
        const { error } = await supabase.from('validation_history').insert({
          id: validation.id,
          user_id: validation.user_id,
          claim: validation.claim,
          verdict: validation.verdict,
          score: validation.score,
          confidence: validation.confidence,
          mode: validation.mode,
          explanation: validation.explanation,
          summary: validation.summary,
          key_points: validation.key_points,
          risk_assessment: validation.risk_assessment,
          bias_score: validation.bias_score,
          bias_direction: validation.bias_direction,
          sources: validation.sources,
          sentiment: validation.sentiment,
          model_used: validation.model_used,
          tokens_used: validation.tokens_used,
          processing_time_ms: validation.processing_time_ms,
          created_at: validation.created_at,
        });

        if (error) {
          errors.push(`Validation: ${error.message}`);
          results.validations.failed++;
        } else {
          results.validations.success++;
        }
      } catch (err) {
        errors.push(`Validation: ${err.message}`);
        results.validations.failed++;
      }
    }
    log(colors.green, `✓ Validations: ${results.validations.success} created`);

    // Seed Sentiment History
    log(colors.blue, '📊 Seeding sentiment history...');
    for (const sentiment of demoData.sentiment_history) {
      try {
        const { error } = await supabase.from('sentiment_history').insert({
          id: sentiment.id,
          user_id: sentiment.user_id,
          topic: sentiment.topic,
          positive: sentiment.positive,
          neutral: sentiment.neutral,
          negative: sentiment.negative,
          explanation: sentiment.explanation,
          summary: sentiment.summary,
          quotes: sentiment.quotes,
          sources: sentiment.sources,
          trending_score: sentiment.trending_score,
          model_used: sentiment.model_used,
          tokens_used: sentiment.tokens_used,
          created_at: sentiment.created_at,
        });

        if (error) {
          errors.push(`Sentiment: ${error.message}`);
          results.sentiments.failed++;
        } else {
          results.sentiments.success++;
        }
      } catch (err) {
        errors.push(`Sentiment: ${err.message}`);
        results.sentiments.failed++;
      }
    }
    log(colors.green, `✓ Sentiments: ${results.sentiments.success} created`);

    // Seed System Settings
    log(colors.blue, '⚙️ Seeding system settings...');
    for (const setting of demoData.system_settings) {
      try {
        const { error } = await supabase.from('system_settings').upsert(
          {
            key: setting.key,
            value: setting.value,
            description: setting.description,
            is_public: setting.is_public,
          },
          { onConflict: 'key' }
        );

        if (error) {
          errors.push(`Setting ${setting.key}: ${error.message}`);
          results.settings.failed++;
        } else {
          results.settings.success++;
        }
      } catch (err) {
        errors.push(`Setting ${setting.key}: ${err.message}`);
        results.settings.failed++;
      }
    }
    log(colors.green, `✓ Settings: ${results.settings.success} created`);

    // Summary
    log(colors.blue, '\n📊 Seeding Summary:');
    const totalSuccess =
      results.users.success +
      results.validations.success +
      results.sentiments.success +
      results.settings.success;
    const totalFailed =
      results.users.failed +
      results.validations.failed +
      results.sentiments.failed +
      results.settings.failed;

    log(
      colors.green,
      `✓ Total successful: ${totalSuccess}`,
      totalFailed > 0 ? `\n❌ Total failed: ${totalFailed}` : ''
    );

    if (errors.length > 0) {
      log(colors.yellow, '\n⚠️ Errors encountered:');
      errors.forEach((err) => log(colors.yellow, `  - ${err}`));
    }

    process.exit(errors.length > 0 ? 1 : 0);
  } catch (err) {
    log(colors.red, `\n❌ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

seedData();
