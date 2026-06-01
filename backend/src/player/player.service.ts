import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.player.findMany({
      include: { person: true, position: true, team: true },
    });
  }
  findOne(id: number) {
    return this.prisma.player.findUnique({
      where: { id },
      include: { person: true, position: true, team: true },
    });
  }
  create(data: {
    person_id: number;
    jersey_number?: number;
    position_id?: number;
    team_id?: number;
  }) {
    return this.prisma.player.create({ data });
  }
  update(
    id: number,
    data: { jersey_number?: number; position_id?: number; team_id?: number },
  ) {
    return this.prisma.player.update({ where: { id }, data });
  }
  remove(id: number) {
    return this.prisma.player.delete({ where: { id } });
  }
}
