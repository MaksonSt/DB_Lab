import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PositionService } from './position.service';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get() findAll() { return this.positionService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.positionService.findOne(+id); }
  @Post() create(@Body() body: { name: string }) { return this.positionService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: { name?: string }) { return this.positionService.update(+id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.positionService.remove(+id); }
}
