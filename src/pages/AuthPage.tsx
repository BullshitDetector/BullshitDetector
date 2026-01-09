// Full file: src/pages/AuthPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'admin@bullshitdetector.com';
const DEMO_OTP = '123456';

export default function AuthPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const { signIn } = useAuth(); // Not used for OTP, but for consistency
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (email !== ADMIN_EMAIL) {
      setError('Invalid admin email. Contact support.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      setIsDemo(true);
      setStep('otp');
      toast.success(`Demo OTP: ${DEMO_OTP}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isDemo) {
        if (otp !== DEMO_OTP) {
          throw new Error('Invalid demo OTP. Use 123456');
        }
        localStorage.setItem('demoMode', 'true');
        navigate('/');
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      if (data.user) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">{error}</p>}
        {step === 'email' ? (
          <>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {isDemo ? `Demo OTP: ${DEMO_OTP}` : 'Check your email for the OTP code.'}
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={handleOTPSubmit}
              disabled={loading || otp.length < 6}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => setStep('email')}
              className="w-full mt-2 text-sm text-purple-600 hover:underline"
            >
              Change Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}