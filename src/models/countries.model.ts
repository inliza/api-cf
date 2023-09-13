// src/country/country.entity.ts
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Countries extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

  @Prop({ required: true, minlength: 5, maxlength: 50 })
  code: string;
}

export const CountrySchema = SchemaFactory.createForClass(Countries);
