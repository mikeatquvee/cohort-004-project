import { data } from "react-router";
import type { Route } from "./+types/api.course-review";
import { getCurrentUserId } from "~/lib/session";
import { isUserEnrolled } from "~/services/enrollmentService";
import { upsertCourseReview } from "~/services/reviewService";

export async function action({ request }: Route.ActionArgs) {
  const currentUserId = await getCurrentUserId(request);
  if (!currentUserId) {
    throw data("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const courseId = Number(formData.get("courseId"));
  const rating = Number(formData.get("rating"));

  if (!courseId || !rating || rating < 1 || rating > 5) {
    throw data("Invalid parameters", { status: 400 });
  }

  if (!isUserEnrolled(currentUserId, courseId)) {
    throw data("You must be enrolled to review this course", { status: 403 });
  }

  const review = upsertCourseReview(currentUserId, courseId, rating);
  return { success: true, review };
}
