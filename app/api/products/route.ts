import Product from "@/lib/models/Product";
import { connectDb } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
   try {
      const { userId } = auth();
      if(!userId) {
         return new NextResponse("Unauthorized", { status: 401});
      }
      await connectDb();
      const {title, description, media, category, collections, tags, sizes, colors, price, expense} = await req.json();
      console.log("Received media array:", media);
      
      if(!title || !description || !media || !category || !price || !expense) {
         return new NextResponse("Not enough data to create a product", { status: 400 });
      };
      const newProduct = await Product.create({
         title,
        description,
        media,
        category,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      });
      await newProduct.save();
      return NextResponse.json(newProduct, { status: 200});

   } catch (error) {
      console.log("[products_POST]", error);
      return new NextResponse("Internal error", {status: 500});
   }
}