import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { UserDocument, User } from './schemas/create-user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto) {
    try {
      const userDoc = await this.userModel.findOne({ email: dto.email });
      if (userDoc && (userDoc.role === dto.role)) {
        return new ApiResponse(400, {}, Msg.USER_EXISTS);
      }
      const user = await this.userModel.create(dto);
      return new ApiResponse(201, user, Msg.USER_REGISTER);
    } catch (error) {
      console.log(`error while creating user: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        return new ApiResponse(404, {}, Msg.INVALID_CREDENTIALS);
      }

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }

      if (user.role !== dto.role) {
        return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      }

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }
      
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: '10d',
      });

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
      return new ApiResponse(200, userData, Msg.LOGIN_SUCCESS);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
