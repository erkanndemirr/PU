import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':topicId')
  create(
    @Param('topicId') topicId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.postService.create(content, +topicId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Req() req) {
    return this.postService.toggleLike(+id, req.user.userId);
  }

  @Get('topic/:topicId')
  findByTopic(@Param('topicId') topicId: string) {
    return this.postService.findByTopic(+topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.postService.delete(
      +id,
      req.user.userId,
      req.user.role,
    );
  }
}
