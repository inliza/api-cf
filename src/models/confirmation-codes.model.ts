import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ConfirmationCodes extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  code: string;

  @Prop({ type: 'ObjectId', required: true, ref: 'Users' })
  user: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: false })
  validated: boolean;

  @Prop({ required: true })
  expireDate: Date;
}

export const ConfirmationShema = SchemaFactory.createForClass(ConfirmationCodes);
