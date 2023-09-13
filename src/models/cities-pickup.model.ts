import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CitiesPickUp extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;

  @Prop({ type: 'ObjectId', ref: 'Cities' })
  city: string;
}

export const CitiesPickupSchema = SchemaFactory.createForClass(CitiesPickUp);
