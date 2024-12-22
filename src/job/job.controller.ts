import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileUploadDto } from './entities/job.entity';
import { FileInterceptor } from '@nestjs/platform-express';

const upload = {
  storage: diskStorage({
    destination: process.cwd() + '/public/img',
    filename: (req, file, callback) =>
      callback(null, new Date().getTime() + '_' + file.originalname),
  }),
};

class job {
  @ApiProperty()
  job_name: string;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  job_title: string;

  @ApiProperty()
  job_sub_title: string;

  @ApiProperty()
  job_star: number;

  @ApiProperty()
  job_type_detail_id: number;

  @ApiProperty()
  user_id: number;
}

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: job })
  @Post('create-job')
  signUp(@Body() job: job) {
    return this.jobService.create(job);
  }

  @Get('get-all-job')
  findAll() {
    return this.jobService.findAll();
  }

  @Get('get-job-by-id/:id')
  findOneById(@Param('id') id: string) {
    return this.jobService.findOneById(+id);
  }

  @Get('get-job-by-job-name')
  findOneByJobName(@Body() body: { job_name: string }) {
    return this.jobService.findOneByJobName(body.job_name);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-job-by-id/:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-job-by-id/:id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor('file', upload))
  @Patch('/upload-job-picture-by-id/:id')
  uploadPictureById(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.jobService.uploadJobPictureById(+id, file);
  }
}
