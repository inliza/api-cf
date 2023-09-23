import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Users extends Document {
  @Prop({
    required: true,
    minlength: 6,
    maxlength: 100,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 1024,
  })
  password: string;

  @Prop({ type: 'ObjectId', ref: 'UserTypes' })
  userType: string;

  @Prop({ default: true })
  active: boolean;
}


export const UserSchema = SchemaFactory.createForClass(Users);
