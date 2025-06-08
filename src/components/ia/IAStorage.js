import { ref, set } from "firebase/database";
import { db } from "../../firebase";

export async function saveToLibrary({
  label,
  content,
  type = "texte",
  session = "default",
  image = null
}) {
  const id = `ar_${Date.now()}`;
  await set(ref(db, `arlibrary/${id}`), {
    id,
    label,
    type,
    content,
    image,
    session,
    createdAt: Date.now()
  });
  return id;
}