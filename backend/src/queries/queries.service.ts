import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueriesService {
  constructor(private prisma: PrismaService) {}

  async playersWithGoals(teamName: string, minGoals: number) {
    return this.prisma.$queryRaw`
      SELECT p.first_name || ' ' || p.last_name AS player, t.name AS team, SUM(ms.goals) AS total_goals
      FROM player pl
      JOIN person p ON p.id = pl.person_id
      JOIN team t ON t.id = pl.team_id
      JOIN match_stats ms ON ms.player_id = pl.id
      WHERE t.name = ${teamName}
      GROUP BY p.first_name, p.last_name, t.name
      HAVING SUM(ms.goals) > ${minGoals}
    `;
  }

  async matchesByStadiumAfterDate(stadium: string, afterDate: string) {
    return this.prisma.$queryRaw`
      SELECT m.date, m.time, m.stadium, ht.name AS home_team, at.name AS away_team, m.goals
      FROM match m
      JOIN team ht ON ht.id = m.home_team_id
      JOIN team at ON at.id = m.away_team_id
      WHERE m.stadium = ${stadium} AND m.date > ${new Date(afterDate)}::date
    `;
  }

  async playersByBloodType(bloodType: string) {
    return this.prisma.$queryRaw`
      SELECT p.first_name || ' ' || p.last_name AS player, t.name AS team, mc.blood_type, mc.allergies
      FROM player pl
      JOIN person p ON p.id = pl.person_id
      JOIN team t ON t.id = pl.team_id
      JOIN medical_card mc ON mc.player_id = pl.id
      WHERE mc.blood_type = ${bloodType}
    `;
  }

  async coachesByExperience(minExperience: number) {
    return this.prisma.$queryRaw`
      SELECT p.first_name || ' ' || p.last_name AS coach, c.coach_type, c.experience
      FROM coach c
      JOIN person p ON p.id = c.person_id
      WHERE c.experience > ${minExperience}
      ORDER BY c.experience DESC
    `;
  }

  async playersWithCardsAfterDate(afterDate: string) {
    return this.prisma.$queryRaw`
      SELECT p.first_name || ' ' || p.last_name AS player, t.name AS team, SUM(ms.cards) AS total_cards
      FROM player pl
      JOIN person p ON p.id = pl.person_id
      JOIN team t ON t.id = pl.team_id
      JOIN match_stats ms ON ms.player_id = pl.id
      JOIN match m ON m.id = ms.match_id
      WHERE ms.cards > 0 AND m.date >= ${new Date(afterDate)}::date
      GROUP BY p.first_name, p.last_name, t.name
      ORDER BY total_cards DESC
    `;
  }

  async playersInAllMatches(teamName: string) {
    return this.prisma.$queryRaw`
      SELECT p.first_name || ' ' || p.last_name AS player, t.name AS team
      FROM player pl
      JOIN person p ON p.id = pl.person_id
      JOIN team t ON t.id = pl.team_id
      WHERE t.name = ${teamName}
      AND NOT EXISTS (
        SELECT m.id FROM match m
        WHERE (m.home_team_id = pl.team_id OR m.away_team_id = pl.team_id)
        AND NOT EXISTS (
          SELECT 1 FROM match_stats ms WHERE ms.match_id = m.id AND ms.player_id = pl.id
        )
      )
    `;
  }

  async playersSameMatchesAs(firstName: string, lastName: string) {
    return this.prisma.$queryRaw`
      SELECT DISTINCT p.first_name || ' ' || p.last_name AS player, t.name AS team
      FROM player pl
      JOIN person p ON p.id = pl.person_id
      JOIN team t ON t.id = pl.team_id
      WHERE pl.id != (
        SELECT pl2.id FROM player pl2
        JOIN person p2 ON p2.id = pl2.person_id
        WHERE p2.first_name = ${firstName} AND p2.last_name = ${lastName}
        LIMIT 1
      )
      AND NOT EXISTS (
        SELECT ms.match_id FROM match_stats ms
        JOIN player pl2 ON pl2.id = ms.player_id
        JOIN person p2 ON p2.id = pl2.person_id
        WHERE p2.first_name = ${firstName} AND p2.last_name = ${lastName}
        EXCEPT
        SELECT ms2.match_id FROM match_stats ms2 WHERE ms2.player_id = pl.id
      )
    `;
  }
}
