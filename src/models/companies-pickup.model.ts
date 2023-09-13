import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CompaniesPickups extends Document {

  @Prop({ type: 'ObjectId', ref: 'Companies' })
  companyId: string;

  @Prop({ type: 'ObjectId', ref: 'CitiesPickUp' })
  citypickupId: string;

  @Prop({ type: 'ObjectId', ref: 'Cities' })
  cityId: string;
}

export const CompaniesPickupsSchema = SchemaFactory.createForClass(CompaniesPickups);
