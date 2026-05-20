
import { supabase } from "./supabase";

import { KnowledgeBaseFormData } from "types/knowledgeBase";


export async function saveKnowledgeBase(
  formData: KnowledgeBaseFormData
) {
  try {
    console.log("Saving knowledge base entry with data:", formData);

    // TEXT USED FOR EMBEDDING
    const textToEmbed = `
Title:
${formData.title}

Question:
${formData.question || ""}

Answer:
${formData.answer || ""}

Content:
${formData.content || ""}

Category:
${formData.category || ""}

Keywords:
${formData.keywords || ""}

Tags:
${formData.tags || ""}

User Phrases:
${formData.common_user_phrases || ""}
`;

    const response = await fetch(
      "https://pwapuqdeixecueqxjhoo.supabase.co/functions/v1/generate-embedding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToEmbed,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    const embedding = result.embedding;

    console.log("Embedding:", embedding);


    // INSERT INTO SUPABASE
    const { data, error } = await supabase
      .from("knowledge_base")
      .insert({
        type: formData.type,

        title: formData.title,

        question: formData.question,

        answer: formData.answer,

        content: formData.content,

        category: formData.category,

        tags: formData.tags?.split(",").map((tag) => tag.trim()),

        keywords: formData.keywords
          ?.split(",")
          .map((keyword) => keyword.trim()),

        common_user_phrases: formData.common_user_phrases?.split(",").map((phrase) => phrase.trim()),

        priority: Number(formData.priority),

        visibility: formData.visibility,

        is_active: formData.is_active,

        embedding,
      })
      .select();

    if (error) {
      console.error("Database Insert Error:", error);
      throw error;
    }

    console.log("Inserted Successfully:", data);

    return data;
  } catch (err) {
    console.error("Upload Error:", err);
    throw err;
  }
}