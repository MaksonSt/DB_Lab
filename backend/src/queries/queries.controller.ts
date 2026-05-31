import { Controller, Get, Query } from '@nestjs/common';
import { QueriesService } from './queries.service';

@Controller('queries')
export class QueriesController {
  constructor(private readonly service: QueriesService) {}

  @Get('1')
  playersWithGoals(@Query('team') team: string, @Query('goals') goals: string) {
    return this.service.playersWithGoals(team, +goals || 0);
  }

  @Get('2')
  matchesByStadium(@Query('stadium') stadium: string, @Query('date') date: string) {
    return this.service.matchesByStadiumAfterDate(stadium, date);
  }

  @Get('3')
  playersByBloodType(@Query('bloodType') bloodType: string) {
    return this.service.playersByBloodType(bloodType);
  }

  @Get('4')
  coachesByExperience(@Query('experience') experience: string) {
    return this.service.coachesByExperience(+experience || 0);
  }

  @Get('5')
  playersWithCards(@Query('date') date: string) {
    return this.service.playersWithCardsAfterDate(date);
  }

  @Get('6')
  playersInAllMatches(@Query('team') team: string) {
    return this.service.playersInAllMatches(team);
  }

  @Get('7')
  playersSameMatches(@Query('firstName') firstName: string, @Query('lastName') lastName: string) {
    return this.service.playersSameMatchesAs(firstName, lastName);
  }
}
