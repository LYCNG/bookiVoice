import { MAX_FILE_SIZE } from "@/lib/constant";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";


export async function POST(request: Request):Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody
try{
    const jsonResponse =await handleUpload({
        token:process.env.bookvoice_READ_WRITE_TOKEN,
        body,
        request,
        onBeforeGenerateToken:async()=>{
        const {userId} = await auth()
        if(!userId){
            throw new Error('Unauthorized: User not authenticated')
        }
        return {
            allowedContentTypes:['application/pdf','image/jpeg','image/webp'],
            addRandomSuffix:true,
            maximumSizeInBytes:MAX_FILE_SIZE,
            tokenPayload: JSON.stringify({userId})
        };
    }},
    //  onUploadComplete:async({blob,tokenPayload})=>{
    //   console.log('fiel upload to blob');
    //   const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
    //   const userId = payload?.userId;
    //   //todo posthog
    // } 
   );
  return NextResponse.json(jsonResponse);   
}catch(err){
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const status = msg.includes('Unauthorized')? 401:500;
    return NextResponse.json({error: msg}, {status});
}

}