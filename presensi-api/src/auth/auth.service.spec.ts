import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Password salah');

    const token = this.jwt.sign({ userId: user.id, role: user.role });
    return { user, token };
  }

  async register(name: string, email: string, password: string, role: string = 'siswa') {
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    const token = this.jwt.sign({ userId: newUser.id, role: newUser.role });
    return { user: newUser, token };
  }
}
