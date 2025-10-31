import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './models';
import { UserService } from '../user/service/user.service';
import type { CommentCreateDto } from './dto/comment.dto';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    private readonly userService: UserService,
  ) {}

  // 댓글 생성
  async createComment(commentCreateDto: CommentCreateDto, userId: number): Promise<CommentEntity> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const commentData: Partial<CommentEntity> = {
      ...commentCreateDto,
      status: 'active',
      user,
    };
    // 부모 댓글이 존재하는지 확인
    if (commentCreateDto.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { commentId: commentCreateDto.parentCommentId },
      });
      if (!parentComment) {
        throw new BadRequestException('존재하지 않는 부모 댓글입니다.');
      }
      commentData.parent = parentComment;
    }
    const newComment = this.commentRepository.create(commentData);
    return await this.commentRepository.save(newComment);
  }

  // 댓글 페이징 조회
  async getCommentListByTarget(
    targetId: number,
    targetType: string,
    page: number,
    limit: number,
  ): Promise<CommentEntity[]> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.children', 'children', 'children.status = :childStatus', {
        childStatus: 'active',
      })
      .leftJoinAndSelect('children.user', 'childrenUser')
      .leftJoinAndSelect('children.parent', 'childrenParent')
      .leftJoinAndSelect('childrenParent.user', 'childrenParentUser')
      .where('comment.targetId = :targetId', { targetId })
      .andWhere('comment.targetType = :targetType', { targetType })
      .andWhere('comment.status = :status', { status: 'active' })
      .andWhere('comment.parent IS NULL')
      .orderBy('comment.likes', 'DESC')
      .addOrderBy('comment.createDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  // 댓글 개수 조회
  async countCommentListByTarget(targetId: number, targetType: string): Promise<number> {
    return await this.commentRepository.count({
      where: { targetType, targetId, status: 'active' },
    });
  }

  // 댓글 수정
  async updateComment(content: string, commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { commentId, status: 'active' },
      relations: ['user'],
    });
    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    if (comment.user.userId !== userId) {
      throw new UnauthorizedException('댓글 수정 권한이 없습니다.');
    }
    await this.commentRepository.update({ commentId }, { content });
  }

  // 댓글 삭제
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { commentId, status: 'active' },
      relations: ['user'],
    });
    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    if (comment.user.userId !== userId) {
      throw new UnauthorizedException('댓글 삭제 권한이 없습니다.');
    }
    await this.commentRepository.update(
      { commentId },
      { status: 'deleted', deleteDate: new Date() },
    );
  }
}
