import {supabase} from '@/lib/supabase'
import { Expense } from '@/lib/types';
import { json } from 'stream/consumers';
export async function GET() {
    const {data,error} = await supabase.from("expenses").select("*");
    if(error){
        return Response.json({error:error.message},{status:500})
    }
    return Response.json({expenses:data})
}

export async function POST(request:Request) {
    const body = await request.json();
    console.log(body,JSON.stringify(body));
    const newExpanse:Expense ={
        title:body.title,
        amount:body.amount,
        category:body.category,
        expense_date: body.expense_date,
        note:body.note
    }
    const {data,error} = await supabase.from("expenses").insert(newExpanse).select().single();
    if(error){
        return Response.json({error:error.message},{status:500})
    }
    return Response.json({expense:data},{status:201})
}
