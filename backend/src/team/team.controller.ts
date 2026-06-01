import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get() findAll() {
    return this.teamService.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }
  @Post() create(@Body() body: any) {
    return this.teamService.create(body);
  }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) {
    return this.teamService.update(+id, body);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
