import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoadingControlService } from './loading-control.service';
import { CreateLoadingControlDto } from './dto/create-loading-control.dto';
import { UpdateLoadingControlDto } from './dto/update-loading-control.dto';
import { FindLoadingControlDto } from './dto/find-loading-control.dto';

@ApiTags('Loading Control')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loading-control')
export class LoadingControlController {
  constructor(private readonly loadingControlService: LoadingControlService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo carregamento' })
  create(@Body() dto: CreateLoadingControlDto, @Req() req: any) {
    return this.loadingControlService.create(dto, req.user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar carregamento' })
  @ApiParam({ name: 'id', example: 1001, description: 'ID do carregamento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLoadingControlDto,
    @Req() req: any,
  ) {
    return this.loadingControlService.update(id, req.user.tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar carregamentos com filtro e paginação' })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'statusLt', required: false, example: 5 })
  findAll(@Query() query: FindLoadingControlDto, @Req() req: any) {
    return this.loadingControlService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar carregamento por ID' })
  @ApiParam({ name: 'id', example: 1001, description: 'ID do carregamento' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.loadingControlService.findOne(id, req.user.tenantId);
  }
}