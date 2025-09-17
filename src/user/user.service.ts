import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models';
import { Repository } from 'typeorm';
import type { UserProfileUpdateDto, UserSignupDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async createUser(userSignupDto: UserSignupDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(userSignupDto.email);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(userSignupDto.password, 10);
    const user = this.userRepository.create({
      email: userSignupDto.email,
      nickname: userSignupDto.nickname,
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
  async updateUserProfile(userProfileUpdateDto: UserProfileUpdateDto): Promise<UserEntity> {
    const prevUser = await this.findUserById(userProfileUpdateDto.userId);
    if (!prevUser) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    const param: Partial<UserEntity> = {
      nickname: userProfileUpdateDto.nickname,
      introduction: userProfileUpdateDto.introduction,
    };
    if (userProfileUpdateDto.profileImageUrl) {
      // profileImageUrl이 있을 때만 업데이트
      param.profileImageUrl = userProfileUpdateDto.profileImageUrl;
    }
    await this.userRepository.update({ userId: userProfileUpdateDto.userId }, param);
    const user = await this.findUserById(userProfileUpdateDto.userId);
    if (!user) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    return user;
  }
}
