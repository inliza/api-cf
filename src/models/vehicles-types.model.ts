import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VehiclesTypes extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string;
}

export const VehiclesTypesSchema = SchemaFactory.createForClass(VehiclesTypes);
