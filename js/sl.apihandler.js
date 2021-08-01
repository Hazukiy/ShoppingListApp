var host = "http://127.0.0.1:8081";



function loadPredefinedList() {
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);       
            renderList(data);
        }
    };
    xmlRequest.open("GET", `${host}/getPredefinedList`, true);
    xmlRequest.send();
}