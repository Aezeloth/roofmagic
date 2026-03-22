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

export const ROOFMAGIC_RENDER_PROMPT = `
TASK: Replace the existing roof material in the input image with a Brand New Galvanized Blue Navy Metal.

STRICT REQUIREMENTS (do not violate):
1) PRESERVE ARCHITECTURE: Do not change the shape, height, or footprint of the house. Walls, windows, and landscape must remain identical to the original.
2) MATCH ROOF GEOMETRY: The pitch, ridges, and slopes must follow the exact lines of the original structure. No new gables or style changes.
3) CLEAN EDGES: The new material must meet the fascia and gutters perfectly. No texture "bleeding" onto the walls.
4) NO ARTIFACTS: Do not add chimneys, vents, or solar panels not present in the original image.
5) REALISTIC LIGHTING: Highlights and shadows must match the directional daylight of the original scene.

STRUCTURE & DETAILS:
- Surface: Replace current tile texture with parallel standing-seam metal ribs.
- Finish: Semi-gloss industrial coating with a clean, brand-new appearance.
- Color: Consistent Blue Navy across the entire roof surface.
- Details: Render realistic metallic reflections and subtle material-specific depth.

STYLE & RENDERING:
- Perspective: Maintain the original high-angle aerial perspective.
- Clarity: High-definition architectural photography; sharp focus on roof texture.
- Output: Professional real estate visualization; no watermarks, no distorted geometry, no text.
`.trim();