from fastapi import FastAPI, Request
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


# ── Health ───────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "healthy", "project": SITE["name"]}
