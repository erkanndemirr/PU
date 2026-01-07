import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async toggleFollow(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Kendini takip edemezsin');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      await this.prisma.follow.delete({
        where: { id: existing.id },
      });
      return { following: false };
    }

    await this.prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return { following: true };
  }

  async getFollowStats(userId: number) {
    const followers = await this.prisma.follow.count({
      where: { followingId: userId },
    });

    const following = await this.prisma.follow.count({
      where: { followerId: userId },
    });

    return { followers, following };
  }

  async isFollowing(currentUserId: number, targetUserId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    return { following: !!follow };
  }
}
