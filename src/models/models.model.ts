import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Models extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string;

  @Prop({ type: 'ObjectId', ref: 'Country' })
  make: string;

  @Prop({ default: true })
  active: boolean;
}

export const ModelsSchema = SchemaFactory.createForClass(Models);
