import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.person.findMany(); }
  findOne(id: number) { return this.prisma.person.findUnique({ where: { id } }); }
  create(data: { first_name: string; last_name: string; nationality?: string }) { return this.prisma.person.create({ data }); }
  update(id: number, data: { first_name?: string; last_name?: string; nationality?: string }) { return this.prisma.person.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.person.delete({ where: { id } }); }
}
