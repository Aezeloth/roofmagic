export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "roofmagic",
    SOURCES: "roofmagic/sources",
    RENDERS: "roofmagic/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

export const buildRoofPrompt = (material: string, hexColor: string): string => `
TASK: Replace ONLY the existing roof material in the input image with a Brand New ${material} ${hexColor}. Every other pixel must remain untouched.

STRICT REQUIREMENTS (do not violate):
1) IDENTICAL FRAMING: Output must be pixel-for-pixel the same crop, zoom, field of view, and composition as the input. Do not zoom in, zoom out, pan, rotate, or crop differently. The house and all surroundings must occupy the exact same position in the frame.
2) PRESERVE ARCHITECTURE: Do not change the shape, height, or footprint of the house. Walls, windows, doors, and landscape must remain identical to the original.
3) MATCH ROOF GEOMETRY: The pitch, ridges, and slopes must follow the exact lines of the original structure. No new gables or style changes.
4) CLEAN EDGES: The new material must meet the fascia and gutters perfectly. No texture "bleeding" onto the walls.
5) NO ARTIFACTS: Do not add chimneys, vents, or solar panels not present in the original image.
6) REALISTIC LIGHTING: Highlights and shadows must match the directional daylight of the original scene.

STRUCTURE & DETAILS:
- Surface: Replace current roof texture with ${material} material.
- Finish: Semi-gloss industrial coating with a clean, brand-new appearance.
- Color: Consistent ${hexColor} across the entire roof surface.
- Details: Render realistic material-specific reflections and subtle depth.

STYLE & RENDERING:
- Perspective: Maintain the EXACT original camera angle, height, and distance — do not alter perspective.
- Clarity: High-definition architectural photography; sharp focus on roof texture.
- Output: Professional real estate visualization; no watermarks, no distorted geometry, no text.
`.trim();