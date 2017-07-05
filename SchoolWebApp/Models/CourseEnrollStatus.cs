using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SchoolWebApp.Models
{
    public class CourseEnrollStatus
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public int StudentsEnrolled { get; set; }
        public Nullable<int> StudentCapacity { get; set; }
    }
}