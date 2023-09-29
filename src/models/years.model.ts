import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Years extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  year: string;
}

export const YearsSchema = SchemaFactory.createForClass(Years);
