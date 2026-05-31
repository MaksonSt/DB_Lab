import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Team = { id: number; name: string };
type Match = { id: number; date: string; time: string; stadium: string; home_team_id: number; away_team_id: number; goals: number | null; team_match_home_team_idToteam?: Team; team_match_away_team_idToteam?: Team };
const empty = () => ({ date: '', time: '', stadium: '', home_team_id: '', away_team_id: '', goals: '0' });

function fmtDate(d: string) { return d ? d.split('T')[0] : '—'; }
function fmtTime(t: string) { return t ? t.split('T')[1]?.slice(0, 5) : '—'; }

export default function Matches() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/matches'), api.get('/teams')]).then(([m, t]) => { setRows(m); setTeams(t); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = { date: form.date, time: form.time, stadium: form.stadium, home_team_id: Number(form.home_team_id), away_team_id: Number(form.away_team_id), goals: Number(form.goals) };
      if (editing) await api.put(`/matches/${editing}`, data);
      else await api.post('/matches', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити матч?')) return;
    try { await api.del(`/matches/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Матчі</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати матч' : 'Додати матч'}</h2>
        <div className="form-grid">
          <div className="form-group"><label>Дата *</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="form-group"><label>Час *</label><input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></div>
          <div className="form-group"><label>Стадіон *</label><input value={form.stadium} onChange={e => set('stadium', e.target.value)} /></div>
          <div className="form-group">
            <label>Господарі *</label>
            <select value={form.home_team_id} onChange={e => set('home_team_id', e.target.value)}>
              <option value="">— оберіть команду —</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Гості *</label>
            <select value={form.away_team_id} onChange={e => set('away_team_id', e.target.value)}>
              <option value="">— оберіть команду —</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Голів загалом</label><input type="number" value={form.goals} onChange={e => set('goals', e.target.value)} /></div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список матчів ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Дата</th><th>Час</th><th>Стадіон</th><th>Господарі</th><th>Гості</th><th>Голів</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={8} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{fmtDate(r.date)}</td>
                  <td>{fmtTime(r.time)}</td>
                  <td>{r.stadium}</td>
                  <td>{r.team_match_home_team_idToteam?.name ?? r.home_team_id}</td>
                  <td>{r.team_match_away_team_idToteam?.name ?? r.away_team_id}</td>
                  <td>{r.goals ?? 0}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ date: fmtDate(r.date), time: fmtTime(r.time), stadium: r.stadium, home_team_id: String(r.home_team_id), away_team_id: String(r.away_team_id), goals: String(r.goals ?? 0) }); }}>Редагувати</button>
                    <button className="btn btn-danger" onClick={() => del(r.id)}>Видалити</button>
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
