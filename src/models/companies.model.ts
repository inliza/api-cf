import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Companies extends Document {

  @Prop({ type: 'ObjectId', ref: 'Users' })
  user: string;

  @Prop({ type: 'ObjectId', ref: 'UserStatus' })
  userStatus: string;

  @Prop({ type: 'ObjectId', ref: 'DocumentsTypes' })
  documentType: string;

  @Prop({ type: 'ObjectId', ref: 'Cities' })
  city: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 15,
  })
  document: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 15,
  })
  rnc: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 1024,
  })
  address: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 50,
  })
  ownerName: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 20,
  })
  phoneNumber: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 20,
  })
  mobileNumber: string;

  @Prop({ default: Date.now, required: true })
  createDate: Date;

  @Prop({ default: false })
  deleted: boolean;
}


export const CompaniesSchema = SchemaFactory.createForClass(Companies);
