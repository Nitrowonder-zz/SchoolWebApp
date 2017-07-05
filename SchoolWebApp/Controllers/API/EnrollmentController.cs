using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SchoolWebApp.edmx;
using SchoolWebApp.Models;

namespace SchoolWebApp.Controllers.API
{
    public class EnrollmentController : ApiController
    {
        private SchoolEntities db = new SchoolEntities();
        // GET: api/Enrollment
        public IQueryable<CourseEnrollStatus> Get()
        {
            /* SELECT Course.Id, CourseName, StudentCapacity,
             * (SELECT COUNT(CourseId) FROM StudentToCourse where CourseId = Course.Id) FROM Course
             */
            IQueryable<CourseEnrollStatus> CoursesEnrollment = from c in db.Courses
                                    select
                                       new CourseEnrollStatus()
                                       {
                                           Id = c.Id,
                                           CourseName = c.CourseName,
                                           StudentsEnrolled = db.StudentToCourses.Count(stc => stc.CourseId == c.Id),
                                           StudentCapacity = c.StudentCapacity,
                                       };
            return CoursesEnrollment;
        }

        // GET: api/Enrollment/5
        public string GetStudentSchedule(int id)
        {
            //IQueryable<Course> Courses = db.Courses.Count(db.StudentToCourses.Where(c => c.CourseId = );
            var CoursesEnrollment = from c in db.Courses
                                 select
                                    new
                                    {
                                        Id = c.Id,
                                        CourseName = c.CourseName,
                                        OccupiedSeats = db.StudentToCourses.Count(stc => stc.CourseId == c.Id),
                                        StudentCapacity = c.StudentCapacity,
                                    };
            return "value";
        }

        // POST: api/Enrollment
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Enrollment/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Enrollment/5
        public void Delete(int id)
        {
        }
    }
}
