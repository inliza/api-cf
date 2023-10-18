import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { PaymentsCompany, PaymentsCompanySchema } from 'src/models/payments-company.model';
import { PaymentsCompaniesService } from './payments-companies.service';
import { PaymentsCompaniesController } from './payments-companies.controller';
import { PaymentsStatusModule } from '../payments-status/payments-status.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PaymentsCompany.name, schema: PaymentsCompanySchema }]),
        PaymentsStatusModule,
        CommonModule,
        HelperModule,
    ],
    providers: [PaymentsCompaniesService],
    controllers: [PaymentsCompaniesController]
})
export class PaymentsCompaniesModule { }
