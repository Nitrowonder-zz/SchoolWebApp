$(document).ready(function () {
    GetCourses();
});

function GetCourses() {
    $.ajax
    ({
        url: "../api/Courses",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, Course) {
                html += '<div class="row">';
                html += '<div class="col-sm-3">' + Course.Id + '</div>';
                html += '<div class="col-sm-3">' + Course.CourseName + '</div>';
                html += '<div class="col-sm-3">' + Course.StudentCapacity + '</div>';
                html += '<div class="col-sm-3"><a href="#" onclick="return GetCourseById(' + Course.Id + ')">Edit</a> | <a href="#" onclick="DeleteCourse(' + Course.Id + ')">Delete</a></div>';
                html += '</div>';
                html += '<hr>';
            });
            $('#CourseTable').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function GetCourseById(Id) {
    $.ajax
    ({
        url: "../api/Courses/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#CourseId').val(result.Id);
            $('#CourseName').val(result.CourseName);
            $('#StudentCapacity').val(result.StudentCapacity);

            $('#CourseModal').modal('show');
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
function AddCourse() {
    var validateResult = validate();
    if (validateResult == false) {
        return false;
    }
    var Course = {
        CourseName: $('#CourseName').val(),
        StudentCapacity: $('#StudentCapacity').val()
    };
    $.ajax({
        url: "../api/Courses",
        data: JSON.stringify(Course),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetCourses();
            $('#CourseModal').modal('hide');
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
function UpdateCourse(Id) {
    var validateResult = validate();
    if (validateResult == false) {
        return false;
    }
    var Course = {
        Id: $('#CourseId').val(),
        CourseName: $('#CourseName').val(),
        StudentCapacity: $('#StudentCapacity').val()
    };
    $.ajax({
        url: "../api/Courses/" + Id,
        data: JSON.stringify(Course),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetCourses();
            $('#CourseModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function DeleteCourse(Id) {
    $.ajax({
        url: "../api/Courses/" + Id,
        type: "DELETE",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetCourses();
            $('#CourseModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}


function clearModalFields() {
    $('#CourseId').val("");
    $('#CourseName').val("");
    $('#StudentCapacity').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#CourseName').css('border-color', 'lightgrey');
    $('#StudentCapacity').css('border-color', 'lightgrey');
}

/* used to validate fields when 
trying to add a new Course
*/
function validate() {
    var isValid = true;
    if ($('#CourseName').val().trim() == "") {
        $('#CourseName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#CourseName').css('border-color', 'lightgrey');
    }
    if ($('#StudentCapacity').val().trim() == "") {
        $('#StudentCapacity').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#StudentCapacity').css('border-color', 'lightgrey');
    }
    return isValid;
}