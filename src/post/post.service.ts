import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

 async create(content: string, topicId: number, userId: number) {
  return this.prisma.post.create({
    data: {
      content,
      topicId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          email: true,
        },
      },
    },
  });
}
async updatePost(
  postId: number,
  content: string,
  userId: number,
) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorId !== userId) {
    throw new ForbiddenException('Yetkin yok');
  }

  return this.prisma.post.update({
    where: { id: postId },
    data: { content },
  });
}
async getUserPosts(
  userId: number,
  page = 1,
  limit = 10,
) {
  return this.prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      topic: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

async deletePost(postId: number, userId: number) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorId !== userId) {
    throw new ForbiddenException('Yetkin yok');
  }

  return this.prisma.post.delete({
    where: { id: postId },
  });
}

    async findByTopic(topicId: number,userId?:number) {
    return this.prisma.post.findMany({
      where: { topicId },
      include: {
        author: {
          select: {  username: true },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
  async delete(postId: number, userId: number, role: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return;

    // Admin her şeyi silebilir
    if (role === 'ADMIN') {
      return this.prisma.post.delete({ where: { id: postId } });
    }

    // User sadece kendi postunu
    if (post.authorId !== userId) {
      throw new ForbiddenException('Bu postu silemezsin');
    }

    return this.prisma.post.delete({ where: { id: postId } });
  }

  async toggleLike(postId: number, userId: number) {
  const existing = await this.prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existing) {
    await this.prisma.postLike.delete({
      where: { id: existing.id },
    });
    return { liked: false };
  }

  await this.prisma.postLike.create({
    data: { userId, postId },
  });

  return { liked: true };
}

}
