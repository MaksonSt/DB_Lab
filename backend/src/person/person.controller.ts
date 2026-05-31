import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get() findAll() { return this.personService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.personService.findOne(+id); }
  @Post() create(@Body() body: { first_name: string; last_name: string; nationality?: string }) { return this.personService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.personService.update(+id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.personService.remove(+id); }
}
