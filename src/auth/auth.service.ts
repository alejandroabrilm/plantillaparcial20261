import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './entities/auth-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUsersRepository: Repository<AuthUser>,
  ) {}

  async register(registerDto: RegisterDto) {
    const authUser = this.authUsersRepository.create({
      ...registerDto,
      apiKey: randomUUID(),
    });
    const savedAuthUser = await this.authUsersRepository.save(authUser);

    return {
      apiKey: savedAuthUser.apiKey,
      name: savedAuthUser.name,
      email: savedAuthUser.email,
    };
  }

  async isValidApiKey(apiKey: string): Promise<boolean> {
    const count = await this.authUsersRepository.count({ where: { apiKey } });
    return count > 0;
  }
}
