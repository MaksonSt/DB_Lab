import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.position.findMany();
  }
  findOne(id: number) {
    return this.prisma.position.findUnique({ where: { id } });
  }
  create(data: { name: string }) {
    return this.prisma.position.create({ data });
  }
  update(id: number, data: { name?: string }) {
    return this.prisma.position.update({ where: { id }, data });
  }
  remove(id: number) {
    return this.prisma.position.delete({ where: { id } });
  }
}
