"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch {
      setError("Network error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-wine/10 text-wine flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
            Little Luxe Hamper
          </h1>
          <p className="text-xs text-muted">Atelier Management Portal &bull; Owner Login</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-error/10 text-error text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@littleluxehamper.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
              />
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Secret Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-pill bg-wine text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-wine-light transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Enter Atelier Backoffice</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-blush/60 text-[11px] text-muted">
          Default Dev Credentials: <br />
          <code>admin@littleluxehamper.com</code> / <code>password123</code>
        </div>
      </div>
    </div>
  );
}
