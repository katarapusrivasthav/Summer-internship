$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    getAllBooks()
    $(document).on("click", ".delete", function () {
        var req_id = $(this).parents("td")[0].id
        console.log(req_id)
        // $(".add-new").removeAttr("disabled");
        $.ajax({
            url: 'http://localhost:8080/returnBook',
            type: "POST",
            data: { id: req_id },
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
        url: 'http://localhost:8080/getBooksOfSpecUser',
        type: "POST",
        data:{"id":localStorage.getItem("id")},
        dataType: "json",
        success: function (res) {
            if (res['statusCode'] == 200) {
                console.log("data", res);
                var actions = $("table td:last-child").html();
                $("table tbody").html("");
                for (var i = 0; i < res['data'].length; i++) {
                    var row = '<tr id=' + res['data'][i]["rid"] + '>' +
                        '<td>' + res['data'][i]["id"] + '</td>' +
                        '<td class=' + res['data'][i]["rid"] + '>' + res['data'][i]["name"] + '</td>' +
                        '<td class=' + res['data'][i]["rid"] + '>' + res['data'][i]["author_name"] + '</td>' +
                        '<td class=' + res['data'][i]["rid"] + '>' + res['data'][i]["edition"] + '</td>' +
                        '<td id=' + res['data'][i]["rid"] + '>' + actions + '</td>' +
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