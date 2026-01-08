import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Patch,
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
  @Get('user/:id')
getUserPosts(
  @Param('id') id: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.postService.getUserPosts(
    +id,
    +page,
    +limit,
  );
}

@Get('topic/:topicId')
findByTopic(
  @Param('topicId') topicId: string,
  @Req() req,
) {
  const userId = req.user?.userId;
  return this.postService.findByTopic(+topicId, userId);
}
@UseGuards(JwtAuthGuard)
@Patch(':id')
updatePost(
  @Param('id') id: string,
  @Body('content') content: string,
  @Req() req,
) {
  return this.postService.updatePost(
    +id,
    content,
    req.user.userId,
  );
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
deletePost(
  @Param('id') id: string,
  @Req() req,
) {
  return this.postService.deletePost(
    +id,
    req.user.userId,
  );
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
