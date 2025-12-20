import { supabase } from './supabase';
import demoData from '../data/demo-data.json';

interface SeederResult {
  success: boolean;
  message: string;
  errors: string[];
  counts: {
    users: number;
    validations: number;
    sentiments: number;
    settings: number;
  };
}

export async function seedDemoData(): Promise<SeederResult> {
  const errors: string[] = [];
  const counts = {
    users: 0,
    validations: 0,
    sentiments: 0,
    settings: 0,
  };

  try {
    // Seed Users
    for (const user of demoData.users) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert(
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
        } else {
          counts.users++;
        }
      } catch (err) {
        errors.push(`User ${user.email}: ${String(err)}`);
      }
    }

    // Seed Validation History
    for (const validation of demoData.validation_history) {
      try {
        const { error } = await supabase
          .from('validation_history')
          .insert({
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
          errors.push(`Validation ${validation.id}: ${error.message}`);
        } else {
          counts.validations++;
        }
      } catch (err) {
        errors.push(`Validation ${validation.id}: ${String(err)}`);
      }
    }

    // Seed Sentiment History
    for (const sentiment of demoData.sentiment_history) {
      try {
        const { error } = await supabase
          .from('sentiment_history')
          .insert({
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
          errors.push(`Sentiment ${sentiment.id}: ${error.message}`);
        } else {
          counts.sentiments++;
        }
      } catch (err) {
        errors.push(`Sentiment ${sentiment.id}: ${String(err)}`);
      }
    }

    // Seed System Settings
    for (const setting of demoData.system_settings) {
      try {
        const { error } = await supabase
          .from('system_settings')
          .upsert(
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
        } else {
          counts.settings++;
        }
      } catch (err) {
        errors.push(`Setting ${setting.key}: ${String(err)}`);
      }
    }

    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? 'Demo data seeded successfully'
          : `Seeding completed with ${errors.length} errors`,
      errors,
      counts,
    };
  } catch (err) {
    return {
      success: false,
      message: `Seeding failed: ${String(err)}`,
      errors: [String(err)],
      counts,
    };
  }
}

export async function clearDemoData(): Promise<SeederResult> {
  const errors: string[] = [];
  const counts = {
    users: 0,
    validations: 0,
    sentiments: 0,
    settings: 0,
  };

  try {
    // Only delete records marked as demo data to preserve user-created data
    const { data: demoUsers, error: getUsersError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('metadata->demo_data', true);

    if (!getUsersError && demoUsers) {
      for (const user of demoUsers) {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', user.user_id);

        if (!error) counts.users++;
        else errors.push(`Delete user: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? 'Demo data cleared successfully'
          : `Clearing completed with ${errors.length} errors`,
      errors,
      counts,
    };
  } catch (err) {
    return {
      success: false,
      message: `Clearing failed: ${String(err)}`,
      errors: [String(err)],
      counts,
    };
  }
}

export function getDemoDataStats() {
  return {
    totalUsers: demoData.users.length,
    totalValidations: demoData.validation_history.length,
    totalSentiments: demoData.sentiment_history.length,
    totalSettings: demoData.system_settings.length,
  };
}
