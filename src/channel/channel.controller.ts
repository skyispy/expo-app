import { Controller, Get, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResponseDto } from './dto/channel.dto';
import { ChannelResponseSchema } from './dto/channel.schema';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  private readonly logger = new Logger(ChannelController.name);
  // 채널 목록 조회
  @Get('/')
  async getChannelList(): Promise<{ result: ChannelResponseDto[] }> {
    this.logger.log('GetChannelList');
    const channelList = await this.channelService.selectChannelList();
    this.logger.log('총 채널 수 : ' + channelList.length);
    const validateChannelList = channelList
      .map((channel) => ChannelResponseSchema.safeParse(channel))
      .filter((result) => result.success)
      .map((result) => result.data);
    return { result: validateChannelList };
  }
}
