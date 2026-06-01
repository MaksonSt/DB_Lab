import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('coaches')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get() findAll() {
    return this.coachService.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.coachService.findOne(+id);
  }
  @Post() create(@Body() body: any) {
    return this.coachService.create(body);
  }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) {
    return this.coachService.update(+id, body);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}
