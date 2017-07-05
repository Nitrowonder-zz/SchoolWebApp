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

namespace SchoolWebApp.Controllers.API
{
    public class StudentToCoursesController : ApiController
    {
        private SchoolEntities db = new SchoolEntities();

        // GET: api/StudentToCourses
        public IQueryable<StudentToCourse> GetStudentToCourses()
        {
            return db.StudentToCourses;
        }

        // GET: api/StudentToCourses/5
        //Using StudentId instead of primary key 
        [ResponseType(typeof(StudentToCourse))]
        public IHttpActionResult GetStudentToCourse(int id)
        {
            IQueryable<StudentToCourse> studentToCourse = db.StudentToCourses.Where(stc => stc.StudentId == id);
            if (studentToCourse == null)
            {
                return NotFound();
            }

            return Ok(studentToCourse);
        }

        // PUT: api/StudentToCourses/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStudentToCourse(int id, StudentToCourse studentToCourse)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != studentToCourse.Id)
            {
                return BadRequest();
            }

            db.Entry(studentToCourse).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentToCourseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/StudentToCourses
        [ResponseType(typeof(StudentToCourse))]
        public IHttpActionResult PostStudentToCourse(StudentToCourse studentToCourse)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.StudentToCourses.Add(studentToCourse);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = studentToCourse.Id }, studentToCourse);
        }

        // DELETE: api/StudentToCourses/5
        [ResponseType(typeof(StudentToCourse))]
        public IHttpActionResult DeleteStudentToCourse(int id, int courseId)
        {
            IQueryable<StudentToCourse> studentToCourse = db.StudentToCourses.Where(stc => (stc.StudentId == id)
            && stc.CourseId == courseId);
            if (studentToCourse == null)
            {
                return NotFound();
            }

            db.StudentToCourses.Remove(studentToCourse.FirstOrDefault());
            db.SaveChanges();

            return Ok(studentToCourse);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentToCourseExists(int id)
        {
            return db.StudentToCourses.Count(e => e.Id == id) > 0;
        }
    }
}