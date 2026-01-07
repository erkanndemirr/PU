import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { TopicModule } from './topic/topic.module';
import { PostModule } from './post/post.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { FollowModule } from './follow/follow.module';


@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
         envFilePath: '.env',
    }),
    PrismaModule,
    ProfileModule,
    AuthModule,
    TopicModule,
    PostModule,
    FollowModule
  ],
})
export class AppModule {}
