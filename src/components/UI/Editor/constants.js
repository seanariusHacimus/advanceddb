// Editor Constants
export const VALID_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
];

export const VALID_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
];

// Default toolbar configuration
export const DEFAULT_TOOLBAR = [
  [
    { header: [1, 2, 3, 4, 5, 6, false] },
    { size: ["small", false, "large", "huge"] },
  ],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image", "blockquote", "code-block"],
  ["clean", "html"],
];

// Base modules configuration
export const BASE_MODULES = {
  toolbar: DEFAULT_TOOLBAR,
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: true,
  },
};

// Quill formats
export const QUILL_FORMATS = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "direction",
  "link",
  "image",
  "blockquote",
  "code-block",
  "html",
];

// Color options for text and background
export const COLOR_OPTIONS = [
  { value: "", label: "Default" },
  { value: "#e60000", label: "Red" },
  { value: "#ff9900", label: "Orange" },
  { value: "#ffff00", label: "Yellow" },
  { value: "#008a00", label: "Green" },
  { value: "#0066cc", label: "Blue" },
  { value: "#9933ff", label: "Purple" },
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#888888", label: "Gray" },
];
