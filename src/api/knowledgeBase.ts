import OpenAI from "openai";

import { supabase } from "./supabase";

import { KnowledgeBaseFormData } from "types/knowledgeBase";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function saveKnowledgeBase(formData: KnowledgeBaseFormData) {
  const textToEmbed = `
Title:
${formData.title}

Question:
${formData.question}

Answer:
${formData.answer}

Content:
${formData.content}

Category:
${formData.category}

Keywords:
${formData.keywords}

Tags:
${formData.tags}
`;

  // GENERATE EMBEDDING
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: textToEmbed,
  });

  const embedding = embeddingResponse.data[0].embedding;

  // INSERT INTO SUPABASE
  const { data, error } = await supabase.from("knowledge_base").insert({
    type: formData.type,

    title: formData.title,

    question: formData.question,

    answer: formData.answer,

    content: formData.content,

    category: formData.category,

    tags: formData.tags?.split(",").map((tag) => tag.trim()),

    keywords: formData.keywords?.split(",").map((keyword) => keyword.trim()),

    common_user_phrases: formData.common_user_phrases
      ?.split(",")
      .map((phrase) => phrase.trim()),

    priority: Number(formData.priority),

    visibility: formData.visibility,

    is_active: formData.is_active,

    embedding,
  });

  if (error) {
    throw error;
  }

  return data;
}
