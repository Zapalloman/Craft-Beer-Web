import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check - raíz' })
  root() {
    return { status: 'ok', message: 'Cervecería Craft & Beer API' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
