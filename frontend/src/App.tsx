import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Positions from './pages/Positions';
import Persons from './pages/Persons';
import Teams from './pages/Teams';
import Coaches from './pages/Coaches';
import Players from './pages/Players';
import MedicalCards from './pages/MedicalCards';
import Trainings from './pages/Trainings';
import Matches from './pages/Matches';
import MatchStats from './pages/MatchStats';
import TrainingCoaches from './pages/TrainingCoaches';
import Queries from './pages/Queries';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="positions" element={<Positions />} />
          <Route path="persons" element={<Persons />} />
          <Route path="teams" element={<Teams />} />
          <Route path="coaches" element={<Coaches />} />
          <Route path="players" element={<Players />} />
          <Route path="medical-cards" element={<MedicalCards />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="matches" element={<Matches />} />
          <Route path="match-stats" element={<MatchStats />} />
          <Route path="training-coaches" element={<TrainingCoaches />} />
          <Route path="queries" element={<Queries />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
