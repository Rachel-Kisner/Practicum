let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const isDev= import.meta.env.MODE==="development";

export const tokenManager={
    getAccessToken():string|null{
        return isDev?memoryAccessToken:localStorage.getItem("accessToken");
    },
    setAccessToken(token:string):void{
        if(isDev){
            memoryAccessToken=token;
        }
        else{
            localStorage.setItem("accessToken",token);
        }
    },
    getRefreshToken():string|null{
        return isDev?memoryRefreshToken:localStorage.getItem("refreshToken");
    },
    setRefreshToken(token:string):void{
        if(isDev){
            memoryRefreshToken=token;
        }
        else{
            localStorage.setItem("refreshToken",token);
        }
    },

    clearTokens():void{
        if(isDev){
            memoryAccessToken=null;
            memoryRefreshToken=null;
        }
        else{
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }

}