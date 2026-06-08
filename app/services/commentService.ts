import { eq, and, asc, isNull } from "drizzle-orm";
import { db } from "~/db";
import { lessonComments, users, UserRole } from "~/db/schema";

export type CommentWithAuthor = {
  id: number;
  lessonId: number;
  userId: number;
  parentId: number | null;
  body: string;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorRole: UserRole;
};

export function getCommentsForLesson(lessonId: number): CommentWithAuthor[] {
  return db
    .select({
      id: lessonComments.id,
      lessonId: lessonComments.lessonId,
      userId: lessonComments.userId,
      parentId: lessonComments.parentId,
      body: lessonComments.body,
      createdAt: lessonComments.createdAt,
      authorName: users.name,
      authorAvatarUrl: users.avatarUrl,
      authorRole: users.role,
    })
    .from(lessonComments)
    .innerJoin(users, eq(lessonComments.userId, users.id))
    .where(eq(lessonComments.lessonId, lessonId))
    .orderBy(asc(lessonComments.createdAt))
    .all() as CommentWithAuthor[];
}

export function getCommentById(id: number) {
  return db
    .select()
    .from(lessonComments)
    .where(eq(lessonComments.id, id))
    .get();
}

export function createComment(
  lessonId: number,
  userId: number,
  body: string,
  parentId: number | null
) {
  return db
    .insert(lessonComments)
    .values({ lessonId, userId, body, parentId })
    .returning()
    .get();
}

export function deleteComment(id: number) {
  return db
    .delete(lessonComments)
    .where(eq(lessonComments.id, id))
    .returning()
    .get();
}
