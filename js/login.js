$(document).ready(function () {

    document.getElementById('errorname').innerText = '';
    $("#login").click(function (e) {
        var val1 = $("#userid").val();
        var val2 = $("#pwd").val();
        var val3 = "/^[A-Za-z]{5,13}$/";
        if (val1 == '' && val2 == '') {
            $('input[type="text"]').css("border", "2px solid red");
            $('input[type="password"]').css("border", "2px solid red");
            window.alert('fill the username and password');
            // document.getElementById('errorname').innerText = 'This is an invalid name';
        }
        else {
            if (/^[A-Za-z]{3,12}[@][g][i][t][a][m][.][i][n]$/.test(val1)) {
                // $('input[type="text"]').css("border", "2px solid red");
                console.log(val1, val2)
                $.ajax({
                    url: 'http://localhost:8080/login',
                    type: "POST",
                    data: { username: val1, password: val2 },
                    dataType: "json",
                    success: function (data) {
                        if (data['statusCode'] == 200) {
                            console.log("data", data, data['data']['name'], data['data']['role']);
                            localStorage.setItem("user", data['data']['name'])
                            localStorage.setItem("role", data['data']['role'])
                            localStorage.setItem("id", data['data']['id'])
                            if (data['data']['role'] == "1") {
                                window.open("admin.html", "_self")
                            }
                            else {
                                window.open("user.html", "_self")
                            }
                        }
                        else {
                            $('input[type="text"]').css("border", "2px solid red");
                            $('input[type="password"]').css("border", "2px solid red");
                            window.alert(data['message']);

                        }
                    },
                    error: function (error) {
                        console.log('Error', error);
                        $('input[type="text"]').css("border", "2px solid red");
                        $('input[type="password"]').css("border", "2px solid red");
                        window.alert('fill the username and password correctly');
                    }
                });
                document.getElementById('errorname').innerText = '';
            }
            else {
                window.alert("Not Validated")
            }
        }
        e.preventDefault();
    });
});
