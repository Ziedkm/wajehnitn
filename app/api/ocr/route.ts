// app/api/ocr/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration remains the same
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file was provided." }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${imageBuffer.toString('base64')}`;
    
    // Upload image and request OCR
    const result = await cloudinary.uploader.upload(base64Image, {
      ocr: "adv_ocr" 
    });
    
    // --- THIS IS THE FINAL, CORRECTED PATH ---
    
    // Use optional chaining (?.) to safely navigate the JSON path.
    const text = result?.info?.ocr?.adv_ocr?.data[0]?.textAnnotations?.[0]?.description;

    // If the text is not found after safely checking...
    if (!text) {
      // Log the entire response from Cloudinary so we can see what went wrong.
      console.error("--- CLOUDINARY OCR RESPONSE (TEXT NOT FOUND) ---");
      console.error(JSON.stringify(result, null, 2));
      console.error("-------------------------------------------------");
      
      throw new Error("Cloudinary did not return any readable text from the image. Check server logs for the full response.");
    }
    
    // If we get here, it means text was found successfully.
    return NextResponse.json({ text }, { status: 200 });

  } catch (error: any) {
    console.error("--- FULL OCR API CATCH BLOCK ---");
    console.error(error);
    console.error("--------------------------------");
    
    const errorMessage = error.message || "An unknown error occurred on the server.";
    return NextResponse.json(
        { error: `Server Error: ${errorMessage}` }, 
        { status: 500 }
    );
  }
}