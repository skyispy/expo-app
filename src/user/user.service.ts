import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.query('SELECT * FROM USER');
  }
}
