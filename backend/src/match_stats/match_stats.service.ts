import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchStatsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.match_stats.findMany({
      include: { match: true, player: { include: { person: true } } },
    });
  }
  findOne(match_id: number, player_id: number) {
    return this.prisma.match_stats.findUnique({
      where: { match_id_player_id: { match_id, player_id } },
    });
  }
  create(data: {
    match_id: number;
    player_id: number;
    goals?: number;
    assists?: number;
    cards?: number;
    minutes_played?: number;
  }) {
    return this.prisma.match_stats.create({ data });
  }
  update(
    match_id: number,
    player_id: number,
    data: {
      goals?: number;
      assists?: number;
      cards?: number;
      minutes_played?: number;
    },
  ) {
    return this.prisma.match_stats.update({
      where: { match_id_player_id: { match_id, player_id } },
      data,
    });
  }
  remove(match_id: number, player_id: number) {
    return this.prisma.match_stats.delete({
      where: { match_id_player_id: { match_id, player_id } },
    });
  }
}
