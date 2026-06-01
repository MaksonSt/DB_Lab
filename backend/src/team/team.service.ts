import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.team.findMany({ include: { club: true } });
  }
  findOne(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
      include: { club: true },
    });
  }
  create(data: { name: string; age_category?: string; club_name?: string }) {
    return this.prisma.team.create({ data });
  }
  update(
    id: number,
    data: { name?: string; age_category?: string; club_name?: string },
  ) {
    return this.prisma.team.update({ where: { id }, data });
  }
  remove(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }
}
