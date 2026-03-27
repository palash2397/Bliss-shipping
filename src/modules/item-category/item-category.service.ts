import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ItemCategory,
  ItemCategoryDocument,
} from './schemas/item-category.schema';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class ItemCategoryService {
  constructor(
    @InjectModel(ItemCategory.name)
    private itemCategoryModel: Model<ItemCategoryDocument>,
  ) {}

  async create(createItemCategoryDto: CreateItemCategoryDto) {
    try {
      const createdItemCategory = new this.itemCategoryModel(
        createItemCategoryDto,
      );
      await createdItemCategory.save();

      return new ApiResponse(
        201,
        createdItemCategory,
        Msg.ITEM_CATEGORY_CREATED,
      );
    } catch (error) {
      console.log(`Error creating item category: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const itemCategories = await this.itemCategoryModel.find();
      if (!itemCategories || itemCategories.length === 0) {
        return new ApiResponse(404, {}, Msg.ITEM_CATEGORIES_NOT_FOUND);
      }

      return new ApiResponse(200, itemCategories, Msg.ITEM_CATEGORIES_FETCHED);
    } catch (error) {
      console.log(`Error fetching item categories: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const itemCategory = await this.itemCategoryModel.findById(id);
      if (!itemCategory) {
        return new ApiResponse(404, {}, Msg.ITEM_CATEGORY_NOT_FOUND);
      }
      return new ApiResponse(200, itemCategory, Msg.ITEM_CATEGORY_FETCHED);
    } catch (error) {
      console.log(`Error fetching item category: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
