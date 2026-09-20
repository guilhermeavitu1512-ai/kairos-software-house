import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "KAIROS Software House", short_name: "KAIROS", description: "Sites, sistemas, apps e automações.", start_url: "/", display: "standalone", background_color: "#030914", theme_color: "#030914" }; }
