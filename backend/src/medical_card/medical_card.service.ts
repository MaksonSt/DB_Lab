import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalCardService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.medical_card.findMany({
      include: { player: { include: { person: true } } },
    });
  }
  findOne(id: number) {
    return this.prisma.medical_card.findUnique({
      where: { id },
      include: { player: { include: { person: true } } },
    });
  }
  create(data: { player_id: number; blood_type?: string; allergies?: string }) {
    return this.prisma.medical_card.create({ data });
  }
  update(id: number, data: { blood_type?: string; allergies?: string }) {
    return this.prisma.medical_card.update({ where: { id }, data });
  }
  remove(id: number) {
    return this.prisma.medical_card.delete({ where: { id } });
  }
}
