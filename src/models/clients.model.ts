import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Clients extends Document {

    @Prop({
        required: true,
        minlength: 5,
        maxlength: 50,
    })
    firstName: string;

    @Prop({
        required: true,
        minlength: 5,
        maxlength: 50,
    })
    lastName: string;

    @Prop({
        required: true,
        minlength: 8,
        maxlength: 20,
    })
    phone: string;

    @Prop({ type: 'ObjectId', ref: 'Users' })
    user: string;

    @Prop({ type: 'ObjectId', ref: 'UserStatus' })
    userStatus: string;

    @Prop({ type: 'ObjectId', ref: 'DocumentsTypes' })
    documentType: string;

    @Prop({
        minlength: 8,
        maxlength: 15,
    })
    document: string;

    @Prop({
        minlength: 1,
        maxlength: 1024,
    })
    address: string;

    @Prop({ type: 'ObjectId', ref: 'Gender' })
    gender: string;

    @Prop({ type: 'Date' })
    birthday: Date;

    @Prop({ default: Date.now, required: true })
    createDate: Date;

    @Prop({ default: false })
    deleted: boolean;
}


export const ClientsSchema = SchemaFactory.createForClass(Clients);
