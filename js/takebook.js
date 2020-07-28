$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    getAllBooks()
    $(document).on("click", ".delete", function () {
        var req_id = $(this).parents("td")[0].id
        console.log(req_id)
        // $(".add-new").removeAttr("disabled");
        $.ajax({
            url: 'http://localhost:8080/takeBook',
            type: "POST",
            data: { bid: req_id,uid:localStorage.getItem("id") },
            dataType: "json",
            success: function (res) {
                if (res['statusCode'] == 200) {
                    console.log("data", res);
                    getAllBooks()
                }
                else {
                    window.alert(res['message']);
                }
            },
            error: function (error) {
                console.log('Error', error);
            }
        });
    });
    
})
function getAllBooks() {
    $.ajax({
        url: 'http://localhost:8080/getNotTakenBooksOfSpecUser',
        type: "POST",
        data:{"id":localStorage.getItem("id")},
        dataType: "json",
        success: function (res) {
            if (res['statusCode'] == 200) {
                console.log("data", res);
                var actions = $("table td:last-child").html();
                $("table tbody").html("");
                for (var i = 0; i < res['data'].length; i++) {
                    var row = '<tr id=' + res['data'][i]["id"] + '>' +
                        '<td>' + res['data'][i]["id"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["name"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["author_name"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["edition"] + '</td>' +
                        '<td id=' + res['data'][i]["id"] + '>' + actions + '</td>' +
                        '</tr>';
                    $("table").append(row);
                }
            }
            else {
                window.alert(res['message']);
            }
        },
        error: function (error) {
            console.log('Error', error);
        }
    });
}