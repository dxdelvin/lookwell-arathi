from datetime import datetime

from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.core.config import SITE

app = FastAPI(title=SITE["name"], version="1.0.0")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


# ── Page Routes ──────────────────────────────────────────

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"site": SITE, "active_nav": "home"},
    )


@app.get("/about")
async def about(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="about.html",
        context={"site": SITE, "active_nav": "about"},
    )


@app.get("/services")
async def services(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="services.html",
        context={"site": SITE, "active_nav": "services"},
    )


@app.get("/reviews")
async def reviews(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="reviews.html",
        context={"site": SITE, "active_nav": "reviews"},
    )


# ── SEO Routes ───────────────────────────────────────────

@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt():
    site_url = SITE["site_url"]
    return f"""User-agent: *
Allow: /
Disallow: /health
Disallow: /static/

Sitemap: {site_url}/sitemap.xml

# Lookwell Ladies Beauty Parlour — Airoli, Navi Mumbai
"""


@app.get("/sitemap.xml")
async def sitemap_xml():
    site_url = SITE["site_url"]
    today = datetime.now().strftime("%Y-%m-%d")
    pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "weekly"},
        {"loc": "/about", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/services", "priority": "0.9", "changefreq": "weekly"},
        {"loc": "/reviews", "priority": "0.7", "changefreq": "weekly"},
    ]
    urls = ""
    for page in pages:
        urls += f"""  <url>
    <loc>{site_url}{page['loc']}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>
"""
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}</urlset>"""
    return Response(content=xml, media_type="application/xml")


# ── Health ───────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "healthy", "project": SITE["name"]}
