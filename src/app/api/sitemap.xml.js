export default function handler(req, res) {
  const pages = [
    { url: "/", priority: "1.0", changefreq: "daily", lastmod: today },
    { url: "/my-reservations", priority: "0.8", changefreq: "weekly", lastmod: today },
    { url: "/reservations", priority: "0.7", changefreq: "weekly", lastmod: today },
  ];
  
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>https://toplantim-nerede.vercel.app${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>`
        )
        .join("")}
    </urlset>`;
  
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  }
  