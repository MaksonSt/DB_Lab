import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingCoachService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.training_coach.findMany({
      include: { training: true, coach: { include: { person: true } } },
    });
  }
  create(data: { training_id: number; coach_id: number }) {
    return this.prisma.training_coach.create({ data });
  }
  remove(training_id: number, coach_id: number) {
    return this.prisma.training_coach.delete({ where: { training_id_coach_id: { training_id, coach_id } } });
  }
}
