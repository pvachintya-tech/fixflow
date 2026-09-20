import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { API_CONFIG } from '../config/apiConfig';
import { getIdToken, signIn, signOut } from '../services/authService';

interface Incident {
  incidentId: string;
  category?: string;
  location?: string;
  severity?: string;
  status?: string;
  reportCount?: number;
  uniqueReporterCount?: number;
  impactLevel?: string;
  fusionConfidence?: string;
  escalated?: boolean;
}

function isAdminToken(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(
      window.atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );

    const groups = decoded['cognito:groups'];

    if (Array.isArray(groups)) {
      return groups.includes('admins');
    }

    if (typeof groups === 'string') {
      return groups
        .replace(/[\[\]'" ]/g, '')
        .split(',')
        .map((group: string) => group.trim())
        .includes('admins');
    }

    return false;
  } catch {
    return false;
  }
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('demo-admin');
  const [password, setPassword] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadIncidents = async (authToken: string) => {
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/incidents`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || `Failed to load incidents (${res.status}).`
      );
    }

    setIncidents(data.incidents ?? []);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentToken = await getIdToken();

        if (currentToken && isAdminToken(currentToken)) {
          setToken(currentToken);
          setIsAdmin(true);
          await loadIncidents(currentToken);
        }
      } catch {
        setError('Unable to load the admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      const newToken = await signIn(username.trim(), password);

      if (!isAdminToken(newToken)) {
        signOut();
        throw new Error('This account does not have admin access.');
      }

      setToken(newToken);
      setIsAdmin(true);
      await loadIncidents(newToken);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Admin login failed.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (
    incidentId: string,
    status: string
  ) => {
    if (!token) {
      setError('Admin session expired. Please sign in again.');
      return;
    }

    setError('');
    setUpdatingId(incidentId);

    try {
      const res = await fetch(
        `${API_CONFIG.apiBaseUrl}/incidents/${incidentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Update failed (${res.status}).`
        );
      }

      const updated = data.incident;

      setIncidents((current) =>
        current.map((incident) =>
          incident.incidentId === incidentId
            ? { ...incident, ...updated }
            : incident
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update incident.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Checking admin access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen px-6 py-24 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Command Center
          </h1>

          <p className="text-slate-400 text-sm mb-6">
            Sign in with a FixFlow administrator account.
          </p>

          <div className="space-y-4">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
              required
            />

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl"
            >
              {loginLoading ? 'Signing in…' : 'Admin Sign In'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Command Center
            </h1>
            <p className="text-slate-400 mt-1">
              Manage live campus incidents.
            </p>
          </div>

          <button
            onClick={() => {
              signOut();
              setToken(null);
              setIsAdmin(false);
              setIncidents([]);
            }}
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {incidents.length === 0 && (
            <div className="text-slate-400 text-center py-12">
              No incidents found.
            </div>
          )}

          {incidents.map((incident) => (
            <div
              key={incident.incidentId}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 rounded-lg text-xs bg-slate-800 text-slate-300">
                      {incident.incidentId}
                    </span>

                    <span className="px-2 py-1 rounded-lg text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {incident.category ?? 'OTHER'}
                    </span>

                    <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-slate-300">
                      {incident.severity ?? 'LOW'}
                    </span>

                    {incident.escalated && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                        ESCALATED
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    {incident.category ?? 'Incident'} —{' '}
                    {incident.location ?? 'Unknown location'}
                  </h2>

                  <div className="text-sm text-slate-400 mt-2">
                    {incident.reportCount ?? 0} reports ·{' '}
                    {incident.uniqueReporterCount ?? 0} unique reporters ·{' '}
                    Impact: {incident.impactLevel ?? 'LOW'} ·{' '}
                    Confidence: {incident.fusionConfidence ?? 'LOW'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    Current:
                  </span>

                  <select
                    value={incident.status ?? 'UNCONFIRMED'}
                    disabled={updatingId === incident.incidentId}
                    onChange={(event) =>
                      handleStatusChange(
                        incident.incidentId,
                        event.target.value
                      )
                    }
                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="UNCONFIRMED">UNCONFIRMED</option>
                    <option value="PROBABLE">PROBABLE</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
