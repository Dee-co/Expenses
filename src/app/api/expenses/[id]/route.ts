import {expenses} from"@/lib/data"
export async function GET(req:Request,{params}:{params: Promise<{id:string}>}) {
    const {id} = await params;
     const expense = expenses.find((item)=> item.id === Number(id))
    if(!expense){
        return Response.json({error:'Expenses not found'},{status:404})
    }
    return Response.json({expense})
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const expenseId = expenses.findIndex((item) => item.id === Number(id));
    if(expenseId === -1){
        return Response.json({error:"Expenses not found"},{status:401})
    }
    expenses.splice(expenseId,1);
    return Response.json({message:"Expense Deleted Successfully"},{status:200})
}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
    const body = await req.json();
    const {id} = await params;
    const index = expenses.findIndex((item) => item.id === Number(id))
    if(index === -1){
        return Response.json({error:"Expense Not Found"},{status:401})
    }
    expenses[index] = {...expenses[index],...body}
    return Response.json({message:"Expense Updated successfully"},{status:203})
}