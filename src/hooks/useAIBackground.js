import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ─── In-memory cache so we don't regenerate the same background twice ─────────
const imageCache = new Map();

/**
 * Build a rich, cinematic prompt for the background image.
 * We want extremely atmospheric, cinematic photography-style images.
 */
function buildPrompt(city, condition) {
  const conditionMap = {
    'Storm with Heavy Rain': 'dramatic thunderstorm with lightning bolts illuminating dark storm clouds, torrential rain, wet reflections on streets',
    'Rain with Overcast Clouds': 'heavy rain falling on city streets, dark overcast sky, reflections in puddles, moody atmosphere',
    'Heavy Snow': 'heavy snowfall blanketing the city, snow-covered rooftops and streets, cold blue-white atmosphere, winter wonderland',
    'Dense Fog': 'thick mysterious fog rolling through the city streets, barely visible buildings, ethereal atmosphere, soft diffused light',
    'Clear Sky': 'crystal clear sky with beautiful golden hour sunlight, warm glow on buildings, stunning sunset colors',
    'Partly Cloudy': 'dramatic clouds with sunlight breaking through, volumetric light rays, beautiful cloud formations',
    'Strong Winds': 'dramatic windstorm with clouds racing across the sky, trees bending, dynamic atmospheric motion',
    'Storm': 'dramatic thunderstorm with lightning, dark purple-grey clouds, electrical storm atmosphere',
    'Rainy': 'rainy day with wet streets, reflections, overcast moody sky',
    'Snow': 'snowfall over the city, cold blue winter atmosphere, snow-covered surfaces',
    'Foggy': 'dense fog enveloping the cityscape, mysterious and ethereal',
    'Cloudy': 'dramatic cloud formations with depth and atmosphere',
    'Variable Weather': 'dramatic atmospheric sky with changing weather conditions',
  };

  const weatherDesc = conditionMap[condition] || conditionMap['Variable Weather'];

  return `Ultra-realistic cinematic wide-angle photograph of ${city} cityscape during ${weatherDesc}. Shot on Sony A7III, 24mm lens, f/2.8. Photorealistic, moody cinematic color grading, atmospheric depth, volumetric lighting. 8K quality, award-winning photography. No text, no watermarks, no UI elements.`;
}

/**
 * Generate a cache key from city + condition
 */
function getCacheKey(city, condition) {
  return `${city.toLowerCase().trim()}_${condition.toLowerCase().trim()}`;
}

/**
 * Pollinations AI fallback — free, no API key, works instantly
 */
async function fallbackToPollinations(city, condition, cacheKey, controller, imageCache, setImageUrl, setIsGenerating) {
  const prompt = `cinematic photography of ${city} during ${condition}, dark moody atmospheric weather, ultra realistic, 8K`;
  const seed = city.length * 7 + condition.length * 13;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&nologo=true&seed=${seed}`;

  // Preload the image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      if (controller.signal.aborted) return reject(new Error('Aborted'));
      imageCache.set(cacheKey, url);
      setImageUrl(url);
      setIsGenerating(false);
      resolve();
    };
    img.onerror = () => {
      reject(new Error('Pollinations failed'));
    };
    img.src = url;
  });
}

/**
 * Hook that generates AI background images using Gemini Imagen
 * Falls back to Pollinations AI if Gemini is unavailable
 */
export default function useAIBackground(city, condition) {
  const [imageUrl, setImageUrl] = useState(() => {
    if (city && condition) {
      const cacheKey = getCacheKey(city, condition);
      if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);
    }
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const prevKeyRef = useRef(null);

  const generateImage = useCallback(async (targetCity, targetCondition) => {
    const cacheKey = getCacheKey(targetCity, targetCondition);

    // Skip if already showing this image
    if (prevKeyRef.current === cacheKey && imageUrl) return;
    prevKeyRef.current = cacheKey;

    // Check cache first
    if (imageCache.has(cacheKey)) {
      if (imageUrl !== imageCache.get(cacheKey)) {
        setImageUrl(imageCache.get(cacheKey));
      }
      setIsGenerating(false);
      setError(null);
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Cancel any in-flight generation
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // ─── Try Gemini Imagen first ────────────────────────────────────────
      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = buildPrompt(targetCity, targetCondition);

        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '16:9',
          },
        });

        // Check if aborted while waiting
        if (controller.signal.aborted) return;

        if (response?.generatedImages?.[0]?.image?.imageBytes) {
          const base64 = response.generatedImages[0].image.imageBytes;
          const blobUrl = `data:image/png;base64,${base64}`;

          // Cache it
          imageCache.set(cacheKey, blobUrl);
          setImageUrl(blobUrl);
          setIsGenerating(false);
          return;
        }
      }

      // ─── Fallback: Pollinations AI (free, no key needed) ────────────────
      await fallbackToPollinations(targetCity, targetCondition, cacheKey, controller, imageCache, setImageUrl, setIsGenerating);

    } catch (err) {
      if (controller.signal.aborted) return;
      console.warn('Gemini image generation failed, falling back:', err.message);

      // Try Pollinations fallback
      try {
        await fallbackToPollinations(targetCity, targetCondition, cacheKey, controller, imageCache, setImageUrl, setIsGenerating);
      } catch (fallbackErr) {
        if (!controller.signal.aborted) {
          setError('Background generation failed');
          setIsGenerating(false);
        }
      }
    }
  }, [imageUrl]);

  // Trigger generation when city or condition changes
  useEffect(() => {
    if (!city || !condition) return;
    generateImage(city, condition);

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [city, condition]);

  return { imageUrl, isGenerating, error };
}
