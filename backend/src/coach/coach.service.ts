import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.coach.findMany({ include: { person: true, coach: true } });
  }
  findOne(id: number) {
    return this.prisma.coach.findUnique({ where: { id }, include: { person: true, coach: true } });
  }
  create(data: { person_id: number; coach_type?: string; head_coach_id?: number; experience?: number }) {
    return this.prisma.coach.create({ data });
  }
  update(id: number, data: { coach_type?: string; head_coach_id?: number; experience?: number }) {
    return this.prisma.coach.update({ where: { id }, data });
  }
  remove(id: number) { return this.prisma.coach.delete({ where: { id } }); }
}
