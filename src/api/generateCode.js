const systemPrompt = `You are an expert tailwind developer. A user will provide you with a low-fidelity wireframe of an application and you will return a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out. if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`;

export async function generateCode(image) {
  const body = {
    image: image,
    prompt: systemPrompt,
  };

  try {
    const res = await fetch(`http://localhost:4000/ask`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });

    console.log(body);

    const resJson = await res.json();

    console.log(resJson);

    return resJson;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
