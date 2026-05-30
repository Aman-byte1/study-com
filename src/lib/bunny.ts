/**
 * Bunny.net CDN Integration
 * Supports Bunny Storage (file upload/hosting) + Bunny CDN (delivery)
 */

const BUNNY_STORAGE_ZONE = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE || 'studycom-videos'
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || ''
const BUNNY_PULL_ZONE_URL = process.env.NEXT_PUBLIC_BUNNY_CDN_URL || 'https://studycom.b-cdn.net'

export interface BunnyUploadResult {
  success: boolean
  url?: string
  cdnUrl?: string
  path?: string
  error?: string
}

/**
 * Upload a file to Bunny Storage
 * @param file The file to upload
 * @param storagePath Path within the storage zone (e.g. 'courses/1/lessons/video.mp4')
 * @returns Upload result with CDN URL
 */
export async function uploadToBunny(
  file: File,
  storagePath: string
): Promise<BunnyUploadResult> {
  try {
    const url = `https://la.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Bunny upload failed (${response.status}): ${errorText}`,
      }
    }

    const cdnUrl = `${BUNNY_PULL_ZONE_URL}/${storagePath}`

    return {
      success: true,
      url: cdnUrl,
      cdnUrl,
      path: storagePath,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    return { success: false, error: message }
  }
}

/**
 * Delete a file from Bunny Storage
 * @param storagePath Path within the storage zone
 */
export async function deleteFromBunny(storagePath: string): Promise<boolean> {
  try {
    const url = `https://la.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_API_KEY,
      },
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Generate a file path for a lesson video
 * @param courseId Course ID
 * @param lessonId Lesson ID
 * @param filename Original filename
 */
export function getLessonVideoPath(courseId: string, lessonId: string, filename: string): string {
  const ext = filename.split('.').pop() || 'mp4'
  return `courses/${courseId}/lessons/${lessonId}/video.${ext}`
}

/**
 * Check if a URL is a Bunny CDN URL (for video player detection)
 */
export function isBunnyUrl(url: string): boolean {
  return url.includes('.b-cdn.net') || url.includes('.storage.bunnycdn.com')
}

/**
 * Check if URL points to a direct video file (vs YouTube embed)
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false
  const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const ext = url.split('?')[0].toLowerCase()
  return videoExts.some(e => ext.endsWith(e)) || isBunnyUrl(url)
}