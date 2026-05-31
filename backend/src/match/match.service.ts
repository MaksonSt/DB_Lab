import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  create(data: any) {
    return this.prisma.match.create({
      data: { ...data, date: new Date(data.date), time: new Date(`1970-01-01T${data.time}`) },
    });
  }
  update(id: number, data: any) {
    const d: any = { ...data };
    if (d.date) d.date = new Date(d.date);
    if (d.time) d.time = new Date(`1970-01-01T${d.time}`);
    return this.prisma.match.update({ where: { id }, data: d });
  }
  remove(id: number) { return this.prisma.match.delete({ where: { id } }); }
}
