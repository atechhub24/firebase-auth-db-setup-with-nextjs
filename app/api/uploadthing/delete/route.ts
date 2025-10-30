import { UTApi } from "uploadthing/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get("fileKey");

    if (!fileKey) {
      return Response.json({ error: "File key is required" }, { status: 400 });
    }

    // Validate UploadThing token is present
    if (!process.env.UPLOADTHING_TOKEN) {
      return Response.json(
        { error: "UploadThing token not configured" },
        { status: 500 }
      );
    }

    const utapi = new UTApi();

    await utapi.deleteFiles(fileKey);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return Response.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
