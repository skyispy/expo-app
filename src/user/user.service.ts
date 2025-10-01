import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models';
import { Repository } from 'typeorm';
import type { UserProfileUpdateDto, UserSignupDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { saveFileToDist } from '../common/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
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
  async updateUserProfile(
    userId: number,
    userProfileUpdateDto: UserProfileUpdateDto,
  ): Promise<UserEntity> {
    const prevUser = await this.findUserById(userId);
    if (!prevUser) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    const param: Partial<UserEntity> = {
      nickname: userProfileUpdateDto.nickname,
      introduction: userProfileUpdateDto.introduction,
    };
    await this.userRepository.update({ userId }, param);
    const user = await this.findUserById(userId);
    if (!user) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  // 프로필 이미지 업로드
  async uploadProfileImage(file: Express.Multer.File, userId: number): Promise<string> {
    const filePath = saveFileToDist(file, 'profile-images');
    const baseurl = this.configService.get<string>('BASE_URL');
    const imgUrl = baseurl + '/' + filePath;
    await this.userRepository.update({ userId }, { profileImageUrl: imgUrl });
    return imgUrl;
  }
}
