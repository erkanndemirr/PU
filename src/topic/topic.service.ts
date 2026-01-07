import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  // Parametreleri bir obje olarak almak (DTO mantığı) her zaman daha güvenlidir
  create(data: {
    title: string;
    topicContent?: string;
    category?: string;
    country?: string;
    state?: string;
    imageUrl?: string;
    authorId: number;
  }) {
    return this.prisma.topic.create({
      data: {
        title: data.title,
        topicContent: data.topicContent,
        category: data.category,
        country: data.country,
        state: data.state,
        imageUrl: data.imageUrl,
        author: {
          connect: { id: data.authorId }, // authorId'yi user tablosuna bağlar
        },
      },
    });
  }

  findAll() {
    return this.prisma.topic.findMany({
      include: {
        author: { select: { id: true, email: true, username: true } },
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
          select: { id: true, username: true },
        },
        posts: {
          include: {
            author: {
              select: { id: true, username: true },
            },
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}