import { createUploadthing, type FileRouter } from "uploadthing/next";

// Validate UploadThing token is present (server-side only)
if (!process.env.UPLOADTHING_TOKEN) {
  throw new Error(
    "UPLOADTHING_TOKEN is required. Please add it to your .env.local file.",
  );
}

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Metadata can be passed from client via upload options
      // File renaming happens on client side using userId
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        "Upload complete:",
        file.url,
        "Key:",
        file.key,
        "Name:",
        file.name,
      );
      return {
        url: file.url,
        key: file.key,
        name: file.name,
      };
    }),

  multipleImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),

  documentUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),

  generalUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 2,
    },
    video: {
      maxFileSize: "256MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
