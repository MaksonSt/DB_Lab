import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClubService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.club.findMany({ include: { team: true } });
  }

  findOne(name: string) {
    return this.prisma.club.findUnique({
      where: { name },
      include: { team: true },
    });
  }

  create(data: {
    name: string;
    city: string;
    stadium?: string;
    sponsor?: string;
  }) {
    return this.prisma.club.create({ data });
  }

  update(
    name: string,
    data: { city?: string; stadium?: string; sponsor?: string },
  ) {
    return this.prisma.club.update({ where: { name }, data });
  }

  remove(name: string) {
    return this.prisma.club.delete({ where: { name } });
  }
}
