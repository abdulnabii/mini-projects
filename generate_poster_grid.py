import os
import glob
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Canvas Dimensions (4:5 vertical ratio, 2400 x 3000, ideal for LinkedIn)
W, H = 2400, 3000

# Fonts
try:
    FONT_TITLE = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 64)
    FONT_SUBTITLE = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 30)
    FONT_BADGE = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 22)
    FONT_CARD_TITLE = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
    FONT_CARD_TAG = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 19)
    FONT_CARD_FOOTER = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 17)
    FONT_FOOTER = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 28)
    FONT_FOOTER_TAG = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 22)
except Exception:
    FONT_TITLE = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 64)
    FONT_SUBTITLE = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 30)
    FONT_BADGE = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
    FONT_CARD_TITLE = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
    FONT_CARD_TAG = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 19)
    FONT_CARD_FOOTER = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 17)
    FONT_FOOTER = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 28)
    FONT_FOOTER_TAG = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)

PROJECTS = [
    {"day": 1, "name": "HealthPulse.AI", "category": "HEALTHCARE AI", "tag": "Next.js • Gemini 2.5", "color": (0, 245, 160)},
    {"day": 2, "name": "CodeReview.AI", "category": "CYBER-IDE / AST", "tag": "Monaco • Gemini API", "color": (0, 210, 255)},
    {"day": 3, "name": "ResumeCraft.AI", "category": "ATS OPTIMIZER", "tag": "Next.js • Print CSS", "color": (56, 189, 248)},
    {"day": 4, "name": "GlucoPredict.AI", "category": "CLINICAL ML / SHAP", "tag": "Scikit-Learn • Gemini", "color": (239, 68, 68)},
    {"day": 5, "name": "MeetingMind.AI", "category": "EXECUTIVE NLP", "tag": "Next.js • Gemini API", "color": (168, 85, 247)},
    {"day": 6, "name": "PulseMarket.AI", "category": "FINTECH TERMINAL", "tag": "SVG Charts • Gemini", "color": (34, 197, 94)},
    {"day": 7, "name": "BrandForge.AI", "category": "VECTOR IDENTITY", "tag": "SVG Generative • Gemini", "color": (249, 115, 22)},
    {"day": 8, "name": "SpendWise.AI", "category": "EXPENSE TRACKER", "tag": "Budget Pacing • Gemini", "color": (16, 185, 129)},
    {"day": 9, "name": "GitPulse.AI", "category": "DEV PORTFOLIO", "tag": "GraphQL • Radar DNA", "color": (99, 102, 241)},
    {"day": 10, "name": "MailCraft.AI", "category": "EMAIL OPTIMIZER", "tag": "Open Rate AI • Gemini", "color": (236, 72, 153)},
    {"day": 11, "name": "RadVision.AI", "category": "GRADCAM VISION", "tag": "HTML5 Canvas • Gemini", "color": (6, 182, 212)},
    {"day": 12, "name": "AlgoCoach.AI", "category": "INTERVIEW COACH", "tag": "Big-O AST • Gemini", "color": (139, 92, 246)},
    {"day": 13, "name": "WealthPulse.AI", "category": "FIRE SIMULATOR", "tag": "Monte Carlo • Gemini", "color": (16, 185, 129)},
    {"day": 14, "name": "LingoPulse.AI", "category": "SPACED REPETITION", "tag": "SM-2 Engine • Speech", "color": (245, 158, 11)},
    {"day": 15, "name": "RankCraft.AI", "category": "SERP / E-E-A-T SEO", "tag": "Next.js • Gemini API", "color": (59, 130, 246)},
    {"day": 16, "name": "CloudArchitect.AI", "category": "CLOUD SPOF AUDIT", "tag": "React Flow • Terraform", "color": (14, 165, 233)},
    {"day": 17, "name": "JobFlow.AI", "category": "CAREER CRM", "tag": "Kanban Pipeline • AI", "color": (168, 85, 247)},
    {"day": 18, "name": "MindReflect.AI", "category": "CBT WELLNESS", "tag": "Mood Heatmap • Gemini", "color": (20, 184, 166)},
    {"day": 19, "name": "ScribbleAI", "category": "INFINITE CANVAS", "tag": "HTML5 Vector • Gemini", "color": (236, 72, 153)},
    {"day": 20, "name": "MacroBite.AI", "category": "TDEE NUTRITION", "tag": "Macro Engine • Gemini", "color": (34, 197, 94)},
    {"day": 21, "name": "LoadPulse.AI", "category": "SRE LOAD TESTING", "tag": "Web Workers • p99", "color": (239, 68, 68)},
    {"day": 22, "name": "LexiGuard.AI", "category": "LEGALTECH AUDIT", "tag": "Contract Risk • Gemini", "color": (168, 85, 247)},
    {"day": 23, "name": "HomeSync.AI", "category": "IOT ENERGY", "tag": "Smart Living • Gemini", "color": (56, 189, 248)},
    {"day": 24, "name": "RepoRadar.AI", "category": "OSS DISCOVERY", "tag": "Bus Factor • GitHub API", "color": (99, 102, 241)},
    {"day": 25, "name": "ThreadGenius.AI", "category": "CONTENT STUDIO", "tag": "Viral Repurposing • AI", "color": (244, 63, 94)},
    {"day": 26, "name": "MediGuard.AI", "category": "DRUG SAFETY", "tag": "Interaction Matrix • AI", "color": (16, 185, 129)},
    {"day": 27, "name": "QueryForge.AI", "category": "SQL / ORM STUDIO", "tag": "Monaco • Schema Translate", "color": (14, 165, 233)},
    {"day": 28, "name": "OmniData.3D", "category": "3D WEBGL SPATIAL", "tag": "Three.js • Point Cloud", "color": (168, 85, 247)},
    {"day": 29, "name": "OpsPulse.AI", "category": "SRE INCIDENT OPS", "tag": "War Room • SLO Burn", "color": (239, 68, 68)},
    {"day": 30, "name": "SaaSForge.AI", "category": "MULTI-TENANT SAAS", "tag": "Stripe • API Keys Portal", "color": (0, 245, 160)},
]

# Map of existing GIF recordings
GIF_MAP = {
    14: ['day-14-language-flashcard-ai/public/lingopulse_demo.gif'],
    15: ['day-15-ai-blog-seo-optimizer/public/rankcraft_demo.gif', 'rankcraft_demo.gif'],
    16: ['day-16-cloud-architecture-ai/public/cloudarchitect_demo.gif', 'cloudarchitect_demo.gif'],
    17: ['day-17-job-application-tracker/public/careerflow_demo.gif', 'careerflow_demo.gif'],
    18: ['day-18-mental-health-journal/public/mindreflect_demo.gif', 'mindreflect_demo.gif'],
    19: ['day-19-collaborative-whiteboard/public/canvasflow_demo.gif', 'canvasflow_demo.gif'],
    20: ['day-20-ai-nutrition-planner/public/nutrigenius_demo.gif', 'nutrigenius_demo.gif'],
    21: ['day-21-api-load-testing-dashboard/public/loadpulse_demo.gif', 'loadpulse_demo.gif'],
    22: ['day-22-legal-document-analyzer/public/clausewise_demo.gif', 'clausewise_demo.gif'],
    23: ['day-23-smart-home-dashboard/public/aurahome_demo.gif', 'aurahome_demo.gif'],
    24: ['day-24-opensource-discovery-engine/public/gitmatch_demo.gif', 'gitmatch_demo.gif'],
    25: ['day-25-ai-content-studio/public/threadgenius_demo.gif', 'threadgenius_demo.gif'],
    26: ['day-26-medication-reminder-system/public/mediguard_demo.gif', 'mediguard_demo.gif'],
    28: ['day-28-3d-data-visualization/omnidata3d_demo.gif', 'day-28-3d-data-visualization/omnidata_demo.gif'],
    29: ['day-29-devops-incident-assistant/opspulse_ai_demo.gif'],
    30: ['day-30-ai-saas-boilerplate/saasforge_demo.gif'],
}

def create_base_canvas():
    base = Image.new("RGB", (W, H), (6, 11, 17))
    draw = ImageDraw.Draw(base)

    # Cyber grid lines
    grid_spacing = 80
    for x in range(0, W, grid_spacing):
        draw.line([(x, 0), (x, H)], fill=(12, 22, 34), width=1)
    for y in range(0, H, grid_spacing):
        draw.line([(0, y), (W, y)], fill=(12, 22, 34), width=1)

    # Outer decorative cyber frame
    m = 24
    draw.rounded_rectangle([m, m, W - m, H - m], radius=28, outline=(0, 245, 160, 180), width=3)
    draw.rounded_rectangle([m + 8, m + 8, W - m - 8, H - m - 8], radius=22, outline=(0, 210, 255, 60), width=1)

    # Glowing corner brackets
    c_len = 60
    for cx, cy, dx, dy in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
        draw.line([(cx, cy), (cx + dx * c_len, cy)], fill=(0, 245, 160), width=6)
        draw.line([(cx, cy), (cx, cy + dy * c_len)], fill=(0, 245, 160), width=6)

    return base

def draw_header_and_footer(img):
    draw = ImageDraw.Draw(img)

    # Top Pill Badge
    pill_w, pill_h = 680, 48
    pill_x = (W - pill_w) // 2
    pill_y = 60
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=24, fill=(11, 25, 36), outline=(0, 245, 160), width=2)
    badge_text = "* MILESTONE COMPLETED - 30 / 30 SHIPPED"
    draw.text((pill_x + 65, pill_y + 11), badge_text, fill=(0, 245, 160), font=FONT_BADGE)

    # Main Header Title
    title = "30 DAYS OF AI • 30 PRODUCTION APPS"
    bbox = draw.textbbox((0, 0), title, font=FONT_TITLE)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 125), title, fill=(255, 255, 255), font=FONT_TITLE)

    # Subtitle
    subtitle = "FULL-STACK AI MONOREPO | 100% LIVE ON VERCEL | NEXT.JS 16 | GEMINI 2.5 | TYPESCRIPT"
    bbox_sub = draw.textbbox((0, 0), subtitle, font=FONT_SUBTITLE)
    sw = bbox_sub[2] - bbox_sub[0]
    draw.text(((W - sw) // 2, 205), subtitle, fill=(148, 163, 184), font=FONT_SUBTITLE)

    # Bottom Footer Bar
    foot_y = H - 120
    draw.line([(60, foot_y - 15), (W - 60, foot_y - 15)], fill=(20, 36, 54), width=2)

    left_foot = "BUILT BY ABDUL NABI | 100% OPEN SOURCE ON GITHUB"
    draw.text((80, foot_y + 12), left_foot, fill=(255, 255, 255), font=FONT_FOOTER)

    repo_tag = "github.com/abdulnabii/mini-projects"
    draw.text((80, foot_y + 48), repo_tag, fill=(0, 245, 160), font=FONT_BADGE)

    # Right side tech badges
    badges = ["Next.js 16", "Gemini 2.5", "TypeScript", "Tailwind CSS", "Vercel"]
    rx = W - 80
    for b in reversed(badges):
        bbox_b = draw.textbbox((0, 0), b, font=FONT_FOOTER_TAG)
        bw = bbox_b[2] - bbox_b[0] + 32
        bx = rx - bw
        draw.rounded_rectangle([bx, foot_y + 18, rx, foot_y + 56], radius=8, fill=(15, 28, 44), outline=(0, 210, 255, 120), width=1)
        draw.text((bx + 16, foot_y + 24), b, fill=(0, 210, 255), font=FONT_FOOTER_TAG)
        rx = bx - 14

def draw_mock_dashboard(draw, x, y, w, h, p):
    # Dark dashboard inner window
    draw.rounded_rectangle([x, y, x + w, y + h], radius=8, fill=(11, 18, 28), outline=(26, 41, 62), width=1)

    # Window titlebar with 3 dots
    draw.rectangle([x, y, x + w, y + 26], fill=(16, 26, 40))
    draw.ellipse([x + 10, y + 8, x + 18, y + 16], fill=(239, 68, 68))
    draw.ellipse([x + 24, y + 8, x + 32, y + 16], fill=(245, 158, 11))
    draw.ellipse([x + 38, y + 8, x + 46, y + 16], fill=(34, 197, 94))
    
    col = p["color"]
    day = p["day"]

    # Specific authentic UI patterns for days without GIFs
    if day == 1: # HealthPulse.AI
        # Triage urgency badge
        draw.rounded_rectangle([x + 14, y + 36, x + 180, y + 62], radius=6, fill=(40, 16, 20), outline=(239, 68, 68), width=1)
        draw.text((x + 22, y + 41), "HIGH TRIAGE (88%)", fill=(239, 68, 68), font=FONT_CARD_FOOTER)
        # Clinical parameters
        for i, (label, val) in enumerate([("Heart Rate", "104 bpm"), ("O2 Sat", "96%"), ("Pain Index", "8/10")]):
            bx = x + 14 + i * 118
            draw.rounded_rectangle([bx, y + 74, bx + 110, y + 124], radius=6, fill=(16, 28, 44))
            draw.text((bx + 8, y + 80), label, fill=(148, 163, 184), font=FONT_CARD_FOOTER)
            draw.text((bx + 8, y + 98), val, fill=(255, 255, 255), font=FONT_CARD_TITLE)
        # Red flags banner
        draw.rounded_rectangle([x + 14, y + 136, x + w - 14, y + 172], radius=6, fill=(30, 20, 25), outline=(239, 68, 68, 140), width=1)
        draw.text((x + 24, y + 145), "[!] 2 Critical Red Flags -> ED Triage", fill=(252, 165, 165), font=FONT_CARD_FOOTER)

    elif day == 2: # CodeReview.AI
        # Monaco cyber editor lines
        code_lines = [
            ("async function auditAST(code: string) {", (0, 210, 255)),
            ("  const tree = parseSyntax(code);", (244, 114, 182)),
            ("  // AI static security analysis", (100, 116, 139)),
            ("  if (!tree.hasSanitizer()) {", (251, 191, 36)),
            ("    return { risk: 'HIGH', cve: 'XSS' };", (239, 68, 68)),
            ("  }", (255, 255, 255)),
        ]
        for i, (line, color) in enumerate(code_lines):
            draw.text((x + 16, y + 36 + i * 22), line, fill=color, font=FONT_CARD_FOOTER)
        # Inline AST diff tag
        draw.rounded_rectangle([x + w - 165, y + h - 38, x + w - 14, y + h - 12], radius=4, fill=(16, 185, 129, 60), outline=(16, 185, 129), width=1)
        draw.text((x + w - 155, y + h - 34), "+ OPTIMIZED O(1)", fill=(52, 211, 153), font=FONT_CARD_FOOTER)

    elif day == 3: # ResumeCraft.AI
        # ATS dial & score
        draw.ellipse([x + 20, y + 42, x + 110, y + 132], outline=(30, 48, 70), width=8)
        draw.arc([x + 20, y + 42, x + 110, y + 132], start=-90, end=250, fill=(0, 245, 160), width=8)
        draw.text((x + 42, y + 74), "96%", fill=(255, 255, 255), font=FONT_CARD_TITLE)
        draw.text((x + 36, y + 138), "ATS SCORE", fill=(148, 163, 184), font=FONT_CARD_FOOTER)
        # Keyword checklist
        keywords = ["Google XYZ Metric Match", "Cloud DevOps Keywords", "Action Verb Strength"]
        for i, kw in enumerate(keywords):
            draw.text((x + 130, y + 46 + i * 28), "[v] " + kw, fill=(56, 189, 248), font=FONT_CARD_FOOTER)
            draw.rectangle([x + 130, y + 68 + i * 28, x + w - 20, y + 72 + i * 28], fill=(30, 48, 70))
            draw.rectangle([x + 130, y + 68 + i * 28, x + 130 + 150 + i * 20, y + 72 + i * 28], fill=(0, 245, 160))

    elif day == 4: # GlucoPredict.AI
        # SHAP feature bars
        draw.text((x + 16, y + 36), "SHAP CLINICAL FEATURE IMPACT", fill=(239, 68, 68), font=FONT_CARD_FOOTER)
        shap_items = [("HbA1c Level (>7.2)", 180, (239, 68, 68)), ("BMI (>31.4)", 130, (249, 115, 22)), ("Fasting Glucose", 155, (239, 68, 68)), ("Age Factor", 90, (59, 130, 246))]
        for i, (name, bar_w, bar_col) in enumerate(shap_items):
            draw.text((x + 16, y + 60 + i * 26), name, fill=(203, 213, 225), font=FONT_CARD_FOOTER)
            draw.rectangle([x + 180, y + 64 + i * 26, x + 180 + bar_w, y + 74 + i * 26], fill=bar_col)
        # Risk outcome
        draw.rounded_rectangle([x + 16, y + h - 42, x + w - 16, y + h - 12], radius=6, fill=(40, 16, 20), outline=(239, 68, 68), width=1)
        draw.text((x + 28, y + h - 36), "Calculated Risk: 76.4% Elevated", fill=(254, 202, 202), font=FONT_CARD_FOOTER)

    elif day == 5: # MeetingMind.AI
        # Waveform + Executive points
        draw.text((x + 16, y + 36), "AUDIO INTEL & ACTION ITEMS", fill=(168, 85, 247), font=FONT_CARD_FOOTER)
        for b in range(28):
            bh = max(4, int(12 + 18 * math.sin(b * 0.45) + 8 * math.cos(b * 0.9)))
            y_top = y + 60 + 25 - bh // 2
            y_bot = y + 60 + 25 + bh // 2
            draw.rectangle([x + 18 + b * 12, min(y_top, y_bot), x + 24 + b * 12, max(y_top, y_bot)], fill=(168, 85, 247))
        # Action items
        draw.text((x + 18, y + 105), "- Q3 Roadmap approved by VP Eng", fill=(255, 255, 255), font=FONT_CARD_FOOTER)
        draw.text((x + 18, y + 130), "- Stripe billing migration deadline: Sept 20", fill=(203, 213, 225), font=FONT_CARD_FOOTER)
        draw.text((x + 18, y + 155), "- Assigned: Abdul Nabi (Lead Architect)", fill=(0, 245, 160), font=FONT_CARD_FOOTER)

    elif day == 6: # PulseMarket.AI
        # Candlestick chart
        draw.text((x + 16, y + 34), "NVDA $128.40", fill=(34, 197, 94), font=FONT_CARD_TITLE)
        draw.rounded_rectangle([x + w - 120, y + 34, x + w - 14, y + 58], radius=4, fill=(16, 32, 24), outline=(34, 197, 94), width=1)
        draw.text((x + w - 108, y + 38), "RSI: 64.2", fill=(34, 197, 94), font=FONT_CARD_FOOTER)
        # Draw candlesticks
        candles = [(10, 35, 18, 28, True), (35, 45, 38, 42, False), (22, 50, 25, 44, True), (40, 65, 42, 58, True),
                   (52, 70, 60, 55, False), (48, 80, 52, 72, True), (65, 95, 70, 88, True), (80, 110, 85, 102, True)]
        for i, (low, high, o, c, is_green) in enumerate(candles):
            cx = x + 30 + i * 38
            ccol = (34, 197, 94) if is_green else (239, 68, 68)
            draw.line([(cx, y + 160 - high), (cx, y + 160 - low)], fill=ccol, width=2)
            draw.rectangle([cx - 8, min(y + 160 - o, y + 160 - c), cx + 8, max(y + 160 - o, y + 160 - c)], fill=ccol)

    elif day == 7: # BrandForge.AI
        # Vector logo studio
        draw.text((x + 16, y + 34), "VECTOR IDENTITY STUDIO", fill=(249, 115, 22), font=FONT_CARD_FOOTER)
        # Geometric SVG preview icon
        draw.polygon([(x + 45, y + 65), (x + 75, y + 120), (x + 15, y + 120)], outline=(249, 115, 22), width=3)
        draw.ellipse([x + 25, y + 78, x + 65, y + 118], outline=(0, 245, 160), width=2)
        draw.text((x + 95, y + 72), "NEXUS LOGO", fill=(255, 255, 255), font=FONT_CARD_TITLE)
        draw.text((x + 95, y + 102), "Geometric Modernist SVG", fill=(148, 163, 184), font=FONT_CARD_FOOTER)
        # Palette swatches
        swatches = [(249, 115, 22), (0, 245, 160), (0, 210, 255), (168, 85, 247), (255, 255, 255)]
        for i, sc in enumerate(swatches):
            draw.rounded_rectangle([x + 18 + i * 45, y + 142, x + 52 + i * 45, y + 172], radius=6, fill=sc)

    elif day == 8: # SpendWise.AI
        # Pacing gauge & expense bars
        draw.text((x + 16, y + 34), "MONTHLY PACING: 68% ON TRACK", fill=(16, 185, 129), font=FONT_CARD_FOOTER)
        draw.rectangle([x + 16, y + 56, x + w - 16, y + 70], fill=(20, 36, 50))
        draw.rectangle([x + 16, y + 56, x + int((w - 32) * 0.68), y + 70], fill=(16, 185, 129))
        cats = [("Cloud Infra", "$420", 160, (56, 189, 248)), ("SaaS Subscriptions", "$280", 110, (168, 85, 247)), ("Hardware Labs", "$650", 220, (249, 115, 22))]
        for i, (cname, cval, bar_w, bcol) in enumerate(cats):
            draw.text((x + 16, y + 84 + i * 28), cname, fill=(203, 213, 225), font=FONT_CARD_FOOTER)
            draw.text((x + 170, y + 84 + i * 28), cval, fill=(255, 255, 255), font=FONT_CARD_FOOTER)
            draw.rectangle([x + 230, y + 88 + i * 28, x + 230 + bar_w // 2, y + 98 + i * 28], fill=bcol)

    elif day == 9: # GitPulse.AI
        # GitHub 52-week heatmap grid preview
        draw.text((x + 16, y + 34), "GITHUB IMPACT & DNA RADAR", fill=(99, 102, 241), font=FONT_CARD_FOOTER)
        cell = 14
        pad = 3
        heat_colors = [(18, 30, 46), (14, 68, 41), (0, 109, 50), (38, 166, 65), (57, 211, 83)]
        import random
        rnd = random.Random(42)
        for gx in range(18):
            for gy in range(5):
                lvl = rnd.choice([0, 1, 2, 3, 4, 3, 2])
                draw.rectangle([x + 16 + gx * (cell + pad), y + 60 + gy * (cell + pad), x + 16 + gx * (cell + pad) + cell, y + 60 + gy * (cell + pad) + cell], fill=heat_colors[lvl])
        draw.text((x + 16, y + 155), "Impact Score: 94/100 | Top 1% TypeScript", fill=(0, 245, 160), font=FONT_CARD_FOOTER)

    elif day == 10: # MailCraft.AI
        # Email Subject & Open Rate
        draw.text((x + 16, y + 34), "AI SUBJECT LINE OPTIMIZER", fill=(236, 72, 153), font=FONT_CARD_FOOTER)
        draw.rounded_rectangle([x + 16, y + 56, x + w - 16, y + 110], radius=6, fill=(20, 26, 38))
        draw.text((x + 26, y + 64), "Subject: 30 AI Projects Shipped (Case Study)", fill=(255, 255, 255), font=FONT_CARD_FOOTER)
        draw.text((x + 26, y + 86), "Open Rate Predictor: 74.2%  |  High Urgency Hook", fill=(52, 211, 153), font=FONT_CARD_FOOTER)
        draw.rounded_rectangle([x + 16, y + 125, x + 180, y + 165], radius=6, fill=(35, 15, 28), outline=(236, 72, 153), width=1)
        draw.text((x + 30, y + 135), "SPAM SCORE: 0.0% CLEAN", fill=(244, 114, 182), font=FONT_CARD_FOOTER)

    elif day == 11: # RadVision.AI
        # Medical X-Ray GradCAM heatmap
        draw.text((x + 16, y + 34), "GRADCAM MEDICAL HEATMAP", fill=(6, 182, 212), font=FONT_CARD_FOOTER)
        draw.rounded_rectangle([x + 16, y + 58, x + 145, y + 170], radius=8, fill=(15, 23, 42), outline=(56, 189, 248), width=1)
        draw.ellipse([x + 55, y + 90, x + 110, y + 140], fill=(239, 68, 68))
        draw.ellipse([x + 65, y + 100, x + 100, y + 130], fill=(245, 158, 11))
        draw.text((x + 160, y + 68), "PNEUMONIA AI", fill=(239, 68, 68), font=FONT_CARD_TITLE)
        draw.text((x + 160, y + 96), "Confidence: 96.8%", fill=(255, 255, 255), font=FONT_CARD_FOOTER)
        draw.text((x + 160, y + 120), "Lower Lobe Opacity", fill=(148, 163, 184), font=FONT_CARD_FOOTER)
        draw.text((x + 160, y + 144), "GradCAM Thermal v2", fill=(6, 182, 212), font=FONT_CARD_FOOTER)

    elif day == 12: # AlgoCoach.AI
        # Big-O AST Curve
        draw.text((x + 16, y + 34), "BIG-O RUNTIME & COMPLEXITY", fill=(139, 92, 246), font=FONT_CARD_FOOTER)
        # Graph axes
        draw.line([(x + 30, y + 60), (x + 30, y + 155), (x + 220, y + 155)], fill=(50, 70, 95), width=2)
        # O(n log n) curve
        pts = [(x + 30 + t, y + 155 - int(0.6 * t * math.log(t + 2))) for t in range(0, 180, 6)]
        for k in range(len(pts) - 1):
            draw.line([pts[k], pts[k + 1]], fill=(139, 92, 246), width=3)
        draw.text((x + 235, y + 75), "Time: O(n log n)", fill=(0, 245, 160), font=FONT_CARD_FOOTER)
        draw.text((x + 235, y + 105), "Space: O(1) Aux", fill=(56, 189, 248), font=FONT_CARD_FOOTER)
        draw.text((x + 235, y + 135), "Status: OPTIMAL", fill=(34, 197, 94), font=FONT_CARD_TITLE)

    elif day == 13: # WealthPulse.AI
        # Monte Carlo FIRE Curves
        draw.text((x + 16, y + 34), "FIRE MONTE CARLO SIMULATION", fill=(16, 185, 129), font=FONT_CARD_FOOTER)
        draw.line([(x + 25, y + 155), (x + w - 25, y + 155)], fill=(30, 48, 70), width=1)
        for path_i, pcolor in enumerate([(16, 185, 129), (52, 211, 153), (56, 189, 248), (245, 158, 11)]):
            fpts = [(x + 25 + s * 14, y + 150 - int((s * 4) * (1.0 + path_i * 0.25))) for s in range(24)]
            for k in range(len(fpts) - 1):
                draw.line([fpts[k], fpts[k + 1]], fill=pcolor, width=2)
        draw.text((x + 25, y + 55), "FIRE Target: $2.5M | Age 44", fill=(255, 255, 255), font=FONT_CARD_FOOTER)

    elif day == 27: # QueryForge.AI
        # SQL Editor & Schema Visualizer
        draw.text((x + 16, y + 34), "NATURAL LANGUAGE -> SQL / ORM", fill=(14, 165, 233), font=FONT_CARD_FOOTER)
        sql_lines = [
            ("SELECT u.name, SUM(o.total) AS ltv", (14, 165, 233)),
            ("FROM users u JOIN orders o ON u.id = o.user_id", (255, 255, 255)),
            ("GROUP BY u.id HAVING ltv > 1000", (251, 191, 36)),
            ("ORDER BY ltv DESC LIMIT 10;", (52, 211, 153)),
        ]
        for i, (line, color) in enumerate(sql_lines):
            draw.text((x + 16, y + 58 + i * 24), line, fill=color, font=FONT_CARD_FOOTER)
        draw.rounded_rectangle([x + 16, y + h - 38, x + 210, y + h - 12], radius=4, fill=(14, 40, 60), outline=(14, 165, 233), width=1)
        draw.text((x + 24, y + h - 34), "EXPLAIN ANALYZE: 2.1ms", fill=(56, 189, 248), font=FONT_CARD_FOOTER)

    else:
        # Generic stylish UI preview fallback
        draw.text((x + 16, y + 34), "AI WORKFLOW ENGINE", fill=col, font=FONT_CARD_FOOTER)
        draw.rectangle([x + 16, y + 60, x + w - 16, y + 110], fill=(16, 26, 40))
        draw.text((x + 26, y + 74), f"Autonomous Agent Core #{day:02d}", fill=(255, 255, 255), font=FONT_CARD_TITLE)
        draw.text((x + 26, y + 125), "Gemini 2.5 Multi-Modal Pipeline Active", fill=(0, 245, 160), font=FONT_CARD_FOOTER)

def render_cards(img):
    draw = ImageDraw.Draw(img)

    # 5 columns x 6 rows = 30 cards
    cols = 5
    rows = 6

    margin_x = 70
    margin_top = 265
    margin_bottom = 135

    total_w = W - 2 * margin_x
    total_h = H - margin_top - margin_bottom

    gap_x = 24
    gap_y = 22

    card_w = (total_w - (cols - 1) * gap_x) // cols
    card_h = (total_h - (rows - 1) * gap_y) // rows

    for idx, p in enumerate(PROJECTS):
        c = idx % cols
        r = idx // cols

        x0 = margin_x + c * (card_w + gap_x)
        y0 = margin_top + r * (card_h + gap_y)
        x1 = x0 + card_w
        y1 = y0 + card_h

        col = p["color"]

        # Card container with glassmorphism border
        draw.rounded_rectangle([x0, y0, x1, y1], radius=14, fill=(10, 17, 26), outline=(26, 42, 62), width=2)

        # Subtle glowing top accent line
        draw.line([(x0 + 20, y0 + 1), (x1 - 20, y0 + 1)], fill=col, width=2)

        # Header: Day badge pill + Category
        # Day Badge Pill
        badge_str = f"{p['day']:02d}"
        draw.rounded_rectangle([x0 + 14, y0 + 14, x0 + 58, y0 + 42], radius=6, fill=(col[0]//6, col[1]//6, col[2]//6), outline=col, width=1)
        draw.text((x0 + 22, y0 + 18), badge_str, fill=col, font=FONT_CARD_TITLE)

        # Category tag
        draw.text((x0 + 68, y0 + 20), p["category"], fill=(148, 163, 184), font=FONT_CARD_TAG)

        # Project Name
        pname = p["name"]
        draw.text((x0 + 14, y0 + 50), pname, fill=(255, 255, 255), font=FONT_CARD_TITLE)

        # Dashboard Preview Box (height ~200px)
        dash_x = x0 + 12
        dash_y = y0 + 88
        dash_w = card_w - 24
        dash_h = card_h - 134

        # Check if we have a real GIF frame
        day_num = p["day"]
        frame_loaded = False

        if day_num in GIF_MAP:
            for gpath in GIF_MAP[day_num]:
                if os.path.exists(gpath):
                    try:
                        gif_im = Image.open(gpath)
                        frame_idx = min(15, gif_im.n_frames - 1)
                        gif_im.seek(frame_idx)
                        frame_rgb = gif_im.convert("RGB")

                        frame_resized = frame_rgb.resize((dash_w, dash_h), Image.Resampling.LANCZOS)
                        img.paste(frame_resized, (dash_x, dash_y))

                        draw.rounded_rectangle([dash_x, dash_y, dash_x + dash_w, dash_y + dash_h], radius=6, outline=(38, 58, 86), width=1)
                        draw.rectangle([dash_x, dash_y, dash_x + dash_w, dash_y + 18], fill=(11, 18, 28, 200))
                        draw.ellipse([dash_x + 8, dash_y + 5, dash_x + 14, dash_y + 11], fill=(239, 68, 68))
                        draw.ellipse([dash_x + 18, dash_y + 5, dash_x + 24, dash_y + 11], fill=(245, 158, 11))
                        draw.ellipse([dash_x + 28, dash_y + 5, dash_x + 34, dash_y + 11], fill=(34, 197, 94))
                        draw.text((dash_x + 44, dash_y + 2), f"{pname.lower()}.vercel.app", fill=(148, 163, 184), font=FONT_CARD_FOOTER)

                        frame_loaded = True
                        break
                    except Exception as e:
                        pass

        if not frame_loaded:
            draw_mock_dashboard(draw, dash_x, dash_y, dash_w, dash_h, p)

        # Card Footer: Tech tags
        draw.text((x0 + 16, y1 - 28), p["tag"], fill=(100, 116, 139), font=FONT_CARD_FOOTER)
        # Status green indicator
        draw.ellipse([x1 - 32, y1 - 24, x1 - 22, y1 - 14], fill=(34, 197, 94))
        draw.text((x1 - 80, y1 - 27), "LIVE", fill=(34, 197, 94), font=FONT_CARD_FOOTER)

def main():
    print("Generating 30-Day Master Showcase Poster (2400 x 3000)...")
    img = create_base_canvas()
    draw_header_and_footer(img)
    render_cards(img)

    out_png = "c:/Users/nabi4/OneDrive/Desktop/New folder/30-days-30-projects/poster_30_projects_full_grid.png"
    out_jpg = "c:/Users/nabi4/OneDrive/Desktop/New folder/30-days-30-projects/poster_30_projects_full_grid.jpg"

    print("Saving high-resolution PNG and JPEG...")
    img.save(out_png, "PNG", optimize=True)
    img.save(out_jpg, "JPEG", quality=95)

    print("Master poster successfully generated!")
    print(f"File 1: {out_png}")
    print(f"File 2: {out_jpg}")

if __name__ == "__main__":
    main()

