import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "KAIROS Software House", short_name: "KAIROS", description: "Transformamos problemas em software.", start_url: "/", display: "standalone", background_color: "#030914", theme_color: "#030914" }; }
