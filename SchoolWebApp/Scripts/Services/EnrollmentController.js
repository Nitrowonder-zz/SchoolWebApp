$(document).ready(function () {
    GetStudents();
    //GetCourseStatuses();
});

/*Fills the Student Select element with all students
*/
function GetStudents() {
    $.ajax
    ({
        url: "../api/Students",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '<option value="-1">Select a Student</option>';
            $.each(result, function (key, student) {
                html += '<option value="' + student.Id + '">' + student.LastName + ', '
                     + student.FirstName + '</option>';
            });
            $('#StudentSelect').html(html);
            GetCourseStatuses();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function GetCourseStatuses() {
    $.ajax
    ({
        url: "../api/Enrollment",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            var courseStatus = 'Open';
            $.each(result, function (key, course) {
                if (course.StudentsEnrolled == course.StudentCapacity) {
                    courseStatus = 'Full';
                }
                else {
                    courseStatus = 'Open';
                }
                html += '<div class="row">';
                html += '<div class="col-sm-2">' + course.Id + '</div>';
                html += '<div class="col-sm-2">' + course.CourseName + '</div>';
                html += '<div class="col-sm-2">' + course.StudentCapacity + '</div>';
                html += '<div class="col-sm-2">' + course.StudentsEnrolled + '</div>';
                html += '<div class="col-sm-2" id="courseStatus'+ course.Id +'">'+ courseStatus +'</div>';
                html += '<div class="col-sm-2"><button id="EnrollButton'
                     + course.Id + '" class="btn btn-primary" onclick="return EnrollStudent('
                     + $('#StudentSelect option:selected').val() + ', ' + course.Id
                     + ')">Enroll</button> | <button id="DropButton'
                     + course.Id + '" class="btn btn-default" onclick="DropCourse(' + $('#StudentSelect option:selected').val() + ', ' + course.Id + ')">Drop</button></div>';
                html += '</div>';
                html += '<hr>';
            });
            $('#CourseTable').html(html);
            $.each(result, function (key, course) {
                if (course.StudentsEnrolled == course.StudentCapacity) {
                    $('#EnrollButton' + course.Id).prop("disabled", true);
                }
                else if ($('#StudentSelect option:selected').val() == -1) {
                    $('#EnrollButton' + course.Id).prop("disabled", true);
                }
                else {
                    $('#EnrollButton' + course.Id).prop("disabled", false);
                }
                $('#DropButton' + course.Id).prop("disabled", true);
            });
            SetEnrollStatus($('#StudentSelect option:selected').val());
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function EnrollStudent(student, course)
{
    if(student == -1)
        return alert("Please select a student.");
    var studentToCourse = {
        StudentId: student,
        CourseId: course
    };
    $.ajax({
        url: "../api/StudentToCourses",
        data: JSON.stringify(studentToCourse),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetCourseStatuses();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function DropCourse(student, course)
{
    if (student == -1)
        return alert("Please select a student.");
    //var studentToCourse = {
    //    StudentId: student,
    //    CourseId: course
    //};
    $.ajax({
        url: "../api/StudentToCourses/"+student,
        data: JSON.stringify(course),
        type: "DELETE",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetCourseStatuses();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function SetEnrollStatus(student)
{
    if (student == -1)
        return;
    $.ajax({
        url: "../api/StudentToCourses/" + student,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $.each(result, function (key, studentToCourse) {
                $('#courseStatus' + studentToCourse.CourseId).text('Enrolled');
                $('#EnrollButton' + studentToCourse.CourseId).prop("disabled", true);
                $('#DropButton' + studentToCourse.CourseId).prop("disabled", false);
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}