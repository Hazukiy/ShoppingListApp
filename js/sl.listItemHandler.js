function ListItemHandler() {
    var totalAmount = 0;
    var dataArray = []; // Contains a list of the created DOM elements
    var selectedItems = [];

    this.updateList = function(element) {
        let index = selectedItems.findIndex(x => x === element);
        if(index == -1) {
            selectedItems.push(element);
            element.classList.add("active-select");

            let price = element.getAttribute("price");
            addAmount(price);

            document.getElementById("totalAmount").innerText = `Total: £${totalAmount}`;
        }
        else {
            selectedItems.splice(index, 1);
            element.classList.remove("active-select");

            let price = element.getAttribute("price");
            subtractAmount(price);

            document.getElementById("totalAmount").innerText = `Total: £${totalAmount}`;
        }
    }

    this.makeNewItems = function(data) {
        for(let i = 0; i < data.length; i++) {
            let title = document.createElement("h3");
            title.classList.add("listItemTitle");
            title.classList.add("noselect");
            title.innerText = `${data[i].name} - £` + data[i].price;

            let img = document.createElement("img");
            img.classList.add("listItemImage");
            img.src = `img/item-icons/${data[i].image}`;

            let item = document.createElement("div");
            item.classList.add("listItem");
            item.setAttribute("id", data[i].id);
            item.setAttribute("price", data[i].price);
            item.onclick = function() { itemTouched(item) };

            item.appendChild(img);
            item.appendChild(title);

            document.getElementById("predefinedList").appendChild(item);
        }
    };

    function itemTouched(data) {
        list.updateList(data);
    }

    function addAmount(price) {     
        totalAmount = (Number(totalAmount) + Number(price)).toFixed(2);
    }

    function subtractAmount(price) {
        totalAmount = (Number(totalAmount) - Number(price)).toFixed(2);
    }
}