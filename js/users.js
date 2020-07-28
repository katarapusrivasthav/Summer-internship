$(document).ready(function () {
    getAllUsers()
    $(document).on("click", ".delete", function () {
        var req_id = $(this).parents("td")[0].id
        console.log(req_id)
        // $(".add-new").removeAttr("disabled");
        $.ajax({
            url: 'http://localhost:8080/deleteUser',
            type: "POST",
            data: { id: req_id },
            dataType: "json",
            success: function (res) {
                if (res['statusCode'] == 200) {
                    console.log("data", res);
                    getAllUsers()
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
    $(document).on("click", ".add", function () {
        var req_id = $(this).parents("td")[0].id
        console.log(req_id)
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function () {
            if (!$(this).val()) {
                $(this).addClass("error");
                empty = true;
            } else {
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if (!empty) {
            var reqJson = []
            
            if (req_id == "tempId") {
                console.log("in this")
                input.each(function () {
                    $(this).parent("td").html($(this).val());
                });
                $(this).parents("tr").find(".add, .edit").toggle();
                $('tbody tr#' + req_id).each(function () {
                    $(this).find("td").each(function () {
                        if ($(this).attr("id") != req_id) {
                            console.log("in this", this, $(this).html(), $(this).attr("id"))
                            reqJson.push($(this).html())
                        }
                    });
                });
                console.log(reqJson)
                $.ajax({
                    url: 'http://localhost:8080/addUser',
                    type: "POST",
                    data: { name: reqJson[0], email: reqJson[1], phone: reqJson[2], id: reqJson[3],password:reqJson[4],role:2 },
                    dataType: "json",
                    success: function (res) {
                        if (res['statusCode'] == 200) {
                            console.log("data", res);
                            getAllUsers()
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
            else {
                input.each(function () {
                    $(this).parent("td").html($(this).val());
                });
                $(this).parents("tr").find(".add, .edit").toggle();
                $('tbody tr#' + req_id).each(function () {
                    $(this).find("td").each(function () {
                        if ($(this).attr("id") != req_id) {
                            console.log("in this", this, $(this).html(), $(this).attr("id"))
                            reqJson.push($(this).html())
                        }
                    });
                });
                console.log(reqJson)
                $.ajax({
                    url: 'http://localhost:8080/editUser',
                    type: "POST",
                    data: { name: reqJson[0], email: reqJson[1], phone: reqJson[2], id: reqJson[3],password:reqJson[4] },
                    dataType: "json",
                    success: function (res) {
                        if (res['statusCode'] == 200) {
                            console.log("data", res);
                            // getAllUsers()
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

            $(".add-new").removeAttr("disabled");
        }
    });

})
function getAllUsers() {
    $.ajax({
        url: 'http://localhost:8080/getUsers',
        type: "GET",
        dataType: "json",
        success: function (res) {
            if (res['statusCode'] == 200) {
                console.log("data", res);
                var actions = $("table td:last-child").html();
                $("table tbody").html("");
                for (var i = 0; i < res['data'].length; i++) {
                    var row = '<tr id=' + res['data'][i]["id"] + '>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["name"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["email"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["phone"] + '</td>' +
                        '<td >' + res['data'][i]["id"] + '</td>' +
                        '<td class=' + res['data'][i]["id"] + '>' + res['data'][i]["password"] + '</td>' +
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