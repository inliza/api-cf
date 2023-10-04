import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { ImagesResponseDto } from "src/dto/vehicles-images-response.dto";

@Injectable()
export class VehiclesImagesService {

    constructor(
        private readonly _logger: LoggerService

    ) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
    }

    async uploadImages(images: string[]): Promise<ServiceResponse> {
        const array: ImagesResponseDto[] = [];

        try {
            await Promise.all(
                images.map(async (imageData) => {
                    const [bigImage, thumbnail] = await Promise.all([
                        this.process(imageData),
                        this.process(imageData, true),
                    ]);

                    if (bigImage.statusCode === 200) {
                        const img = new ImagesResponseDto();
                        img.publicId = bigImage.object.public_id;
                        img.url = bigImage.object.url;
                        img.secureUrl = bigImage.object.secure_url;

                        if (thumbnail.statusCode === 200) {
                            img.publicIdThumbnail = thumbnail.object.public_id;
                            img.urlThumbnail = thumbnail.object.url;
                            img.secureUrlThumbnail = thumbnail.object.secure_url;
                        }

                        array.push(img);
                    } else {
                        console.error("Ha ocurrido un error subiendo una imagen");
                    }
                })
            );

            return new ServiceResponse(200, "", "", array);
        } catch (error) {
            console.error(`VehiclesImagesService: ${error}`);
            return new ServiceResponse(500, "", "", null);
        }
    }

    private async process(
        imageData: string,
        isThumbnail?: boolean
    ): Promise<ServiceResponse> {
        try {
            const res = await cloudinary.uploader.upload(imageData, {
                folder: isThumbnail ? '/282x188' : '/800x600',
                secure: true,
                transformation: [
                    {
                        width: isThumbnail ? 282 : 800,
                        height: isThumbnail ? 188 : 600,
                        crop: 'thumb',
                        format: 'jpg',
                    },
                ],
            });

            return new ServiceResponse(200, "", "", res);
        } catch (error) {
            console.error('VehiclesImagesService: Error uploading to Cloudinary:', error);
            return new ServiceResponse(500, "", "", null);
        }
    }
}