import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

async register(dto: RegisterDto) {
  const hashed = await bcrypt.hash(dto.password, 10);

  return this.prisma.user.create({
    data: {
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashed,
    },
  });
  }
  async search(query: string) {
  if (!query) return [];

  return this.prisma.user.findMany({
    where: {
      username: {
        contains: query
      },
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
    },
    take: 10,
  });
}

async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });

    const topicsCount = await this.prisma.topic.count({
      where: { authorId: userId },
    });

    const postsCount = await this.prisma.post.count({
      where: { authorId: userId },
    });

    const likesCount = await this.prisma.postLike.count({
      where: {
        post: {
          authorId: userId,
        },
      },
    });

    return {
      user,
      stats: {
        topicsCount,
        postsCount,
        likesCount,
      },
    };
  }
 
async getUserProfile(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  });

  const followers = await this.prisma.follow.count({
    where: { followingId: userId },
  });

  const following = await this.prisma.follow.count({
    where: { followerId: userId },
  });

  return {
    ...user,
    stats: {
      followers,
      following,
    },
  };
}


  async getUserTopics(userId: number) {
  return this.prisma.topic.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { posts: true } },
    },
  });
}

async getUserPosts(userId: number) {
  return this.prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      topic: { select: { id: true, title: true } },
    },
  });
}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    const token = this.jwt.sign({
      userId: user.id,
      role: user.role,
    });

    return { token };
  }
}
