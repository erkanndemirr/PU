import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req) {
    return this.authService.getMe(req.user.userId);
  }

  @Get('search')
  searchUsers(@Query('q') q: string) {
    return this.authService.search(q);
  }

  @Get(':id')
  getUserProfile(@Param('id') id: string) {
    return this.authService.getUserProfile(+id); // ✅ service
  }
   @Get(':id/topics')
  getUserTopics(@Param('id') id: string) {
    return this.authService.getUserTopics(+id);
  }

  @Get(':id/posts')
  getUserPosts(@Param('id') id: string) {
    return this.authService.getUserPosts(+id);
  }
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
