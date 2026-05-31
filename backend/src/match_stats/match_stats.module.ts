import { Module } from '@nestjs/common';
import { MatchStatsService } from './match_stats.service';
import { MatchStatsController } from './match_stats.controller';

@Module({ providers: [MatchStatsService], controllers: [MatchStatsController] })
export class MatchStatsModule {}
