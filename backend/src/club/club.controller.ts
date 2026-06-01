import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClubService } from './club.service';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.clubService.findOne(name);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      city: string;
      stadium?: string;
      sponsor?: string;
    },
  ) {
    return this.clubService.create(body);
  }

  @Put(':name')
  update(
    @Param('name') name: string,
    @Body() body: { city?: string; stadium?: string; sponsor?: string },
  ) {
    return this.clubService.update(name, body);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.clubService.remove(name);
  }
}
