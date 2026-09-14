import { authenticateRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { userId } = authenticateRequest(request);
    const { data: userDetails, error } = await supabaseAdmin
      .from("users")
      .select("id ,name,email,created_at")
      .eq("id", userId)
      .single()
    if(userDetails){
        return Response.json({user:userDetails},{status:200})
    } 
    if(error){
        return Response.json({error:error.message},{status:500})
    } 
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}
