export function hasMenuCourses(
  courses: readonly unknown[] | null | undefined,
): boolean {
  return Boolean(courses?.length);
}
