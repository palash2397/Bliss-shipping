import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { generateOtp, getExpirationTime } from '../../utils/helpers';
import { UserDocument, User } from './schemas/user.schema';
import {
  MerchantDocument,
  Merchant,
} from '../merchant/schemas/merchant-profile.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Role } from '../../common/enums/role.enum';
import { deleteOldFile } from 'src/utils/helpers/index';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
  ) {}

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

  async login(dto: LoginUserDto) {
    try {
      const { email, password, fcmToken } = dto;

      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        return new ApiResponse(404, {}, Msg.INVALID_CREDENTIALS);
      }

      // console.log('user', user);

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }

      // if (user.role !== dto.role) {
      //   return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      // }

      // console.log('password', typeof password);
      // console.log('user.password', typeof user.password);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      // console.log('isPasswordValid', isPasswordValid);


      if (!isPasswordValid) {
        return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      }

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }

      if (user.role == Role.USER) {
        if (!user.isVerified) {
          return new ApiResponse(401, {}, Msg.USER_NOT_VERIFIED);
        }
      }
      
      if (fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: '10d',
        },
      );

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        fcmToken: fcmToken || user.fcmToken,
      };

      if (user.role === Role.MERCHANT) {
        // console.log('Merchant ID:', user._id);
        const merchant = await this.merchantModel.findOne({ userId: user._id });
        if (merchant) {
          return new ApiResponse(
            404,
            { userData, isMerchant: true },
            Msg.MERCHANT_NOT_FOUND,
          );
        }
        return new ApiResponse(
          200,
          { userData, isMerchant: false },
          Msg.LOGIN_SUCCESS,
        );
      }
      return new ApiResponse(200, userData, Msg.LOGIN_SUCCESS);
    } catch (error) {
      console.log(`while login the user: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async sendOtp(phone: string){
  //   try {
  //     const user = await this.userModel.findOne({ phone });
  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //   } catch (error) {
  //     console.log(`error while sending otp: ${error}`);
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }

  async userRegister(dto: RegisterUserDto) {
    try {
      const { name, email, password, countryCode, phone } = dto;
      const user = await this.userModel.findOne({
        name,
        phone,
        countryCode,
      });

      if (user) {
        return new ApiResponse(400, {}, Msg.USER_EXISTS);
      }

      const otp = generateOtp();
      const otpExpiresAt = getExpirationTime(); // 10 minutes

      console.log('OTP:', otp);
      console.log('OTP Expiration:', otpExpiresAt);

      await this.userModel.create({
        name,
        email,
        password,
        countryCode,
        phone,
        otp,
        otpExpiresAt,
      });

      return new ApiResponse(201, { otp: otp }, Msg.OTP_SENT);
    } catch (error) {
      console.log(`while registering the user: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      if (!user.otp || !user.otpExpiresAt) {
        return new ApiResponse(400, {}, Msg.OTP_NOT_FOUND);
      }

      if (user.otp !== dto.otp || new Date() > user.otpExpiresAt) {
        return new ApiResponse(400, {}, Msg.OTP_INVALID);
      }

      user.otp = null;
      user.otpExpiresAt = null;
      user.isVerified = true;
      await user.save();

      return new ApiResponse(200, {}, Msg.OTP_VERIFIED);
    } catch (error) {
      console.log(`error while verifying otp: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async resendOtp(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      if (user.isVerified) {
        return new ApiResponse(400, {}, Msg.USER_ALREADY_VERIFIED);
      }

      const otp = generateOtp();
      const otpExpiresAt = getExpirationTime();

      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      console.log('OTP:', otp);
      console.log('OTP Expiration:', otpExpiresAt);

      return new ApiResponse(200, { otp: otp }, Msg.OTP_RESENT);
    } catch (error) {
      console.log(`error while resending otp: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async profile(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-otp -otpExpiresAt -password');
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      user.profilePic = user.profilePic
        ? `${process.env.BASE_URL}/uploads/profile/${user.profilePic}`
        : null;
      return new ApiResponse(200, user, Msg.USER_FETCHED);
    } catch (error) {
      console.log(`error while fetching user profile: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async update(dto: UpdateUserDto, userId: string, file: Express.Multer.File) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      if (file) {
        if (user.profilePic) {
          await deleteOldFile(user.profilePic);
        }

        user.profilePic = file.filename;
        await user.save();
      }

      await this.userModel.findByIdAndUpdate(
        userId,
        { $set: dto },
        { new: true, runValidators: true },
      );

      return new ApiResponse(200, {}, Msg.USER_UPDATED);
    } catch (error) {
      console.log(`error while updating user: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
