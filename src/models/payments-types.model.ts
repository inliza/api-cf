import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentsTypes extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

}

export const PaymentsTypesSchema = SchemaFactory.createForClass(PaymentsTypes);
