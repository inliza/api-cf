import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cities extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;

  @Prop({ type: 'ObjectId', ref: 'Country' })
  country: string;
}

export const CitySchema = SchemaFactory.createForClass(Cities);
