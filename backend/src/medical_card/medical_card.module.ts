import { Module } from '@nestjs/common';
import { MedicalCardService } from './medical_card.service';
import { MedicalCardController } from './medical_card.controller';

@Module({ providers: [MedicalCardService], controllers: [MedicalCardController] })
export class MedicalCardModule {}
