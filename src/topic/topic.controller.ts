import { Controller, Get, Post, Body, UseGuards, Req ,Param} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body('title') title: string, @Req() req) {
    return this.topicService.create(title, req.user.userId);
  }
@Get(':id')
findOne(@Param('id') id: string) {
  return this.topicService.findOne(Number(id));
}

  @Get()
  findAll() {
    return this.topicService.findAll();
  }
}
