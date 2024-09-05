import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
  constructor(private repository: ItemRepository) {}

  async fetchManyItem() {
    const items = await this.repository.findManyItem();
    if (!items.length) {
      throw new NotFoundException('아이템이 존재하지 않습니다.');
    }

    return items;
  }

  async fetchItem({ itemId }: { itemId: number }) {
    const item = await this.repository.findItem({ id: itemId });
    if (!item) {
      throw new NotFoundException('아이템이 존재하지 않습니다.');
    }

    return item;
  }
}
