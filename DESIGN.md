---
name: Industrial Slate
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#424751'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#255ea7'
  primary: '#00356a'
  on-primary: '#ffffff'
  primary-container: '#004b93'
  on-primary-container: '#96bdff'
  inverse-primary: '#a8c8ff'
  secondary: '#5b5f63'
  on-secondary: '#ffffff'
  secondary-container: '#dfe3e8'
  on-secondary-container: '#616569'
  tertiary: '#6a1300'
  on-tertiary: '#ffffff'
  tertiary-container: '#912104'
  on-tertiary-container: '#ffa58f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#00468a'
  secondary-fixed: '#dfe3e8'
  secondary-fixed-dim: '#c3c7cc'
  on-secondary-fixed: '#181c20'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a2'
  on-tertiary-fixed: '#3d0700'
  on-tertiary-fixed-variant: '#8a1c00'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style

This design system embodies "Industrial Strength" through a lens of modern corporate sophistication. It is tailored for professional environments where reliability and structural integrity are paramount, such as construction, logistics, or industrial SaaS. 

The aesthetic is **Corporate / Modern** with a slight leaning toward high-end technical precision. It leverages the contrast between a muted, cool-toned slate background and high-impact brand colors to evoke a sense of organized efficiency. The user experience is designed to feel dependable, clear, and high-quality, utilizing soft shadows to lift information without sacrificing the grounded feel of a professional tool.

## Colors

The palette is anchored by a soft slate-blue background (**#F1F4F9**) which serves as a more sophisticated alternative to pure white, reducing eye strain and providing a subtle canvas for white UI elements (cards and inputs) to pop.

*   **Primary:** A deep, authoritative blue derived from the brand logo, used for key actions, headers, and navigation.
*   **Secondary/Background:** The slate-blue base provides a professional, "industrial" atmosphere.
*   **Accent:** A vibrant orange used sparingly for notifications, highlights, and primary "call-to-action" moments to ensure high visibility.
*   **Neutrals:** Deep grays with blue undertones maintain tonal consistency across text and borders.

## Typography

The typography strategy focuses on clarity and technical precision.

1.  **Headlines (Manrope):** Chosen for its modern, geometric construction. It feels fresh and balanced, providing a "high-tech" finish to the industrial theme.
2.  **Body (Work Sans):** A reliable and versatile typeface that excels in readability for data-heavy applications and professional documentation.
3.  **Labels (IBM Plex Sans):** A systematic, corporate font used for technical data, UI labels, and small text. It reinforces the industrial and engineering heritage of the brand.

For mobile, headlines scale down significantly to maintain hierarchy without overwhelming the screen. Use semi-bold weights for labels to ensure they stand out against the slate background.

## Layout & Spacing

The layout utilizes a **fixed grid** system for desktop to maintain a structured, "blueprint-like" organization, transitioning to a fluid model for mobile devices.

*   **Grid:** A 12-column grid with 24px gutters. Elements should align strictly to these columns to evoke a sense of structural engineering.
*   **Spacing Rhythm:** An 8px base unit (linear scaling) ensures consistency. 
*   **Breakpoints:**
    *   **Mobile (<600px):** Single column, 16px side margins.
    *   **Tablet (600px - 1024px):** 8-column grid, 24px margins.
    *   **Desktop (>1024px):** 12-column grid with a maximum container width of 1280px to prevent excessive line lengths.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to create a sophisticated sense of depth.

*   **Base Layer:** The slate (#F1F4F9) surface.
*   **Surface Layer:** White (#FFFFFF) containers used for cards, modals, and input fields.
*   **Shadows:** Low-opacity, diffused shadows (e.g., `0px 4px 20px rgba(0, 75, 147, 0.08)`). Note the subtle blue tint in the shadow to harmonize with the primary color and background.
*   **Dividers:** Use low-contrast borders (1px solid #E2E8F0) instead of shadows for secondary separation to keep the UI clean and industrial.

## Shapes

The shape language is defined by **Rounded (8px)** corners. This specific radius is large enough to feel modern and accessible but tight enough to maintain the "Industrial" character of the brand. 

*   **Standard (rounded-md):** 0.5rem (8px) for buttons, inputs, and small cards.
*   **Large (rounded-lg):** 1rem (16px) for large containers and modals.
*   **Extra Large (rounded-xl):** 1.5rem (24px) for hero elements or distinctive sections.

## Components

*   **Buttons:** Primary buttons use the deep blue with white text. CTA buttons use the brand orange. All buttons feature a subtle 1px inner light border on the top edge to give a slightly tactile, "pressed" industrial feel.
*   **Input Fields:** White background with an 8px radius. Use a 2px Primary Blue border for the focus state.
*   **Cards:** Use a white background and the "Ambient Shadow" defined in the Elevation section. No border is necessary when shadows are present.
*   **Chips/Tags:** Small 4px radius (Soft) to differentiate from main action buttons. Use the slate background with dark gray text for a "utility" look.
*   **Data Lists:** Use alternating row colors (White and Slate) for high legibility in data-heavy views. 
*   **Progress Indicators:** Use the brand orange to indicate active progress or status, ensuring the "industrial strength" narrative is paired with high-visibility feedback.