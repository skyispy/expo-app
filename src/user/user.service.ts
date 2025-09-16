import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models';
import { Repository } from 'typeorm';
import type { UserRequestDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async createUser(userRequestDto: UserRequestDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(userRequestDto.email);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(userRequestDto.password, 10);
    const user = this.userRepository.create({
      email: userRequestDto.email,
      nickname: userRequestDto.nickname,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  // 이메일로 사용자 조회
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  // 닉네임으로 사용자 조회
  async findUserByNickname(nickname: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ nickname });
  }

  // 사용자 ID로 사용자 조회
  async findUserById(userId: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ userId });
  }

  // 프로필 수정
  async updateUserProfile(userRequestDto: UserRequestDto): Promise<UserEntity> {
    const prevUser = await this.findUserById(userRequestDto.userId);
    if (!prevUser) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    const param: Partial<UserEntity> = {
      nickname: userRequestDto.nickname,
      introduction: userRequestDto.introduction,
    };
    if (userRequestDto.profileImageUrl) {
      // profileImageUrl이 있을 때만 업데이트
      param.profileImageUrl = userRequestDto.profileImageUrl;
    }
    await this.userRepository.update({ userId: userRequestDto.userId }, param);
    const user = await this.findUserById(userRequestDto.userId);
    if (!user) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    return user;
  }
}
