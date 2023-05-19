import * as oauth from "./goauth.js"

//oauth.config(
//    "470984582294-ciqa45m21eqsli2v0m8kqdsobl2690jg.apps.googleusercontent.com",
//    "dKUWdWvO8i5iD0qkMg97QJXJ")
//oauth.config("1061219778575-61rsuqnukha35jgbt2hkl8de17sehf4c.apps.googleusercontent.com",
//    "FHItcw9P8OKx4OtFHpK-F_aQ")
oauth.config("1061219778575-8jmag0p343srcv62g7tkoghkja0vk7vd.apps.googleusercontent.com",
            "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",
            "https://www.googleapis.com/auth/userinfo.email")

let token = await oauth.getToken()
