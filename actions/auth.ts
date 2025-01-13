"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/supabase/server"
import { redirect } from 'next/navigation'
import { headers } from "next/headers"


export async function signUp(FormData: FormData) {

    const supabase = await createClient();

    const credentials = {
        username: FormData.get("username") as string,
        email: FormData.get("email") as string,
        password: FormData.get("password") as string,
    }

    try {
        const { error, data } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    username: credentials.username
                }
            }
        });
        

        if (error) {
            return {
                status: "error",
                message: error.message,
                user: null,
            }
        } else if (data?.user?.identities?.length === 0) {
            return {
                status: "error",
                message: "User with this email already exists, please login",
                user: null,
            }
        }

        revalidatePath("/", "layout");
        return { status: "success", user: data?.user }
    } catch (err) {
        return {
            status: "error",
            message: (err as Error).message || "An unexpected error occurred",
            user: null,
        }
    }
}


export async function signIn(FormData: FormData) {

    const supabase = await createClient();

    const credentials = {
        email: FormData.get("email") as string,
        password: FormData.get("password") as string,
    }

    try {
        const { error, data } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
            return {
                status: "error",
                message: error.message,
                user: null,
            }
        } 


        const {data:existingUuser} = await supabase.from("user_profiles").select("*").eq("email",credentials?.email).limit(1).single();

        
        if(!existingUuser){
            const { error: insertError } = await supabase.from("user_profiles").insert(({email:data?.user.email,username:data?.user?.user_metadata.username}))

            if(insertError){
                return {
                    status:insertError?.message,
                    user:null
                }
            }
        }

 

        revalidatePath("/", "layout");
        return { status: "success", user: data.user }
    } catch (err) {
        return {
            status: "error",
            message: (err as Error).message || "An unexpected error occurred",
            user: null,
        }
    }
}

export async function signOut(){
    const supabase = await createClient()

    const {error} = await supabase.auth.signOut();

    if(error){
        redirect("/error")
    }

    revalidatePath("/","layout")
    redirect("/login")


}

export async function getUserSession(){
    const supabase = await createClient();
    const {data,error} = await supabase.auth.getUser();

    if(error){
        return null;
    }

    return {status:"success",user: data?.user}
}

export async function signInWithGithub(){
    const origin = (await headers()).get("origin")
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${origin}/auth/callback`,
          },
      })

      if(error){
        redirect("/error")
      }else{
        return redirect(data.url)
      }
}   

export async function forgetPassword(formData:FormData){
    const origin = (await headers()).get("origin")
    const supabase = await createClient()
    const {error} = await supabase.auth.resetPasswordForEmail(
        formData.get("email") as string,{
            redirectTo: `${origin}/reset-password`
        }
    )

    if(error){
        return{
            status: error?.message,
            user:null
        }
    }
    return {status:"success"}
}


export async function resetPassword(formData:FormData,code:string){

    const supabase = await createClient()
    const {error:CodeError} = await supabase.auth.exchangeCodeForSession(code);

    if(CodeError){
        return {status:CodeError?.message}
    }

    const {error} = await supabase.auth.updateUser({
        password:formData.get("password") as string
    })

    if(error){
        return {status:error?.message}
    }

    return {status:"success"}

}