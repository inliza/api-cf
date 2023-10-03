import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentsChannel extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;
}

export const PaymentsChannelSchema = SchemaFactory.createForClass(PaymentsChannel);
