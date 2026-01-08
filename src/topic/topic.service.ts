import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  // Parametreleri bir obje olarak almak (DTO mantığı) her zaman daha güvenlidir
  create(data: {
    title: string;
    topicContent: string;
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
 // 🟢 KULLANICININ TOPICLERİ
  async getMyTopics(userId: number) {
    return this.prisma.topic.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  // ✏️ TOPIC GÜNCELLE
  async updateTopic(
    topicId: number,
    title: string,
    userId: number,
  ) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic || topic.authorId !== userId) {
      throw new ForbiddenException('Yetkin yok');
    }

    return this.prisma.topic.update({
      where: { id: topicId },
      data: { title },
    });
  }

async deleteTopic(
  topicId: number,
  userId: number,
  role: string,
) {
  const topic = await this.prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!topic) {
    throw new NotFoundException('Topic bulunamadı');
  }

  // 🔐 Admin her zaman silebilir
  if (role === 'ADMIN') {
    return this.prisma.topic.delete({
      where: { id: topicId },
    });
  }

  // 🔐 Topic sahibi değilse
  if (topic.authorId !== userId) {
    throw new ForbiddenException('Bu başlığı silemezsin');
  }

  // ❌ Post varsa normal kullanıcı silemez
  if (topic._count.posts > 0) {
    throw new ForbiddenException(
      'Bu başlıkta yorumlar var, silme yetkisi sadece adminlerde',
    );
  }

  // ✅ Post yok → owner silebilir
  return this.prisma.topic.delete({
    where: { id: topicId },
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