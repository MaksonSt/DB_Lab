import { Module } from '@nestjs/common';
import { TrainingCoachService } from './training_coach.service';
import { TrainingCoachController } from './training_coach.controller';

@Module({ providers: [TrainingCoachService], controllers: [TrainingCoachController] })
export class TrainingCoachModule {}
