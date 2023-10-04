import { Controller, Delete, Post, Req, Res } from "@nestjs/common";
import { VehiclesImagesService } from "./vehicle-images.service";

@Controller('api/images')
export class ImagesController {
    constructor(private service: VehiclesImagesService) { }

    @Post()
    async example(@Req() req, @Res() res) {
        const result = await this.service.uploadImages(req.body.images);
        return res.status(result.statusCode).send(result);
    }

    @Delete()
    async delete(@Req() req, @Res() res) {
        const result = await this.service.deleteImages(req.body.images);
        return res.status(result.statusCode).send(result);
    }
}