import { UpdateRecordDto } from './dto/updateRecords.dto';
import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { EndRecordDto } from './dto/endRecord.dto';
import { Role } from './../user/decorators/role.decorator';
import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { StartRecordDto } from './dto/startRecord.dto';
import { GetUser } from 'src/user/decorators/user.decorator';
import { MyInfoDto } from 'src/user/decorators/myInfo.dto';
import { GetUserRecordsDto } from './dto/getUserRecord';
import { EventGateway } from 'src/event/event.gateway';

@Controller('records')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly eventGateway: EventGateway,
  ) {}

  @Role('Any')
  @Post()
  async startRecord(
    @Body() startRecordDto: StartRecordDto,
    @GetUser() user: MyInfoDto,
  ) {
    const record = await this.recordService.startRecord(
      user.id,
      startRecordDto,
    );
    this.eventGateway.startWork(user.id);
    return this.recordService.findRecordById(record.id);
  }

  @Role('Any')
  @Patch('end')
  async update(@Body() endRecordDto: EndRecordDto, @GetUser() user: MyInfoDto) {
    if (!user.recordList.id) {
      throw new NotFoundException('초과근무 기록이 없습니다.');
    }

    const endRecord = await this.recordService.updateRecord(
      user.recordList.id,
      endRecordDto,
    );

    this.eventGateway.endWork(user.id);
    return this.recordService.findRecordById(endRecord.id);
  }

  @Role('Any')
  @Get()
  async getMyRecords(
    @Query() getMyRecordsDto: GetMyRecordsDto,
    @GetUser() user: MyInfoDto,
  ) {
    return this.recordService.findMyRecords(user.id, getMyRecordsDto);
  }

  @Role('Manager')
  @Get('admin')
  async getUserRecords(@Query() getUserRecordDto: GetUserRecordsDto) {
    return this.recordService.findAllRecords(getUserRecordDto);
  }

  @Role('Manager')
  @Patch('admin')
  async updateRecords(
    @Param('id') id: number,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    return this.recordService.updateRecord(id, updateRecordDto);
  }
}
