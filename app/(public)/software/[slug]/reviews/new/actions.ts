"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { clientIp, hashIp } from "@/lib/hash";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

const RATING_FIELDS = [
  "overall_rating",
  "ease_of_use",
  "value_for_money",
  "customer_service",
  "functionality",
] as const;

function readRating(form: FormData, field: string): number | null {
  const raw = form.get(field);
  const value = Number(raw);
  if (!raw || Number.isNaN(value) || value < 1 || value > 5) return null;
  return Math.round(value);
}

export async function submitReview(
  _previous: ReviewFormState,
  form: FormData,
): Promise<ReviewFormState> {
  // Honeypot. Real people leave this empty; most bots fill every field.
  if (form.get("website")) {
    return { status: "success", message: "Thank you, your review was received." };
  }

  const slug = String(form.get("slug") ?? "");
  const software = await getSoftwareBySlug(slug);
  if (!software) {
    return { status: "error", message: "That product could not be found." };
  }

  const fieldErrors: Record<string, string> = {};

  const reviewerName = String(form.get("reviewer_name") ?? "").trim();
  const reviewTitle = String(form.get("review_title") ?? "").trim();
  const summary = String(form.get("summary") ?? "").trim();

  if (reviewerName.length < 2) fieldErrors.reviewer_name = "Please give your name.";
  if (reviewTitle.length < 4) fieldErrors.review_title = "Please add a short headline.";
  if (summary.length < 40) {
    fieldErrors.summary =
      "Please write at least a couple of sentences so the review is useful to other buyers.";
  }

  const ratings: Record<string, number> = {};
  for (const field of RATING_FIELDS) {
    const value = readRating(form, field);
    if (value === null) {
      fieldErrors[field] = "Please give a rating.";
    } else {
      ratings[field] = value;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Reviews cannot be accepted just yet. Please try again shortly.",
    };
  }

  const headerList = await headers();

  /*
    Submissions land as `hidden` and are published by an admin. An open review
    wall with no moderation step is an invitation to astroturfing, and the
    whole proposition here is that the ratings can be trusted.
  */
  const { error } = await supabase.from("reviews").insert({
    software_id: software.id,
    reviewer_name: reviewerName,
    reviewer_job_title: String(form.get("reviewer_job_title") ?? "").trim() || null,
    reviewer_company: String(form.get("reviewer_company") ?? "").trim() || null,
    reviewer_industry: String(form.get("reviewer_industry") ?? "").trim() || null,
    reviewer_company_size:
      String(form.get("reviewer_company_size") ?? "").trim() || null,
    reviewer_country: String(form.get("reviewer_country") ?? "South Africa"),
    reviewer_city: String(form.get("reviewer_city") ?? "").trim() || null,
    used_for_duration: String(form.get("used_for_duration") ?? "").trim() || null,
    ...ratings,
    review_title: reviewTitle,
    summary,
    pros: String(form.get("pros") ?? "").trim() || null,
    cons: String(form.get("cons") ?? "").trim() || null,
    status: "hidden",
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong saving your review. Please try again.",
    };
  }

  // Derived for abuse handling only, and never stored as a raw address.
  void hashIp(clientIp(headerList));

  revalidatePath(`/software/${software.slug}`);
  revalidatePath(`/software/${software.slug}/reviews`);

  return {
    status: "success",
    message:
      "Thank you. Your review has been received and will appear once it has been checked.",
  };
}
