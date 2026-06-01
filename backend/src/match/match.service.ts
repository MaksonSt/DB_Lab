import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type MatchCreate = {
  date: string;
  time: string;
  stadium: string;
  home_team_id: number;
  away_team_id: number;
  goals?: number;
};

type MatchUpdate = Partial<MatchCreate>;

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.match.findMany({
      include: {
        team_match_home_team_idToteam: true,
        team_match_away_team_idToteam: true,
      },
    });
  }
  findOne(id: number) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        team_match_home_team_idToteam: true,
        team_match_away_team_idToteam: true,
        match_stats: { include: { player: { include: { person: true } } } },
      },
    });
  }
  create(data: MatchCreate) {
    return this.prisma.match.create({
      data: {
        ...data,
        date: new Date(data.date),
        time: new Date(`1970-01-01T${data.time}`),
      },
    });
  }
  update(id: number, data: MatchUpdate) {
    return this.prisma.match.update({
      where: { id },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
        ...(data.time && { time: new Date(`1970-01-01T${data.time}`) }),
      },
    });
  }
  remove(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
