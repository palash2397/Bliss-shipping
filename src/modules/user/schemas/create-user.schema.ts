import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'Name is required'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  })
  password: string;

  @Prop({
    enum: Role,
    default: Role.USER,
  })
  role: Role;


  @Prop({
    default: true,
  })
  isActive: boolean;

  // 👇 instance method typing
  //   isPasswordCorrect?: (
  //     candidatePassword: string,
  //   ) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});
