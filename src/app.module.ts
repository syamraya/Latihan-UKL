import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PresensiModule } from './presensi/presensi.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, PresensiModule, UsersModule],
  controllers: [],
  providers: []
})
export class AppModule {}
