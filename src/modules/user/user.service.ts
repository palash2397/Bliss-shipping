import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { UserDocument, User } from './schemas/create-user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto) {
    try {
      const userDoc = await this.userModel.findOne({ email: dto.email });
      if (userDoc && userDoc.role === dto.role) {
        return new ApiResponse(400, {}, Msg.USER_EXISTS);
      }
      const user = await this.userModel.create(dto);
      return new ApiResponse(201, user, Msg.USER_REGISTER);
    } catch (error) {
      console.log(`error while creating user: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
