import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get() findAll() { return this.playerService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.playerService.findOne(+id); }
  @Post() create(@Body() body: any) { return this.playerService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.playerService.update(+id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.playerService.remove(+id); }
}
