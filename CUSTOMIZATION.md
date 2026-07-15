# Customization Guide

## Changing Personal Info

Edit `content/portfolio.json`:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "tagline": "Your tagline...",
  "bio": "Your bio paragraph...",
  "email": "you@email.com",
  "location": "City, Country",
  "defaultTheme": "glassmorphism",
  "openToWork": true,
  "availability": "Open to full-time roles in...",
  "socials": [
    { "platform": "LinkedIn", "url": "https://linkedin.com/in/your-profile", "icon": "linkedin" },
    { "platform": "GitHub", "url": "https://github.com/yourusername", "icon": "github" }
  ]
}
```

## Adding a Project

Add to `content/projects.json`:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "description": "Short one-liner description",
  "longDescription": "Full detailed description...",
  "tech": ["Python", "React", "PostgreSQL"],
  "category": "ML / Full-Stack",
  "featured": true,
  "image": "/images/projects/your-image.png",
  "github": "https://github.com/...",
  "demo": "https://your-demo.vercel.app",
  "status": "completed",
  "highlights": ["Key achievement 1", "Key achievement 2"],
  "date": "2024-06"
}
```

## Updating Resume

Edit `content/resume.json`. The structure supports:
- `experience[]`: work history
- `education[]`: degrees
- `skills[]`: skill categories with lists
- `achievements[]`: awards and recognitions

## Adding Themes

1. Create `components/themes/my-theme/` with `Header.tsx`, `Hero.tsx`, `ProjectCard.tsx`
2. Add to `lib/themes.ts` THEMES object
3. Map in `components/shared/ThemedLayout.tsx` and `components/shared/ProjectsSection.tsx`
4. Add the Hero to the theme map in `app/page.tsx`
5. Add the ProjectCard to the theme map in `app/(routes)/projects/page.tsx`
