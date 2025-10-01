// import fs from "fs";
// import path from "path";
// import formidable from "formidable";

// export const config = {
//   api: {
//     bodyParser: false, // Disable default bodyParser to use formidable
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const form = new formidable.IncomingForm();
//   form.uploadDir = path.join(process.cwd(), "public/uploads"); // Destination folder
//   form.keepExtensions = true; // Keep file extensions

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: "Error parsing file" });
//     }

//     const file = files.image; // Get uploaded file
//     const filePath = `/uploads/${Date.now()}-${file[0].originalFilename}`; // Unique filename
//     const newPath = path.join(process.cwd(), "public", filePath);

//     fs.renameSync(file[0].filepath, newPath); // Move file to public/uploads

//     res.status(200).json({ imagePath: filePath }); // Return path to frontend
//   });
// }
