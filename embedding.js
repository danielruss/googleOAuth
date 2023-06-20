console.log(" ... in embedding.js ")

let tokenListenerList = []
function addTokenListener(ele){
    tokenListenerList.push(ele)
}

function tokenBar() {
    document.body.insertAdjacentHTML("afterbegin",
        `<div class="token_bar">
       <button data-require-token="false">Get access token</button>
       <button data-require-token="always">Print token expiration</button>
       <button data-require-token="true">Revoke token</button>
       <input type="text" id="token_console" disabled style="width:100%">
    </div>`)

    document.querySelectorAll(".token_bar button").forEach((button, indx) => {
        switch (indx) {
            case 0:
                button.addEventListener("click", getToken)
                break;
            case 1:
                button.addEventListener("click", tokenExpiration)
                break;
            case 2:
                button.addEventListener("click", revokeToken)
        }
    })
}

function buttonSet() {
    document.querySelectorAll(".token_bar button").forEach((button) => {
        switch (button.dataset.requireToken) {
            case "true":
                button.disabled = !hasToken();
                break;
            case "false":
                button.disabled = hasToken();
                break;
            default:
                button.disabled = false;
        }
    })

    let event1 = new CustomEvent("token_event",{hasToken: hasToken()})
    console.log(" ===========> dipatching event: ",event1,tokenListenerList)
    tokenListenerList.forEach( elem => elem?.dispatchEvent(event1) )
}
buttonSet()

function tokenExpiration() {
    let txt = tokenExpires() || "No token"
    document.querySelector('#token_console').value = txt
    setTimeout(()=>document.querySelector('#token_console').value = "",5000)
}

function tokenExpires() {
    let token = JSON.parse(localStorage.getItem('token'))
    if (!token || !token?.expireAt) return null
    return new Date(token.expireAt)
}



function hasToken() {
    let token = JSON.parse(localStorage.getItem('token'))
    return (token && (token.expireAt > Date.now()))
}

function getToken() {
    if (hasToken()) {
        return JSON.parse(localStorage.getItem('token'))
    }
    client.requestAccessToken()
}

function revokeToken() {
    let token = JSON.parse(localStorage.getItem('token'))
    google.accounts.oauth2.revoke(token.access_token, () => { console.log('access token revoked') });
    delete localStorage.token
    buttonSet()
}

export default {
    tokenBar,
    buttonSet,
    hasToken,
    getToken,
    addTokenListener
}

