var list = new ListItemHandler();

function showCreateList() {
    $('#createList').slideDown('500');
}

function renderList(data) {
    try {
        list.makeNewItems(data);
    }
    catch(err) {
        displayError(err);
    }
}


$('#error-container').on('click touchstart', function() {
    $('#error-container').slideUp('500');
});

function hideError() {
    $('#error-container').slideUp('500');
}

function displayError(err) {
    $('#error-details').text(err);
    $('#error-container').slideDown('500');
    console.log(`Error: ${err}`);
}