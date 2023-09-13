import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HelperModule } from './common/helper/helper.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesPickupModule } from './modules/cities-pickup/cities-pickup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    CommonModule,
    HelperModule,
    CitiesModule,
    CountriesModule,
    CitiesPickupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
