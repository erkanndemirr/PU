import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  create(title: string, userId: number) {
    return this.prisma.topic.create({
      data: {
        title,
        authorId: userId,
      },
    });
  }

  findAll() {
    return this.prisma.topic.findMany({
      include: {
        author: { select: { id: true, email: true } },
          _count: { select: { posts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

 findOne(id: number) {
  return this.prisma.topic.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, email: true },
      },
      posts: {
        include: {
          author: {
            select: { id: true, email: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}


}
