import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class UserStatus extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

}

export const UserStatusSchema = SchemaFactory.createForClass(UserStatus);
