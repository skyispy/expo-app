import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../models';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { CommentCreateDto } from '../dto';
import { CommentExtraInfo } from '../../common/types';
import { ActionService } from '../../action/action.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    private readonly userService: UserService,
    private readonly actionService: ActionService,
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
  async getCommentListByTarget({
    userId,
    boardId,
    page,
    limit,
  }: {
    userId: number;
    boardId: number;
    page: number;
    limit: number;
  }): Promise<{ commentList: (CommentEntity & CommentExtraInfo)[]; totalCount: number }> {
    const [commentList, totalCount] = await this.commentRepository.findAndCount({
      where: {
        board: { boardId },
        status: 'active',
        parent: IsNull(),
        children: { status: 'active' },
      },
      relations: ['user', 'children', 'children.user', 'children.parent', 'children.parent.user'],
      order: { createDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const commentExtraInfoList = await Promise.all(
      commentList.map(async (comment) => {
        const commentActions = await this.actionService.getCommentActionSummary(
          comment.commentId,
          userId,
        );
        return { ...comment, ...commentActions };
      }),
    );

    return { commentList: commentExtraInfoList, totalCount };
  }

  // 댓글 개수 조회
  async countCommentListByTarget(boardId: number): Promise<number> {
    return await this.commentRepository.count({
      where: { board: { boardId }, status: 'active' },
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
