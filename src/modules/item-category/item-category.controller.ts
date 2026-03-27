import { Controller } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';

@Controller('item-category')
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}
}
