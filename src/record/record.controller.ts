import { User } from 'src/user/entities/user.entity';
import { Role } from './../user/decorators/role.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { StartRecordDto } from './dto/startRecord.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { GetUser } from 'src/user/decorators/user.decorator';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Role('Any')
  @Post()
  async startRecord(
    @Body() startRecordDto: StartRecordDto,
    @GetUser() user: User,
  ) {
    const record = await this.recordService.startRecord(user, startRecordDto);
    return this.recordService.findRecordById(record.id);
  }

  @Get()
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
