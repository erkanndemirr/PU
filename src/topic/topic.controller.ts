import { Controller, Get, Post, Body, UseGuards, Param, Request, Patch, Req, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}
// 🟢 KULLANICININ KENDİ TOPICLERİ
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyTopics(@Req() req) {
    return this.topicService.getMyTopics(req.user.userId);
  }

  // ✏️ TOPIC DÜZENLE
 @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateTopic(
    @Param('id') id: string,
    @Body('title') title: string,
    @Req() req,
  ) {
    return this.topicService.updateTopic(
      +id,
      title,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
@Delete(':id')
deleteTopic(
  @Param('id') id: string,
  @Req() req,
) {
  return this.topicService.deleteTopic(
    +id,
    req.user.userId,
    req.user.role,
  );
}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: any, @Request() req: any) {
    // React Native'den gelen body: { title, topicContent, category, country, state, image }
    return this.topicService.create({
      ...body,
      imageUrl: body.image, // Frontend'de 'image' adıyla yolladığın için imageUrl'e eşliyoruz
      authorId: req.user.userId || req.user.sub || req.user.id,
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