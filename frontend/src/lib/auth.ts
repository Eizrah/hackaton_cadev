import { ApiError, apiRequest } from "./api";
import { migrateProfile, type Profile } from "../data/profile";
export function bannedLoginError(error:unknown) {
 if (!(error instanceof ApiError) || ![403,423].includes(error.status)) return false;
 const details=error.details as {code?:string;error?:string;detail?:string}|undefined;
 return /account_banned|banned|banni/i.test(`${typeof error.details === "string" ? error.details : ""} ${details?.code||""} ${details?.error||""} ${details?.detail||""}`);
}
export async function loginWithDjango(email:string,password:string,remember:boolean):Promise<Profile> {
 await apiRequest("auth/csrf/");
 const response=await apiRequest<{profile?:unknown;user?:unknown}>("auth/login/",{method:"POST",body:JSON.stringify({email,password,remember})});
 const value=response.profile||response.user;
 if (!value || typeof value!=="object") throw new Error("Missing profile in login response");
 return migrateProfile(value);
}
