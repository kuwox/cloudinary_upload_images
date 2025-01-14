'use client'

import { useState } from "react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setImageUrl(data.url)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Image Uploader</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                </label>
              </div>
              {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
            {imageUrl && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Uploaded Image:</h2>
                <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}