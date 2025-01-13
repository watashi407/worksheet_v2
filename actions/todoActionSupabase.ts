'use server';
import { createClient } from "@/utils/supabase/server";

import { revalidatePath } from "next/cache";




export async function createTodo(_:unknown,formData:FormData){
    const supabase = await createClient();
    const task = formData.get("task") as string;

    try{
    const {error: insertError} = await supabase.from("todos").insert(({task:task}))
    if(insertError){
        return {
            status:insertError?.message,

        }
    }
    }catch(error){
        return {
            status: "error",
            message: (error as Error).message || "An unexpected error occurred",

        }
    }


    revalidatePath("/ac8")
}

export async function fetchTodos(id:string){
    const supabase = await createClient();

    const {data,error:Error,} = await supabase.from("todos").select("*").eq("user_id",id);
    if(Error){
        return {
            status:Error?.message,
            data:null
        }
    }

    return {success:"success",todos:data}
    
}



export async function todoDelete(id:string){
    const supabase = await createClient();

    const {error:Error} = await supabase.from("todos").delete().eq("id", id);
    if (Error) {
        return Error?.message
      } 
      revalidatePath("/ac8")
}

export async function todoComplete(id:string){
    const supabase = await createClient();
    const {error:Error} = await supabase.from("todos").update({isCompleted:true}).eq('id', id);
    if (Error) {
        return Error?.message
      } 
      revalidatePath("/ac8")

}

export async function todoUndoComplete(id:string){
    const supabase = await createClient();
    const {error:Error} = await supabase.from("todos").update({isCompleted:false}).eq('id', id);
    if (Error) {
        return Error?.message
      } 
      revalidatePath("/ac8")

}


export async function fetchByEmail(email: string) {
    const supabase = await createClient();

    const { error: Error, data: userRecord } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .limit(1)
        .single();

    if (Error) {
        return { success: false, error: Error.message }; // Proper error format
    }


    const jsonRecord = userRecord ? JSON.parse(JSON.stringify(userRecord)) : null;

    return { success: true, data: jsonRecord };
}