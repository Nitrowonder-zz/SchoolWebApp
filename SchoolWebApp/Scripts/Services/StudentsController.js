$(document).ready(function () {
    GetStudents();
});

function GetStudents()
{
    $.ajax
    ({
        url: "../api/Students",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, student) {
                html += '<div class="row">';
                html += '<div class="col-sm-3">' + student.Id + '</div>';
                html += '<div class="col-sm-3">' + student.FirstName + '</div>';
                html += '<div class="col-sm-3">' + student.LastName + '</div>';
                html += '<div class="col-sm-3"><a href="#" onclick="return GetStudentById(' + student.Id + ')">Edit</a> | <a href="#" onclick="DeleteStudent(' + student.Id + ')">Delete</a></div>';
                html += '</div>';
                html += '<hr>';
            });
            $('#StudentTable').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function GetStudentById(Id)
{
    $.ajax
    ({
        url: "../api/Students/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#StudentId').val(result.Id);
            $('#FirstName').val(result.FirstName);
            $('#LastName').val(result.LastName);

            $('#StudentModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}
/*I didn't need contentType specified for the GET method, but
when calling the POST endpoint the values of first and last name
were being inserted as null without specifying contentType
*/
function AddStudent() {
    var validateResult = validate();
    if (validateResult == false) {
        return false;
    }
    var student = {
        FirstName: $('#FirstName').val(),
        LastName: $('#LastName').val()
    };
    $.ajax({
        url: "../api/Students",
        data: JSON.stringify(student),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetStudents();
            $('#StudentModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

/*
We need to send the Id in the request 
because of the check in api controller function
comparing the Id in the URL and in the body
*/
function UpdateStudent(Id) {
    var validateResult = validate();
    if (validateResult == false) {
        return false;
    }
    var student = {
        Id: $('#StudentId').val(),
        FirstName: $('#FirstName').val(),
        LastName: $('#LastName').val()
    };
    $.ajax({
        url: "../api/Students/" + Id,
        data: JSON.stringify(student),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetStudents();
            $('#StudentModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function DeleteStudent(Id)
{
    $.ajax({
        url: "../api/Students/" + Id,
        type: "DELETE",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetStudents();
            $('#StudentModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function clearModalFields()
{
    $('#StudentId').val("");
    $('#FirstName').val("");
    $('#LastName').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#FirstName').css('border-color', 'lightgrey');
    $('#LastName').css('border-color', 'lightgrey');
}

/* used to validate fields when 
trying to add a new student
*/
function validate() {
    var isValid = true;
    if ($('#FirstName').val().trim() == "") {
        $('#FirstName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#FirstName').css('border-color', 'lightgrey');
    }
    if ($('#LastName').val().trim() == "") {
        $('#LastName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#LastName').css('border-color', 'lightgrey');
    }
    return isValid;
}