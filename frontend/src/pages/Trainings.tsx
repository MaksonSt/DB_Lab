import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Team = { id: number; name: string };
type Training = { id: number; date: string; time: string; duration: number | null; type: string | null; team_id: number | null; team?: Team };
const empty = () => ({ date: '', time: '', duration: '', type: '', team_id: '' });

function fmtDate(d: string) { return d ? d.split('T')[0] : '—'; }
function fmtTime(t: string) { return t ? t.split('T')[1]?.slice(0, 5) : '—'; }

export default function Trainings() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Training[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/trainings'), api.get('/teams')]).then(([tr, t]) => { setRows(tr); setTeams(t); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = { date: form.date, time: form.time, duration: form.duration ? Number(form.duration) : null, type: form.type || null, team_id: form.team_id ? Number(form.team_id) : null };
      if (editing) await api.put(`/trainings/${editing}`, data);
      else await api.post('/trainings', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити тренування?')) return;
    try { await api.del(`/trainings/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Тренування</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати тренування' : 'Додати тренування'}</h2>
        <div className="form-grid">
          <div className="form-group"><label>Дата *</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="form-group"><label>Час *</label><input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></div>
          <div className="form-group"><label>Тривалість (хв)</label><input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} /></div>
          <div className="form-group"><label>Тип</label><input value={form.type} onChange={e => set('type', e.target.value)} placeholder="Фізична, тактична..." /></div>
          <div className="form-group">
            <label>Команда</label>
            <select value={form.team_id} onChange={e => set('team_id', e.target.value)}>
              <option value="">— без команди —</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список тренувань ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Дата</th><th>Час</th><th>Тривалість</th><th>Тип</th><th>Команда</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{fmtDate(r.date)}</td>
                  <td>{fmtTime(r.time)}</td>
                  <td>{r.duration != null ? `${r.duration} хв` : '—'}</td>
                  <td>{r.type ?? '—'}</td>
                  <td>{r.team?.name ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ date: fmtDate(r.date), time: fmtTime(r.time), duration: r.duration != null ? String(r.duration) : '', type: r.type ?? '', team_id: r.team_id ? String(r.team_id) : '' }); }}>Редагувати</button>
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
