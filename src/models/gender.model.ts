import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Gender extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);
