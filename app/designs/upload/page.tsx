"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UploadDesignPage() {
  const [designName, setDesignName] = useState("");
  const [category, setCategory] = useState("shirt");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [variations, setVariations] = useState<
    Array<{ color: string; sizes: Array<{ size: string; stock: number }> }>
  >([]);

  const [images, setImages] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // 🔹 Variations Handlers
  const addVariation = () => {
    setVariations([
      ...variations,
      {
        color: "",
        sizes: [
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
          { size: "L", stock: 0 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 0 },
          { size: "3XL", stock: 0 },
        ],
      },
    ]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariationColor = (index: number, color: string) => {
    const updated = [...variations];
    updated[index].color = color;
    setVariations(updated);
  };

  const updateVariationStock = (
    varIndex: number,
    sizeIndex: number,
    stock: number
  ) => {
    const updated = [...variations];
    updated[varIndex].sizes[sizeIndex].stock = stock;
    setVariations(updated);
  };

  // 🔹 Image Handlers
  const removeImage = (indexToRemove: number) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedUrls);
  };

  const uploadImages = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setImageUrls(uploadedUrls);
    } catch (err: any) {
      setMessage("Failed to upload images: " + err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setImages(files);
      uploadImages(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length > 0) {
        const fileList = new DataTransfer();
        imageFiles.forEach((file) => fileList.items.add(file));
        handleFileSelect(fileList.files);
      }
    }
  };

  // 🔹 Submit Handler
  const handleSubmit = async (status: "draft" | "published") => {
    setLoading(true);
    try {
      const payload = {
        designName,
        imageUrl: imageUrls,
        category,
        description,
        price: Number(price),
        variations,
        status,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/designs/create-design`,
        payload
      );
      setMessage(res.data.message || "Design saved successfully!");
      setTimeout(() => {
        router.push("/designs");
      }, 2000);
    } catch (err: any) {
      setMessage("Error saving design: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-fit">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - Form Fields */}
          <div className="space-y-8">
            {/* Design Name */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Design Name
              </label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-800 placeholder-gray-500"
                placeholder="Enter the design name"
                required
              />
            </div>

            {/* Category */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-800 appearance-none cursor-pointer"
                >
                  <option value="shirt">Shirt</option>
                  <option value="shorts">Shorts</option>
                  <option value="hoodie">Hoodie</option>
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-800 placeholder-gray-500 resize-none"
                rows={5}
                placeholder="Enter the design description"
                required
              />
            </div>

            {/* Price */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₱
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-800"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Upload Section */}
          <div className="space-y-8">
            {/* Upload Images */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Design Images
              </label>

              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`block border-2 h-[250px] border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    uploadingImages
                      ? "border-yellow-400 bg-yellow-50/30"
                      : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/30"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadingImages ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg
                        className="animate-spin h-12 w-12 text-yellow-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 
                             0 0 5.373 0 12h4zm2 5.291A7.962 
                             7.962 0 014 12H0c0 3.042 
                             1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
                        Uploading Images...
                      </h3>
                      <p className="text-yellow-500">Please wait</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
                        Drop your images here
                      </h3>
                      <p className="text-gray-500 mb-4">or click to browse</p>
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        Choose Images
                      </div>
                    </>
                  )}
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={url}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        type="button"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Variations */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  Color Variations
                </label>
                <button
                  type="button"
                  onClick={addVariation}
                  className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  + Add Color
                </button>
              </div>

              {variations.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-gray-500 text-sm">
                    No variations added yet. Click "+ Add Color" to start.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variations.map((variation, varIndex) => (
                    <div
                      key={varIndex}
                      className="border-2 border-gray-200 rounded-xl p-4 bg-white/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={variation.color}
                          onChange={(e) =>
                            updateVariationColor(varIndex, e.target.value)
                          }
                          className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Color name (e.g., Red, Blue)"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariation(varIndex)}
                          className="ml-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {variation.sizes.map((size, sizeIndex) => (
                          <div key={sizeIndex} className="text-center">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {size.size}
                            </label>
                            <input
                              type="number"
                              value={size.stock}
                              onChange={(e) =>
                                updateVariationStock(
                                  varIndex,
                                  sizeIndex,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-2 py-2 text-center bg-white border border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100 transition-all text-gray-800"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading || uploadingImages}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>

          <button
            onClick={() => handleSubmit("published")}
            disabled={loading || uploadingImages}
            className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-6 rounded-2xl shadow-lg ${
            message.includes("Error")
              ? "bg-red-50 border-l-4 border-red-400"
              : "bg-green-50 border-l-4 border-green-400"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {message.includes("Error") ? (
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 
                       9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 
                       9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  message.includes("Error") ? "text-red-800" : "text-green-800"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
