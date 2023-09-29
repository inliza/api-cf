import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VehiclesStatus extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string;
}

export const VehiclesStatusSchema = SchemaFactory.createForClass(VehiclesStatus);
