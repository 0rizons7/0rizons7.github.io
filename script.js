function makeRequest(url, params=null) {
    return $.ajax({
        url: url,
        method: 'GET',
        data: params,
        dataType: 'text',
        success: function(data) {
            try {
                return JSON.parse(data);
            } 
            catch {
                return data
            }
        },
        error: function(xhr, status, error) {
            console.error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
            throw new Error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
        }
    });
}
makeRequest(url="https://lichess.org/api/study/sMXicnZ4.pgn",
).done(function (data) {
    console.log(data);
}
).fail(function (error) {
    console.error(error);
});


