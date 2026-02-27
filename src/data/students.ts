export interface Student {
  student_id: string;
  student_name: string;
}

export const STUDENTS: Student[] = [
  { student_id: "stu_101", student_name: "Ali bin Ahmad" },
  { student_id: "stu_102", student_name: "Siti Nurhaliza" },
  { student_id: "stu_103", student_name: "Chen Wei Lun" },
  { student_id: "stu_104", student_name: "Raj Kumar" },
  { student_id: "stu_105", student_name: "Emma Tan" },
  { student_id: "stu_106", student_name: "Muhammad Hakim" },
  { student_id: "stu_107", student_name: "Nurul Ain" },
  { student_id: "stu_108", student_name: "Lee Xin Yi" },
  { student_id: "stu_109", student_name: "Amir Hafiz" },
  { student_id: "stu_110", student_name: "Kavitha Devi" },
];

// Helper function to get student name by ID
export function getStudentName(student_id: string): string | null {
  const student = STUDENTS.find(s => s.student_id === student_id);
  return student ? student.student_name : null;
}

// Helper function to format student for display
export function formatStudentDisplay(student_id: string): string {
  const name = getStudentName(student_id);
  return name ? `${student_id} (${name})` : student_id;
}
