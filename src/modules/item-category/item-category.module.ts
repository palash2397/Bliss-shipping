import { Module } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { ItemCategoryController } from './item-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ItemCategory,
  ItemCategorySchema,
} from './schemas/item-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemCategory.name, schema: ItemCategorySchema },
    ]),
  ],
  controllers: [ItemCategoryController],
  providers: [ItemCategoryService],
  exports: [
    ItemCategoryService,
    MongooseModule.forFeature([
      { name: ItemCategory.name, schema: ItemCategorySchema },
    ]),
  ],
})
export class ItemCategoryModule {}
