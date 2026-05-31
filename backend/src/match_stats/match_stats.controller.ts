import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MatchStatsService } from './match_stats.service';

@Controller('match-stats')
export class MatchStatsController {
  constructor(private readonly service: MatchStatsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':matchId/:playerId') findOne(@Param('matchId') m: string, @Param('playerId') p: string) {
    return this.service.findOne(+m, +p);
  }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':matchId/:playerId') update(@Param('matchId') m: string, @Param('playerId') p: string, @Body() body: any) {
    return this.service.update(+m, +p, body);
  }
  @Delete(':matchId/:playerId') remove(@Param('matchId') m: string, @Param('playerId') p: string) {
    return this.service.remove(+m, +p);
  }
}
