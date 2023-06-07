console.log(" ... in embedding.js ")

function tokenBar() {
    document.body.insertAdjacentHTML("afterbegin",
        `<div class="token_bar">
       <button data-require-token="false">Get access token</button>
       <button data-require-token="always">Print token expiration</button>
       <button data-require-token="true">Revoke token</button>
       <input type="text" id="token_console" disabled style="width:100%">
    </div>`)
    buttonSet()
}

function buttonSet() {
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
    client.requestAccessToken();
}

function revokeToken() {
    google.accounts.oauth2.revoke(localStorage.getItem("token").access_token, () => { console.log('access token revoked') });
    delete localStorage.token
    buttonSet()
}

export default {
    tokenBar,
    buttonSet,
    hasToken,
    getToken
}

