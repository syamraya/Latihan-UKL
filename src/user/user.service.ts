import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string; role?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email }});
    if (exists) throw new Error('Email already exists');
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: data.role ?? 'SISWA' }
    });
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: number, payload: any) {
    const user = await this.prisma.user.findUnique({ where: { id }});
    if (!user) throw new NotFoundException('User not found');
    const data: any = { ...payload };
    if (payload.password) data.password = await bcrypt.hash(payload.password, 10);
    const updated = await this.prisma.user.update({ where: { id }, data });
    const { password, ...rest } = updated;
    return rest;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }});
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user;
    return rest;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(u => {
      // remove password
      const { password, ...rest } = u;
      return rest;
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id }});
    return { deleted: true };
  }
}
