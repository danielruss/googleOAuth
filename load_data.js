import emb from "./embedding.js"

async function loadData() {
    clearTable()
    if (!emb.hasToken()) {
        return
    }
    let token = emb.getToken()


    let project = "nih-nci-dceg-druss";
    let dataset = "DansDataset"
    let table = "FakeData"
    let base_url = `https://bigquery.googleapis.com/bigquery/v2/projects/${project}/datasets/${dataset}/tables/${table}/data`
    let options = {
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        }
    }
    let x = await (await fetch(base_url, options)).json()
    if (x.error) {
        tableHTML(`<pre>${x.error.message}</pre>`)
        return
    }
    x.columns = ["Id", "Token"]

    makeTable(x)
}
function clearTable() {
    let table = document.getElementById("bq-data-table")
    table.innerText = ""
}
function makeTable(x) {
    let table = document.getElementById("bq-data-table")
    table.innerText = ""
    let headElement = table.createTHead()
    let rowElement = headElement.insertRow()
    x.columns.forEach(col => {
        let cell = rowElement.insertCell()
        cell.outerHTML = `<th>${col}</th>`
    })

    let bodyElement = table.createTBody()
    let dta = x.rows.map(row => {
        rowElement = bodyElement.insertRow()
        return row.f.map(value => {
            let cell = rowElement.insertCell()
            cell.innerText = value.v
            return value.v
        })
    });
    add_download_button(dta)
}
function add_download_button(x){
    //remove the old dl_button (if it exists)
    document.querySelector("#dl_button")?.remove()

    let table = document.getElementById("bq-data-table")
    let download_botton = document.createElement("button")
    download_botton.innerText = "download data"
    download_botton.id="dl_button"
    download_botton.addEventListener("click", ()=>{
        let json = JSON.stringify(x)
        let blob = new Blob([ json ], {type: "octet/stream"})
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a')
        a.style='none'
        a.href=url
        a.download = "data.json"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    })
    table.insertAdjacentElement("afterend",download_botton)
}


// insert the token bar at the top of the page...
emb.tokenBar()

// call the bigquery API
let button = document.createElement("button")
button.addEventListener("token_event", (event) => {
    button.disabled = !emb.hasToken()
})
button.addEventListener("click", event => {
    loadData()
})
button.innerText = "Get BQ Data"
emb.addTokenListener(button)
document.querySelector("h3").insertAdjacentElement("afterend", button)
emb.buttonSet()

window.emb=emb