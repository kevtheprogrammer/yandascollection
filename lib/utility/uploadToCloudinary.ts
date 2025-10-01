export const uploadToCloudinary = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", "your_upload_preset"); // set in your Cloudinary dashboard
	formData.append("cloud_name", "your_cloud_name"); // your Cloudinary cloud name

	const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error("Failed to upload image");
	}

	const data = await response.json();
	return data.secure_url; // this is the URL you want
};
