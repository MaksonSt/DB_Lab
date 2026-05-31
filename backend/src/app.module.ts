import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClubModule } from './club/club.module';
import { PositionModule } from './position/position.module';
import { PersonModule } from './person/person.module';
import { TeamModule } from './team/team.module';
import { CoachModule } from './coach/coach.module';
import { PlayerModule } from './player/player.module';
import { MedicalCardModule } from './medical_card/medical_card.module';
import { TrainingModule } from './training/training.module';
import { MatchModule } from './match/match.module';
import { MatchStatsModule } from './match_stats/match_stats.module';
import { TrainingCoachModule } from './training_coach/training_coach.module';
import { QueriesModule } from './queries/queries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClubModule,
    PositionModule,
    PersonModule,
    TeamModule,
    CoachModule,
    PlayerModule,
    MedicalCardModule,
    TrainingModule,
    MatchModule,
    MatchStatsModule,
    TrainingCoachModule,
    QueriesModule,
  ],
})
export class AppModule {}
