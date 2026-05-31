import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Person = { id: number; first_name: string; last_name: string };
type Position = { id: number; name: string };
type Team = { id: number; name: string };
type Player = { id: number; person_id: number; jersey_number: number | null; position_id: number | null; team_id: number | null; person?: Person; position?: Position; team?: Team };
const empty = () => ({ person_id: '', jersey_number: '', position_id: '', team_id: '' });

export default function Players() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Player[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([
    api.get('/players'), api.get('/persons'), api.get('/positions'), api.get('/teams')
  ]).then(([pl, pe, po, t]) => { setRows(pl); setPersons(pe); setPositions(po); setTeams(t); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = {
        person_id: Number(form.person_id),
        jersey_number: form.jersey_number ? Number(form.jersey_number) : null,
        position_id: form.position_id ? Number(form.position_id) : null,
        team_id: form.team_id ? Number(form.team_id) : null,
      };
      if (editing) await api.put(`/players/${editing}`, data);
      else await api.post('/players', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити гравця?')) return;
    try { await api.del(`/players/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Гравці</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати гравця' : 'Додати гравця'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Особа *</label>
            <select value={form.person_id} disabled={!!editing} onChange={e => set('person_id', e.target.value)}>
              <option value="">— оберіть особу —</option>
              {persons.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Номер футболки</label><input type="number" value={form.jersey_number} onChange={e => set('jersey_number', e.target.value)} /></div>
          <div className="form-group">
            <label>Позиція</label>
            <select value={form.position_id} onChange={e => set('position_id', e.target.value)}>
              <option value="">— без позиції —</option>
              {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
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
        <h2>Список гравців ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>ПІБ</th><th>№</th><th>Позиція</th><th>Команда</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.person?.first_name} {r.person?.last_name}</td>
                  <td>{r.jersey_number ?? '—'}</td>
                  <td>{r.position?.name ?? '—'}</td>
                  <td>{r.team?.name ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ person_id: String(r.person_id), jersey_number: r.jersey_number != null ? String(r.jersey_number) : '', position_id: r.position_id ? String(r.position_id) : '', team_id: r.team_id ? String(r.team_id) : '' }); }}>Редагувати</button>
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
