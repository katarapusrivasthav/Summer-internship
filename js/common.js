
const loginErrorMsg = document.getElementById("login-error-msg");


$(document).ready(function () {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    if (localStorage.getItem("role") == "1") {
        $("#rollId").html(localStorage.getItem("user"))
    } else if (localStorage.getItem("role") == "2") {
        $("#rollId").html(localStorage.getItem("id"))
    }
    else {
        window.location = "login.html"
    }
    $("#logout").click(function () {
        console.log("in logout")
        localStorage.clear()
        window.location = "login.html"
    })
})