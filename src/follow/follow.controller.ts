import { Controller, Post, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowService } from './follow.service';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private followService: FollowService) {}

  // takip / takibi bırak
  @Post(':id')
  toggleFollow(@Param('id') id: string, @Req() req) {
    return this.followService.toggleFollow(
      req.user.userId,
      +id,
    );
  }

  // takipçi & takip sayıları
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.followService.getFollowStats(+id);
  }

  // beni takip ediyor mu?
  @Get(':id/is-following')
  isFollowing(@Param('id') id: string, @Req() req) {
    return this.followService.isFollowing(
      req.user.userId,
      +id,
    );
  }
}
