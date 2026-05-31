import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.training.findMany({ include: { team: true } }); }
  findOne(id: number) { return this.prisma.training.findUnique({ where: { id }, include: { team: true } }); }
  create(data: { date: string; time: string; duration?: number; type?: string; team_id?: number }) {
    return this.prisma.training.create({ data: { ...data, date: new Date(data.date), time: new Date(`1970-01-01T${data.time}`) } });
  }
  update(id: number, data: any) {
    const d: any = { ...data };
    if (d.date) d.date = new Date(d.date);
    if (d.time) d.time = new Date(`1970-01-01T${d.time}`);
    return this.prisma.training.update({ where: { id }, data: d });
  }
  remove(id: number) { return this.prisma.training.delete({ where: { id } }); }
}
