import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MedicalCardService } from './medical_card.service';

@Controller('medical-cards')
export class MedicalCardController {
  constructor(private readonly service: MedicalCardService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(+id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}
