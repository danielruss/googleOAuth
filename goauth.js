import localforage from 'https://unpkg.com/localforage@1.7.3/src/localforage.js'
console.log(localforage)

let oauth2 = localforage.createInstance({
    name: "oauth2"
});

const oauth_params = {
    "base_url":"https://accounts.google.com/o/oauth2/v2/auth",
    "redirect_uri" : location.origin,
}

function config(client_id,client_secret,scope="https://www.googleapis.com/auth/cloud-platform"){
    oauth_params.client_id  =  client_id
    oauth_params.client_secret = client_secret
    oauth_params.scope = scope
}

async function getToken(){
    let token = await oauth2.getItem("token")
    if (token) return token

    let searchParams = new URLSearchParams(location.search)
    let hashParams = new URLSearchParams(location.hash.slice(1))
    window.hashParams=hashParams


    if (hashParams.has("access_token")){
        oauth2.setItem("token", hashParams.get("access_token") )
        location.hash=""
        return hashParams.get("access_token")
    } else {
        step1()
    }
}

function step1(){
    let url=new URL(oauth_params.base_url)
    console.log("step1 location: ",location," ")
    url.searchParams.append("response_type","token")
    url.searchParams.append("scope",oauth_params.scope)
    url.searchParams.append("client_id",oauth_params.client_id)
    url.searchParams.append("redirect_uri",oauth_params.redirect_uri)

    location.href = url
}



export {
    config,
    getToken,
}