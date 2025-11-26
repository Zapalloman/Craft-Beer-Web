import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check - raíz' })
  root() {
    return { status: 'ok', message: 'Cervecería Craft & Beer API', version: '1.0.0' };
  }
}
