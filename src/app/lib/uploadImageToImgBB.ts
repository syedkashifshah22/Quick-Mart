export async function uploadImageToImgBB(imageFile: File): Promise<string | null> {
  const apiKey = "5ab70665048c0a56fbbe38521e3e4b5a";

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.data.url; 
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return null;
  }
}
