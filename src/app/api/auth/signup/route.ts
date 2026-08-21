import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  const body = await request.json();
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", body.email)
    .single();
  if (existingUser) {
    return Response.json(
      { message: "Email Already Registered" },
      { status: 409 }
    );
  }
  const passwordHash = await bcrypt.hash(body.password, 10);
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name: body.name,
      email: body.email,
      password_hash: passwordHash,
    })
    .select("id,name,email")
    .single();
  if (error) {
    return Response.json({ error }, { status: 500 });
  }
  return Response.json(
    { message: "User Created Successfully",user },
    { status: 201 }
  );
}
