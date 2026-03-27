import { Test, TestingModule } from '@nestjs/testing';
import { ItemCategoryController } from './item-category.controller';
import { ItemCategoryService } from './item-category.service';

describe('ItemCategoryController', () => {
  let controller: ItemCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemCategoryController],
      providers: [ItemCategoryService],
    }).compile();

    controller = module.get<ItemCategoryController>(ItemCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
