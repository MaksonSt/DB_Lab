import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { TrainingCoachService } from './training_coach.service';

@Controller('training-coaches')
export class TrainingCoachController {
  constructor(private readonly service: TrainingCoachService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() body: { training_id: number; coach_id: number }) { return this.service.create(body); }
  @Delete(':trainingId/:coachId') remove(@Param('trainingId') t: string, @Param('coachId') c: string) {
    return this.service.remove(+t, +c);
  }
}
