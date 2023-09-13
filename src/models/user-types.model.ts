import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class UserTypes extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

}

export const UserTypesSchema = SchemaFactory.createForClass(UserTypes);
