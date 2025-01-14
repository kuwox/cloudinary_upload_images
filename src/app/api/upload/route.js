import { NextResponse } from "next/server"
import { writeFile } from 'fs/promises'
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {

    const data = await request.formData();
    const image = data.get("image");
    /* console.log(data.get("image")); */

    if (!image) {
        return NextResponse.json("No se ha enviado ninguna imagen", { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // guardar en un archivo
    /* const filePath = path.join(process.cwd(), "public", image.name)
    console.log(filePath)
    await writeFile(filePath, buffer)
    const response = await cloudinary.uploader.upload(filePath)
    console.log(response) */

    // guardar en la nube
    const response = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }).end(buffer);
    });

    // Aqui va el código para guardar en base de datos
    // o para procesar imagen
    console.log(response.secure_url);

    return NextResponse.json({
        message: "imagen subida",
        url: response.secure_url
    }
    );
}