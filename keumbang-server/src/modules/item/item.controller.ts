import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemService } from './item.service';

@ApiTags('items')
@Controller('items')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  async getManyItem() {
    return await this.itemService.fetchManyItem();
  }
}
