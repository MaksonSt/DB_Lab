import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Match = { id: number; date: string; stadium: string };
type Player = { id: number; person?: { first_name: string; last_name: string } };
type Stat = { match_id: number; player_id: number; goals: number | null; assists: number | null; cards: number | null; minutes_played: number | null; match?: Match; player?: Player };
const empty = () => ({ match_id: '', player_id: '', goals: '0', assists: '0', cards: '0', minutes_played: '0' });

function fmtDate(d: string) { return d ? d.split('T')[0] : ''; }

export default function MatchStats() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Stat[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState(empty());
  const [editKey, setEditKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/match-stats'), api.get('/matches'), api.get('/players')])
    .then(([s, m, p]) => { setRows(s); setMatches(m); setPlayers(p); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = { match_id: Number(form.match_id), player_id: Number(form.player_id), goals: Number(form.goals), assists: Number(form.assists), cards: Number(form.cards), minutes_played: Number(form.minutes_played) };
      if (editKey) await api.put(`/match-stats/${data.match_id}/${data.player_id}`, data);
      else await api.post('/match-stats', data);
      setForm(empty()); setEditKey(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (matchId: number, playerId: number) => {
    if (!confirm('Видалити статистику?')) return;
    try { await api.del(`/match-stats/${matchId}/${playerId}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Статистика матчів</h1>
      </div>

      <div className="card">
        <h2>{editKey ? 'Редагувати статистику' : 'Додати статистику'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Матч *</label>
            <select value={form.match_id} disabled={!!editKey} onChange={e => set('match_id', e.target.value)}>
              <option value="">— оберіть матч —</option>
              {matches.map(m => <option key={m.id} value={m.id}>#{m.id} {fmtDate(m.date)} {m.stadium}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Гравець *</label>
            <select value={form.player_id} disabled={!!editKey} onChange={e => set('player_id', e.target.value)}>
              <option value="">— оберіть гравця —</option>
              {players.map(p => <option key={p.id} value={p.id}>#{p.id} {p.person?.first_name} {p.person?.last_name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Голи</label><input type="number" min="0" value={form.goals} onChange={e => set('goals', e.target.value)} /></div>
          <div className="form-group"><label>Асисти</label><input type="number" min="0" value={form.assists} onChange={e => set('assists', e.target.value)} /></div>
          <div className="form-group"><label>Картки</label><input type="number" min="0" value={form.cards} onChange={e => set('cards', e.target.value)} /></div>
          <div className="form-group"><label>Хв на полі</label><input type="number" min="0" value={form.minutes_played} onChange={e => set('minutes_played', e.target.value)} /></div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editKey ? 'Зберегти' : 'Додати'}</button>
          {editKey && <button className="btn btn-cancel" onClick={() => { setEditKey(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Статистика ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Матч</th><th>Гравець</th><th>Голи</th><th>Асисти</th><th>Картки</th><th>Хвилин</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={`${r.match_id}-${r.player_id}`}>
                  <td>#{r.match_id} {r.match ? fmtDate(r.match.date) : ''}</td>
                  <td>{r.player?.person?.first_name} {r.player?.person?.last_name}</td>
                  <td>{r.goals ?? 0}</td>
                  <td>{r.assists ?? 0}</td>
                  <td>{r.cards ?? 0}</td>
                  <td>{r.minutes_played ?? 0}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditKey(`${r.match_id}-${r.player_id}`); setForm({ match_id: String(r.match_id), player_id: String(r.player_id), goals: String(r.goals ?? 0), assists: String(r.assists ?? 0), cards: String(r.cards ?? 0), minutes_played: String(r.minutes_played ?? 0) }); }}>Редагувати</button>
                    <button className="btn btn-danger" onClick={() => del(r.match_id, r.player_id)}>Видалити</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
