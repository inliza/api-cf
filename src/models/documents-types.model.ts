import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class DocumentsTypes extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

}

export const DocumentsTypesSchema = SchemaFactory.createForClass(DocumentsTypes);
