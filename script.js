function makeRequest(url, params) {
    return $.ajax({
        url: url,
        method: 'GET',
        data: params,
        dataType: 'text',
        success: function(data) {
            return data
        },
        error: function(xhr, status, error) {
            console.error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
            throw new Error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
        }
    });
}


