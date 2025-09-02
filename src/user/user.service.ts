import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models';
import { Repository } from 'typeorm';
import type { UserSignupDto } from './dto/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userSignupDto: UserSignupDto): Promise<UserEntity> {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(userSignupDto.password, 10);
    const user = this.userRepository.create({
      ...userSignupDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }
}
