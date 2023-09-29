import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BookingStatus extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;
}

export const BookingStatusSchema = SchemaFactory.createForClass(BookingStatus);
