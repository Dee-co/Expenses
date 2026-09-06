import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(){
    const {data,error} = await supabaseAdmin.from("categories").select("*");
    if(error){
        return  Response.json({error:error.message},{status:500})
    }
    return Response.json({categories:data,status:200})
}