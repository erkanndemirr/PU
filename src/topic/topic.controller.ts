import { Controller, Get, Post, Body, UseGuards, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: any, @Request() req: any) {
    // React Native'den gelen body: { title, topicContent, category, country, state, image }
    return this.topicService.create({
      ...body,
      imageUrl: body.image, // Frontend'de 'image' adıyla yolladığın için imageUrl'e eşliyoruz
      authorId: req.user.id, 
    });
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(Number(id));
  }
}