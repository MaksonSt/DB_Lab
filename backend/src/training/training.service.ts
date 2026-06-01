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
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.training.findMany({ include: { team: true } });
  }
  findOne(id: number) {
    return this.prisma.training.findUnique({
      where: { id },
      include: { team: true },
    });
  }
  create(data: {
    date: string;
    time: string;
    duration?: number;
    type?: string;
    team_id?: number;
  }) {
    return this.prisma.training.create({
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
    return this.prisma.training.delete({ where: { id } });
  }
}
