import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParcelType, ParcelTypeDocument } from './schemas/parcel-type.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateParcelTypeDto } from './dto/create-parcel-type.dto';

@Injectable()
export class ParcelTypeService {
  constructor(
    @InjectModel(ParcelType.name)
    private parcelTypeModel: Model<ParcelTypeDocument>,
  ) {}

  async create(createParcelTypeDto: CreateParcelTypeDto) {
   try {
     const parcelType = new this.parcelTypeModel(createParcelTypeDto);
     await parcelType.save();
   } catch (error) {
    
   }
  }

  async findAll() {
    return this.parcelTypeModel.find().exec();
  }

  async findOne(id: string) {
    return this.parcelTypeModel.findById(id).exec();
  }

  async update(id: string, updateParcelTypeDto: any) {
    return this.parcelTypeModel.findByIdAndUpdate(id, updateParcelTypeDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.parcelTypeModel.findByIdAndDelete(id).exec();
  }
}
